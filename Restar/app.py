# from fastapi import FastAPI, HTTPException
# from datetime import datetime
# import pandas as pd
# import csv
# import os
# from fastapi.middleware.cors import CORSMiddleware

# # Import from local files
# from models import *
# from recommender import DualRecommender  # Your existing recommender class

# # Initialize FastAPI app
# app = FastAPI(title="WhereToDine Recommender API")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods
#     allow_headers=["*"],  # Allows all headers
# )

# # Load the dataset and initialize recommender
# df = pd.read_csv('merged_file_all.csv', encoding="latin1")
# recommender = DualRecommender(df)

# # Create CSV files if they don't exist
# def initialize_csv_files():
#     input_headers = ['timestamp', 'recommendation_id', 'selected_restaurants', 'favorite_dishes']
#     output_headers = ['recommendation_id', 'recommended_restaurants', 'similar_dishes']
    
#     if not os.path.exists('recommendation_inputs.csv'):
#         with open('recommendation_inputs.csv', 'w', newline='') as f:
#             writer = csv.writer(f)
#             writer.writerow(input_headers)
    
#     if not os.path.exists('recommendation_outputs.csv'):
#         with open('recommendation_outputs.csv', 'w', newline='') as f:
#             writer = csv.writer(f)
#             writer.writerow(output_headers)

# initialize_csv_files()

# # Store input and output data
# def store_recommendation_data(recommendation_id: str, input_data: dict, output_data: dict):
#     # Store input
#     with open('recommendation_inputs.csv', 'a', newline='') as f:
#         writer = csv.writer(f)
#         writer.writerow([
#             datetime.now(),
#             recommendation_id,
#             str(input_data['restaurants']),
#             str(input_data.get('favorite_dishes', []))
#         ])
    
#     # Store output
#     with open('recommendation_outputs.csv', 'a', newline='') as f:
#         writer = csv.writer(f)
#         writer.writerow([
#             recommendation_id,
#             str(output_data['recommended_restaurants']),
#             str(output_data.get('similar_dishes', []))
#         ])

# @app.get("/cafe-names/")
# async def get_cafe_names():
#     """Endpoint to get the list of cafe names."""
#     try:
#         cafe_names = recommender.get_cafe_names()  # Call the method to get cafe names
#         return cafe_names
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
# @app.post("/recommendations/", response_model=RecommendationResponse)
# async def get_recommendations(request: RecommendationRequest):
#     try:
#         # Generate unique recommendation ID
#         recommendation_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        
#         # Get restaurant indices
#         selected_indices = []
#         for restaurant in request.restaurants:
#             idx = recommender.find_restaurant(restaurant.name)
#             if idx is not None:
#                 selected_indices.append(idx)
#             else:
#                 raise HTTPException(status_code=404, detail=f"Restaurant not found: {restaurant.name}")
        
#         # Get feature-based recommendations
#         feature_recs = recommender.feature_based_recommendations(selected_indices)
        
#         # Get menu-based recommendations if favorite dishes provided
#         menu_recs = []
#         similar_dishes = []
#         if request.favorite_dishes:
#             favorite_dishes = [dish.name for dish in request.favorite_dishes]
#             menu_recs = recommender.menu_based_recommendations(favorite_dishes)
#             similar_dishes = recommender.find_similar_menu_items(favorite_dishes)
        
#         # Combine recommendations
#         final_recommendations = recommender.combine_recommendations(feature_recs, menu_recs)
        
#         # Format response
#         recommended_restaurants = []
#         for idx, score in final_recommendations:
#             restaurant = df.iloc[idx]
#             sentiments = restaurant['sentiment_scores']
#             recommended_restaurants.append({
#                 'name': restaurant['name'],
#                 'address': restaurant['address'],
#                 'cuisines': restaurant['cuisines'],
#                 'votes': restaurant['votes'],
#                 'avg_price': float(restaurant['avg_price']),
#                 'positive_ratio': sentiments['positive_ratio'],
#                 'total_reviews': sentiments['total_reviews'],
#                 'highlights': restaurant['highlights'],
#                 'similarity_score': float(score)
#             })
        
#         response_data = {
#             'recommendation_id': recommendation_id,
#             'recommended_restaurants': recommended_restaurants,
#             'similar_dishes': similar_dishes
#         }
        
#         # Store input and output data
#         store_recommendation_data(
#             recommendation_id,
#             {'restaurants': [r.name for r in request.restaurants], 'favorite_dishes': request.favorite_dishes},
#             response_data
#         )
        
#         return response_data
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from Restar.recommender import DualRecommender
import pandas as pd

# Initialize logging for production
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load the restaurant dataset once
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, 'merged_file_all.csv')

df = pd.read_csv(csv_path, encoding="latin1")
recommender = DualRecommender(df)

# FastAPI application setup
app = FastAPI()

# Model for user input (restaurant names, favorite dishes)
class RestaurantRequest(BaseModel):
    restaurants: list
    favorite_dishes: list = []

@app.get("/")
async def root():
    """Root endpoint for health check or basic info"""
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to the Restaurant Recommender API!"}

@app.post("/recommendations")
async def get_recommendations(request: RestaurantRequest):
    """
    Generate restaurant recommendations based on provided restaurants and dishes.
    """
    logger.info("Recommendation request received")

    # Ensure at least 3 restaurants are selected
    if len(request.restaurants) < 3:
        logger.warning("Not enough restaurants selected: Minimum 3 required")
        raise HTTPException(status_code=400, detail="Please select at least 3 restaurants.")

    try:
        # Find indices of selected restaurants
        selected_indices = [recommender.find_restaurant(name) for name in request.restaurants]
        selected_indices = [idx for idx in selected_indices if idx is not None]

        if len(selected_indices) < 3:
            logger.warning(f"Some selected restaurants not found: {request.restaurants}")
            raise HTTPException(status_code=404, detail="Some restaurants not found. Please try again.")

        # Get feature-based recommendations
        feature_recs = recommender.feature_based_recommendations(selected_indices)
        
        # If user has provided favorite dishes, get menu-based recommendations
        menu_recs = []
        if request.favorite_dishes:
            menu_recs = recommender.menu_based_recommendations(request.favorite_dishes)

            # Find and display similar menu items if dishes are provided
            similar_items = recommender.find_similar_menu_items(request.favorite_dishes)
            recommender.display_menu_recommendations(similar_items)

        # Combine recommendations
        final_recs = recommender.combine_recommendations(feature_recs, menu_recs)

        # Return top recommendations
        response = []
        for idx, score in final_recs:
            restaurant = df.iloc[idx]
            response.append({
                "name": restaurant['name'],
                "address": restaurant['address'],
                "cuisines": restaurant['cuisines'],
                "avg_price": restaurant['avg_price'],
                "score": score
            })

        logger.info(f"Recommendations generated: {len(response)} restaurants")
        return {"recommendations": response}

    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
