import pandas as pd
import ast
import re
from typing import Dict, List, Optional, Tuple

class RestaurantRecommender:
    def __init__(self, data_path: str):
        self.df = pd.read_csv(data_path)
        self._preprocess_data()
    
    def _preprocess_data(self):
        """Preprocess the dataset."""
        self.df['Menu'] = self.df['Menu'].fillna('{}').apply(ast.literal_eval)
        self.df['Food Sentiments'] = self.df['Food Sentiments'].apply(
            lambda x: ast.literal_eval(x) if pd.notna(x) and isinstance(x, str) else {}
        )
        self.df['aggregate_rating'] = pd.to_numeric(self.df['aggregate_rating'], errors='coerce')

        highlight_cols = [col for col in self.df.columns if col.startswith('highlights_')]
        self.df['all_highlights'] = self.df[highlight_cols].apply(
            lambda row: [col.replace('highlights_', '') for col in highlight_cols if row[col] == 1], 
            axis=1
        )
    
    def _get_numeric_price(self, price) -> float:
        try:
            return float(re.findall(r'\d+', str(price))[0])
        except (IndexError, ValueError):
            return float('inf')
    
    def _find_menu_items(self, menu: Dict, item_keyword: str, max_price: Optional[float]) -> List[Tuple[str, float]]:
        matching_items = []
        for item_name, (food_type, price) in menu.items():
            numeric_price = self._get_numeric_price(price)
            if item_keyword.lower() in item_name.lower() and (max_price is None or numeric_price <= max_price):
                matching_items.append((item_name, numeric_price))
        return matching_items
    
    def _calculate_score(self, row: pd.Series, menu_item: str) -> float:
        """Calculate score based on positive reviews or aggregate rating."""
        if menu_item not in row['Food Sentiments']:
            return 0  # If the item isn't found, return 0 instead of None
        
        positive_count = row['Food Sentiments'].get(menu_item, {}).get('positive', 0)
        return positive_count if positive_count > 0 else row['aggregate_rating'] if pd.notna(row['aggregate_rating']) else 0
    
    def get_recommendations(self, area: str, cuisine: Optional[str] = None, max_price: Optional[float] = None, 
                            menu_item: Optional[str] = None, max_item_price: Optional[float] = None, top_n: int = 5):
        """Get restaurant recommendations."""
        filtered_df = self.df[self.df['locality'].str.lower() == area.lower()] if area else self.df.copy()
        
        if cuisine:
            filtered_df = filtered_df[filtered_df['cuisines'].str.contains(cuisine, case=False, na=False)]
        
        if max_price:
            filtered_df['average_cost_for_two'] = pd.to_numeric(filtered_df['average_cost_for_two'], errors='coerce')
            filtered_df = filtered_df[filtered_df['average_cost_for_two'] <= max_price]
        
        if menu_item:
            all_food_items = set()
            for menu in self.df['Menu']:
                all_food_items.update(menu.keys())

            if menu_item.lower() not in map(str.lower, all_food_items):
                print(f"❌ Food item '{menu_item}' not available in any restaurant.")
                return pd.DataFrame()
            
            filtered_df['matching_items'] = filtered_df['Menu'].apply(
                lambda x: self._find_menu_items(x, menu_item, max_item_price)
            )
            filtered_df = filtered_df[filtered_df['matching_items'].str.len() > 0]

            filtered_df['score'] = filtered_df.apply(
                lambda row: self._calculate_score(row, menu_item.lower()), axis=1
            )

            filtered_df = filtered_df.sort_values(['score', 'votes'], ascending=[False, False])
        else:
            filtered_df = filtered_df.sort_values(['aggregate_rating', 'votes'], ascending=[False, False])

        return filtered_df[['name', 'address', 'city', 'cuisines', 'average_cost_for_two', 
                            'votes', 'all_highlights', 'Menu', 'matching_items', 'aggregate_rating']].head(top_n)

if __name__ == "__main__":
    recommender = RestaurantRecommender("hogaya_dataset.csv")
    
    print("\n🍽 Restaurant Recommendation System")
    
    area = input("Enter Area (or press Enter to skip): ").strip() or None
    max_price = float(input("Enter max price for two (or press Enter to skip): ") or "inf")
    cuisine = input("Enter cuisine (or press Enter to skip): ").strip() or None
    menu_item = input("Enter food item (or press Enter to skip): ").strip() or None
    max_item_price = float(input("Enter max item price (or press Enter to skip): ") or "inf") if menu_item else None
    
    recommendations = recommender.get_recommendations(
        area=area, cuisine=cuisine, max_price=max_price, 
        menu_item=menu_item, max_item_price=max_item_price
    )
    
    if recommendations.empty:
        print("\n❌ No restaurants found matching your criteria.")
    else:
        print("\n🌟 Top Recommended Restaurants:")
        print(recommendations)
