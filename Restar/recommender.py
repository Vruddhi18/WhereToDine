# !pip install fuzzywuzzy
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import fuzz
import re
import ast

class DualRecommender:
    def __init__(self, df, min_votes=50):
        self.df = df
        self.min_votes = min_votes
        self._prepare_data()
        self._initialize_models()

    def _prepare_data(self):
        """Prepare and clean the dataset"""
        # Basic cleaning
        self.df['votes'] = pd.to_numeric(self.df['votes'], errors='coerce')
        self.df['cleaned_name'] = self.df['name'].astype(str)
        self.df['cleaned_name'] = self.df['cleaned_name'].replace("","\\")

        # Extract base restaurant names (removing location identifiers)
        self.df['base_name'] = self.df['cleaned_name'].apply(self._extract_base_name)

        # Process food sentiments
        self.df['sentiment_scores'] = self.df['Food Sentiments'].apply(self._process_food_sentiments)

        # Get average price from menu
        self.df['avg_price'] = self.df['Menu'].apply(self._get_avg_price)

        # Normalize numerical features
        self._normalize_features()

    def _extract_base_name(self, name):
        """Extract base restaurant name by removing location identifiers"""
        # Common location identifiers and branch indicators
        location_indicators = [
            r'\b(branch)\b', r'\b(outlet)\b', r'-.*$', r'\(.*\)',
            r',.*$', r'\d+(?:st|nd|rd|th).*$'
        ]

        base_name = name
        for indicator in location_indicators:
            base_name = re.sub(indicator, '', base_name, flags=re.IGNORECASE)

        return base_name.strip()

    def _process_food_sentiments(self, sentiments_str):
        """Process food sentiments from string format"""
        try:
            if pd.isna(sentiments_str):
                return {'positive_ratio': 0, 'total_reviews': 0}

            # Convert string to dictionary
            sentiments_dict = ast.literal_eval(sentiments_str)

            # Calculate total positive and negative reviews
            total_positive = sum(item.get('positive', 0) for item in sentiments_dict.values())
            total_negative = sum(item.get('negative', 0) for item in sentiments_dict.values())
            total = total_positive + total_negative

            return {
                'positive_ratio': total_positive / total if total > 0 else 0,
                'total_reviews': total
            }
        except:
            return {'positive_ratio': 0, 'total_reviews': 0}

    def _process_menu(self, menu_str):
        """Process menu string into a list of items with their details"""
        try:
            if pd.isna(menu_str):
                return []

            # Convert string to dictionary
            menu_dict = ast.literal_eval(menu_str)

            # Extract menu items and their details
            menu_items = []
            for item, details in menu_dict.items():
                # Handle the format {"item": ["veg/non-veg", price]}
                veg_status, price = details
                menu_items.append({
                    'item': item.lower(),
                    'veg_status': veg_status,
                    'price': float(price)
                })
            return menu_items
        except:
            return []

    def _get_avg_price(self, menu_str):
        """Calculate average price from menu items"""
        try:
            menu_items = self._process_menu(menu_str)
            prices = [item['price'] for item in menu_items if item['price'] > 0]
            return np.mean(prices) if prices else 0
        except:
            return 0

    def _normalize_features(self):
        """Normalize numerical features"""
        for column in ['votes', 'avg_price']:
            if column in self.df.columns:
                self.df[f'normalized_{column}'] = (
                    (self.df[column] - self.df[column].min()) /
                    (self.df[column].max() - self.df[column].min())
                ).fillna(0)

    def _initialize_models(self):
        """Initialize both recommendation models"""
        # Feature-based model initialization
        self.feature_vectorizer = TfidfVectorizer(stop_words='english')
        self.df['combined_features'] = self.df.apply(self._combine_features, axis=1)
        self.feature_matrix = self.feature_vectorizer.fit_transform(self.df['combined_features'])

        # Menu-based model initialization
        self.menu_vectorizer = TfidfVectorizer(stop_words='english')
        self.df['menu_text'] = self.df['Menu'].apply(
            lambda x: ' '.join([item['item'] for item in self._process_menu(x)])
        )
        self.menu_matrix = self.menu_vectorizer.fit_transform(self.df['menu_text'])

    def _combine_features(self, row):
        """Combine restaurant features into a single string"""
        features = []

        # Add core features
        if pd.notna(row['cuisines']):
            features.append(str(row['cuisines']))

        if pd.notna(row['address']):
            features.append(str(row['address']))

        if pd.notna(row['establishment']):
            features.append(str(row['establishment']))

        if pd.notna(row['highlights']):
            features.append(str(row['highlights']))

        # Add price range indicator based on average price
        if row['avg_price'] > 0:
            price_level = "budget" if row['avg_price'] < 300 else \
                         "mid_range" if row['avg_price'] < 600 else "expensive"
            features.append(price_level)

        combined = ' '.join(features).lower()
        return re.sub(r'[^a-zA-Z0-9\s]', ' ', combined)

    def find_restaurant(self, name):
        """Find restaurant using fuzzy matching"""
        name = name.lower().strip()
        similarities = [(idx, fuzz.ratio(name, str(rest_name)))
                       for idx, rest_name in enumerate(self.df['cleaned_name'])]
        best_match = max(similarities, key=lambda x: x[1])
        return best_match[0] if best_match[1] > 60 else None

    def find_similar_menu_items(self, favorite_dishes):
        """Find similar menu items across all restaurants"""
        similar_items = []

        for dish in favorite_dishes:
            dish_lower = dish.lower()
            for idx, row in self.df.iterrows():
                menu_items = self._process_menu(row['Menu'])
                for menu_item in menu_items:
                    item_name = menu_item['item']
                    similarity = fuzz.ratio(dish_lower, item_name)
                    if similarity > 70:  # Threshold for similarity
                        similar_items.append({
                            'restaurant': row['name'],
                            'original_dish': dish,
                            'similar_dish': item_name,
                            'price': menu_item['price'],
                            'veg_status': menu_item['veg_status'],
                            'similarity': similarity
                        })

        # Sort by similarity and remove duplicates
        similar_items.sort(key=lambda x: x['similarity'], reverse=True)

        # Remove duplicate dishes from same restaurant
        unique_items = []
        seen = set()
        for item in similar_items:
            key = (item['restaurant'], item['similar_dish'])
            if key not in seen:
                unique_items.append(item)
                seen.add(key)

        return unique_items
    def display_menu_recommendations(self, similar_items):
      """Display menu recommendations in a formatted way"""
      if not similar_items:
          print("\n❌ No similar dishes found.")
          return

      print("\n🍽️ Similar Dishes You Might Enjoy:")
      print("-" * 80)

      for idx, item in enumerate(similar_items[:10], 1):
          print(f"\n{idx}. {item['similar_dish']}")
          print(f"📍 {item['restaurant']}")
          print(f"   {item['address']}")
          print(f"💰 Price: ₹{item['price']:.2f}")
          print(f"🥬 Type: {item['veg_status']}")
          if item['rating']:
              print(f"⭐ Restaurant Rating: {item['rating']}")
          print(f"📊 Similarity to '{item['original_dish']}': {item['similarity']}%")
          print("-" * 40)

    def feature_based_recommendations(self, selected_indices, n_recommendations=20):
        """Generate recommendations based on restaurant features"""
        if not selected_indices:
            return []

        # Calculate feature similarity
        selected_vectors = self.feature_matrix[selected_indices]
        average_vector = selected_vectors.mean(axis=0)

        average_vector = average_vector.A
        feature_similarities = cosine_similarity(self.feature_matrix, average_vector)
        # Calculate quality score
        quality_scores = (
            0.4 * self.df['sentiment_scores'].apply(lambda x: x['positive_ratio']) +
            0.3 * self.df['normalized_votes'] +
            0.3 * self.df['sentiment_scores'].apply(lambda x: min(x['total_reviews'] / 100, 1))
        )

        # Combine similarity with quality score
        feature_scores = feature_similarities.flatten() * quality_scores

        return self._get_top_recommendations(feature_scores, selected_indices, n_recommendations)

    def find_similar_menu_items(self, favorite_dishes):
      """Find similar menu items across all restaurants"""
      similar_items = []

      for dish in favorite_dishes:
          dish_lower = dish.lower()
          for idx, row in self.df.iterrows():
              try:
                  menu_dict = ast.literal_eval(row['Menu']) if isinstance(row['Menu'], str) else row['Menu']
                  for item_name, (veg_status, price) in menu_dict.items():
                      similarity = fuzz.ratio(dish_lower, item_name.lower())
                      if similarity > 70:  # Threshold for similarity
                          similar_items.append({
                              'restaurant': row['name'],
                              'original_dish': dish,
                              'similar_dish': item_name,
                              'price': float(price),
                              'veg_status': veg_status,
                              'similarity': similarity,
                              'rating': row['aggregate_rating'] if 'aggregate_rating' in row else None,
                              'address': row['address']
                          })
              except:
                  continue

      # Sort by similarity and remove duplicates
      similar_items.sort(key=lambda x: (-x['similarity'], -x['price']))

      # Remove duplicate dishes from same restaurant
      unique_items = []
      seen = set()
      for item in similar_items:
          key = (item['restaurant'], item['similar_dish'])
          if key not in seen:
              unique_items.append(item)
              seen.add(key)

      return unique_items
    def menu_based_recommendations(self, favorite_dishes, n_recommendations=10):
        """Generate recommendations based on menu similarity"""
        if not favorite_dishes:
            return []

        # Create a query vector from favorite dishes
        query_vector = self.menu_vectorizer.transform([' '.join(favorite_dishes)])

        # Calculate menu similarity
        menu_similarities = cosine_similarity(self.menu_matrix, query_vector)

        # Calculate quality score
        quality_scores = (
            0.4 * self.df['sentiment_scores'].apply(lambda x: x['positive_ratio']) +
            0.3 * self.df['normalized_votes'] +
            0.3 * self.df['sentiment_scores'].apply(lambda x: min(x['total_reviews'] / 100, 1))
        )

        # Combine similarity with quality score
        menu_scores = menu_similarities.flatten() * quality_scores

        return self._get_top_recommendations(menu_scores, [], n_recommendations) # Excluding selected indices as it's menu based

    def _get_top_recommendations(self, scores, excluded_indices, n):
        """Get top recommendations excluding certain indices and same-brand restaurants"""
        # Apply minimum votes filter
        mask = (self.df['votes'] >= self.min_votes)

        # Get base names of excluded restaurants
        excluded_base_names = set()
        for idx in excluded_indices:
            excluded_base_names.add(self.df.iloc[idx]['base_name'])

        # Create scored indices excluding selected restaurants and their branches
        scored_indices = []
        seen_base_names = set()

        for i in range(len(self.df)):
            if (i not in excluded_indices and
                mask[i] and
                self.df.iloc[i]['base_name'] not in excluded_base_names and
                self.df.iloc[i]['base_name'] not in seen_base_names):

                scored_indices.append((i, scores[i]))
                seen_base_names.add(self.df.iloc[i]['base_name'])

        # Sort and return top recommendations
        return sorted(scored_indices, key=lambda x: x[1], reverse=True)[:n]

    def combine_recommendations(self, feature_recs, menu_recs, weights=(0.7, 0.3)):
        """Combine recommendations from both models"""
        feature_scores = {idx: score * weights[0] for idx, score in feature_recs}
        menu_scores = {idx: score * weights[1] for idx, score in menu_recs}

        combined_scores = {}
        for idx in set(feature_scores.keys()) | set(menu_scores.keys()):
            combined_scores[idx] = feature_scores.get(idx, 0) + menu_scores.get(idx, 0)

        return sorted(
            [(idx, score) for idx, score in combined_scores.items()],
            key=lambda x: x[1],
            reverse=True
        )[:10]

    def get_recommendations(self):
      """Interactive recommendation process"""
      print("\n🍽️ Welcome to the Restaurant Recommender!")
      print("-" * 40)

      # Get restaurant selections
      selected_indices = []
      print("\nPlease select 3-5 restaurants you like:")
      while len(selected_indices) < 3 or (len(selected_indices) < 5 and
            input("\nWould you like to add another restaurant? (y/n): ").lower() == 'y'):
          name = input("Enter restaurant name: ")
          idx = self.find_restaurant(name)
          if idx is not None:
              restaurant = self.df.iloc[idx]
              print(f"\n📍 Found: {restaurant['name']}")
              print(f"   {restaurant['address']}")
              print(f"🍳 Cuisines: {restaurant['cuisines']}")
              if input("Is this correct? (y/n): ").lower() == 'y':
                  selected_indices.append(idx)
                  print(f"✅ Added! ({len(selected_indices)}/5 restaurants selected)")
          else:
              print("❌ Restaurant not found. Please try another name.")

      # Get feature-based recommendations
      feature_recs = self.feature_based_recommendations(selected_indices)

      # Optional: Get menu-based recommendations
      menu_recs = []
      favorite_dishes = []
      if input("\nWould you like to enter your favorite dishes? (y/n): ").lower() == 'y':
          while True:
              dish = input("Enter a favorite dish (or 'done' to finish): ")
              if dish.lower() == 'done':
                  break
              favorite_dishes.append(dish)
          menu_recs = self.menu_based_recommendations(favorite_dishes)

          # Find and display similar menu items
          if favorite_dishes:
              similar_items = self.find_similar_menu_items(favorite_dishes)
              self.display_menu_recommendations(similar_items)

      # Combine and display final recommendations
      final_recommendations = self.combine_recommendations(feature_recs, menu_recs)

      print("\n🌟 Top Recommended Restaurants:")
      print("-" * 80)

      for idx, score in final_recommendations:
          restaurant = self.df.iloc[idx]
          sentiments = restaurant['sentiment_scores']
          print(f"\n📍 {restaurant['name']}")
          print(f"   {restaurant['address']}")
          print(f"🍳 Cuisines: {restaurant['cuisines']}")
          print(f"👥 Votes: {restaurant['votes']}")
          print(f"💰 Average Cost: ₹{restaurant['avg_price']:.0f}")
          print(f"👍 Positive Reviews: {sentiments['positive_ratio']*100:.1f}%")
          print(f"📊 Total Reviews: {sentiments['total_reviews']}")
          if restaurant['highlights']:
              print(f"✨ Highlights: {restaurant['highlights']}")
          print(f"⭐ Similarity Score: {score:.2f}")
          print("-" * 40)
# Example usage
def main():
    # Load dataset
    df = pd.read_csv('merged_file_all.csv',encoding="latin1")

    # Initialize recommender
    recommender = DualRecommender(df)

    # Get recommendations
    recommender.get_recommendations()

if __name__ == "__main__":
    main()