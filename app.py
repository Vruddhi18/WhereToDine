from fastapi import FastAPI, HTTPException
from datetime import datetime
import pandas as pd
import csv
import os
from fastapi.middleware.cors import CORSMiddleware

# Import from local files
from models import *
from recommender import DualRecommender  # Your existing recommender class

# Initialize FastAPI app
app = FastAPI(title="WhereToDine Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the dataset and initialize recommender
df = pd.read_csv('merged_file_all.csv', encoding="latin1")
recommender = DualRecommender(df)

# Create CSV files if they don't exist
def initialize_csv_files():
    input_headers = ['timestamp', 'recommendation_id', 'selected_restaurants', 'favorite_dishes']
    output_headers = ['recommendation_id', 'recommended_restaurants', 'similar_dishes']
    
    if not os.path.exists('recommendation_inputs.csv'):
        with open('recommendation_inputs.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(input_headers)
    
    if not os.path.exists('recommendation_outputs.csv'):
        with open('recommendation_outputs.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(output_headers)

initialize_csv_files()

# Store input and output data
def store_recommendation_data(recommendation_id: str, input_data: dict, output_data: dict):
    # Store input
    with open('recommendation_inputs.csv', 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            datetime.now(),
            recommendation_id,
            str(input_data['restaurants']),
            str(input_data.get('favorite_dishes', []))
        ])
    
    # Store output
    with open('recommendation_outputs.csv', 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            recommendation_id,
            str(output_data['recommended_restaurants']),
            str(output_data.get('similar_dishes', []))
        ])

@app.post("/recommendations/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        # Generate unique recommendation ID
        recommendation_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Get restaurant indices
        selected_indices = []
        for restaurant in request.restaurants:
            idx = recommender.find_restaurant(restaurant.name)
            if idx is not None:
                selected_indices.append(idx)
            else:
                raise HTTPException(status_code=404, detail=f"Restaurant not found: {restaurant.name}")
        
        # Get feature-based recommendations
        feature_recs = recommender.feature_based_recommendations(selected_indices)
        
        # Get menu-based recommendations if favorite dishes provided
        menu_recs = []
        similar_dishes = []
        if request.favorite_dishes:
            favorite_dishes = [dish.name for dish in request.favorite_dishes]
            menu_recs = recommender.menu_based_recommendations(favorite_dishes)
            similar_dishes = recommender.find_similar_menu_items(favorite_dishes)
        
        # Combine recommendations
        final_recommendations = recommender.combine_recommendations(feature_recs, menu_recs)
        
        # Format response
        recommended_restaurants = []
        for idx, score in final_recommendations:
            restaurant = df.iloc[idx]
            sentiments = restaurant['sentiment_scores']
            recommended_restaurants.append({
                'name': restaurant['name'],
                'address': restaurant['address'],
                'cuisines': restaurant['cuisines'],
                'votes': restaurant['votes'],
                'avg_price': float(restaurant['avg_price']),
                'positive_ratio': sentiments['positive_ratio'],
                'total_reviews': sentiments['total_reviews'],
                'highlights': restaurant['highlights'],
                'similarity_score': float(score)
            })
        
        response_data = {
            'recommendation_id': recommendation_id,
            'recommended_restaurants': recommended_restaurants,
            'similar_dishes': similar_dishes
        }
        
        # Store input and output data
        store_recommendation_data(
            recommendation_id,
            {'restaurants': [r.name for r in request.restaurants], 'favorite_dishes': request.favorite_dishes},
            response_data
        )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}