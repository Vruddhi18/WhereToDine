from flask import Flask, request, jsonify
import pandas as pd
import ast
from recommender import RestaurantRecommender  # Import your model

app = Flask(__name__)
recommender = RestaurantRecommender("hogaya_dataset.csv")

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    area = data.get('area')
    cuisine = data.get('cuisine')
    max_price = float(data.get('max_price', float('inf')))
    menu_item = data.get('menu_item')
    max_item_price = float(data.get('max_item_price', float('inf'))) if menu_item else None

    recommendations, _ = recommender.get_recommendations(
        area=area,
        cuisine=cuisine,
        max_price=max_price,
        menu_item=menu_item,
        max_item_price=max_item_price
    )

    return jsonify(recommendations.to_dict(orient='records'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

