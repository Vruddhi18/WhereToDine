from flask import Flask, render_template, request
import pickle
import pandas as pd  # Import pandas to handle CSV files

app = Flask(__name__)

# Load the recommendation model
with open("popup_recommender.pkl", "rb") as file:
    model = pickle.load(file,encoding="latin1")

# Load the CSV data
CSV_FILE_PATH = r"C:/Users/fortune/Downloads/Restar/Restar/hogaya_dataset.csv"  # Update this with the actual CSV file path

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/recommend", methods=["POST"])
def recommend():
    # Get user input from the form
    area = request.form.get("area")
    max_price = request.form.get("max_price")
    cuisine = request.form.get("cuisine")
    food_item = request.form.get("food_item")
    max_item_price = request.form.get("max_item_price")

    # Convert prices to float if provided
    max_price = float(max_price) if max_price else None
    max_item_price = float(max_item_price) if max_item_price else None

    # Pass user input to model and get recommendations
    user_input = {
        "area": area,
        "max_price": max_price,
        "cuisine": cuisine,
        "food_item": food_item,
        "max_item_price": max_item_price
    }
    
    recommendations = model.predict(user_input) if hasattr(model, "predict") else []

    # Load the CSV file and filter based on recommendations
    df = pd.read_csv(CSV_FILE_PATH,encoding="latin1")

    # Example: If recommendations are food items, filter rows where 'food_item' matches
    filtered_recommendations = df[df["food_item"].isin(recommendations)]  

    # Convert to dictionary for rendering in HTML
    recommendations_list = filtered_recommendations.to_dict(orient="records")

    return render_template("results.html", recommendations=recommendations_list, area=area)

if __name__ == "__main__":
    app.run(debug=True)
