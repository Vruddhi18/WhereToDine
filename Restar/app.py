from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import pandas as pd
import os
import math
import logging

# Local imports
from models import *
from recommender import DualRecommender

# Initialize logger
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="WhereToDine Recommender API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset and initialize recommender
try:
    df = pd.read_csv('merged_file_all.csv', encoding="latin1")
    recommender = DualRecommender(df)
    logger.info("Dataset loaded and recommender initialized.")
except Exception as e:
    logger.exception("Failed to load dataset or initialize recommender.")
    raise RuntimeError("Initialization error: could not load dataset or recommender.")

def clean_dict(obj):
    """Replace NaN and Inf with None for JSON serialization."""
    for key, value in obj.items():
        if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
            obj[key] = None
    return obj

@app.get("/cafe-names/")
async def get_cafe_names():
    """Endpoint to return the list of cafe names."""
    try:
        cafe_names = recommender.get_cafe_names()
        logger.info("Fetched cafe names.")
        return cafe_names
    except Exception as e:
        logger.exception("Failed to fetch cafe names.")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommendations/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """Endpoint to get restaurant recommendations."""
    try:
        recommendation_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        logger.info(f"Processing recommendation request ID: {recommendation_id}")

        # Map selected restaurant names to indices
        selected_indices = []
        for restaurant in request.restaurants:
            idx = recommender.find_restaurant(restaurant.name)
            if idx is not None:
                selected_indices.append(idx)
            else:
                logger.warning(f"Restaurant not found: {restaurant.name}")
                raise HTTPException(status_code=404, detail=f"Restaurant not found: {restaurant.name}")

        # Generate recommendations
        feature_recs = recommender.feature_based_recommendations(selected_indices)
        menu_recs = []
        similar_dishes = []

        if request.favorite_dishes:
            favorite_dish_names = [dish.name for dish in request.favorite_dishes]
            menu_recs = recommender.menu_based_recommendations(favorite_dish_names)
            similar_dishes = recommender.find_similar_menu_items(favorite_dish_names)
            logger.info(f"Menu-based recommendations generated for dishes: {favorite_dish_names}")

        final_recommendations = recommender.combine_recommendations(feature_recs, menu_recs)

        # Format response
        recommended_restaurants = []
        for idx, score in final_recommendations:
            restaurant = df.iloc[idx]
            sentiments = restaurant['sentiment_scores']
            restaurant_data = {
                'name': restaurant['name'],
                'address': restaurant['address'],
                'cuisines': restaurant['cuisines'],
                'votes': restaurant['votes'],
                'avg_price': float(restaurant['avg_price']),
                'positive_ratio': sentiments['positive_ratio'],
                'total_reviews': sentiments['total_reviews'],
                'highlights': restaurant['highlights'],
                'similarity_score': float(score)
            }
            recommended_restaurants.append(clean_dict(restaurant_data))

        logger.info(f"Returning {len(recommended_restaurants)} recommendations for ID: {recommendation_id}")

        return {
            'recommendation_id': recommendation_id,
            'recommended_restaurants': recommended_restaurants,
            'similar_dishes': similar_dishes
        }

    except Exception as e:
        logger.exception("Failed to generate recommendations.")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# import logging
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from recommender import DualRecommender
# import pandas as pd
# import os

# # Initialize logging for production
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # Load the restaurant dataset once
# current_dir = os.path.dirname(os.path.abspath(__file__))
# csv_path = os.path.join(current_dir, 'merged_file_all.csv')
# df = pd.read_csv(csv_path, encoding="latin1")
# recommender = DualRecommender(df)

# # FastAPI application setup
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://where-to-dine.vercel.app"],  # Vercel URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Model for user input (restaurant names, favorite dishes)
# class RestaurantRequest(BaseModel):
#     restaurants: list
#     favorite_dishes: list = []

# @app.get("/")
# async def root():
#     """Root endpoint for health check or basic info"""
#     logger.info("Root endpoint accessed")
#     return {"message": "Welcome to the Restaurant Recommender API!"}

# @app.post("/recommendations")
# async def get_recommendations(request: RestaurantRequest):
#     """
#     Generate restaurant recommendations based on provided restaurants and dishes.
#     """
#     logger.info("Recommendation request received")

#     # Ensure at least 3 restaurants are selected
#     if len(request.restaurants) < 3:
#         logger.warning("Not enough restaurants selected: Minimum 3 required")
#         raise HTTPException(status_code=400, detail="Please select at least 3 restaurants.")

#     try:
#         # Find indices of selected restaurants using fuzzy matching
#         selected_indices = []
#         for name in request.restaurants:
#             index = recommender.find_restaurant(name)
#             if index is not None:
#                 selected_indices.append(index)
#             else:
#                 logger.warning(f"Restaurant '{name}' not found after fuzzy matching.")

#         # Ensure we have enough valid indices
#         if len(selected_indices) < 3:
#             logger.warning(f"Some selected restaurants not found: {request.restaurants}")
#             raise HTTPException(status_code=404, detail="Some restaurants not found. Please try again.")

#         # Get feature-based recommendations
#         feature_recs = recommender.feature_based_recommendations(selected_indices)
        
#         # If user has provided favorite dishes, get menu-based recommendations
#         menu_recs = []
#         if request.favorite_dishes:
#             logger.info(f"Favorite dishes provided: {request.favorite_dishes}")
#             menu_recs = recommender.menu_based_recommendations(request.favorite_dishes)

#             # Find and display similar menu items if dishes are provided
#             similar_items = recommender.find_similar_menu_items(request.favorite_dishes)
#             recommender.display_menu_recommendations(similar_items)

#         # Combine recommendations
#         final_recs = recommender.combine_recommendations(feature_recs, menu_recs)

#         # Return top recommendations
#         response = []
#         for idx, score in final_recs:
#             restaurant = df.iloc[idx]
#             response.append({
#                 "name": restaurant['name'],
#                 "address": restaurant['address'],
#                 "cuisines": restaurant['cuisines'],
#                 "avg_price": restaurant['avg_price'],
#                 "score": score
#             })

#         logger.info(f"Recommendations generated: {len(response)} restaurants")
#         return {"recommendations": response}

#     except Exception as e:
#         logger.error(f"Error generating recommendations: {str(e)}")
#         raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
