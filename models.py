from pydantic import BaseModel
from typing import List, Optional

class Restaurant(BaseModel):
    name: str

class Dish(BaseModel):
    name: str

class RecommendationRequest(BaseModel):
    restaurants: List[Restaurant]
    favorite_dishes: Optional[List[Dish]] = None

class SimilarDish(BaseModel):
    restaurant: str
    original_dish: str
    similar_dish: str
    price: float
    veg_status: str
    similarity: float
    rating: Optional[float]
    address: str

class RecommendationResponse(BaseModel):
    recommended_restaurants: List[dict]
    similar_dishes: Optional[List[SimilarDish]] = None
    recommendation_id: str