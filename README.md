# WhereToDine

## 📌 Overview
WhereToDine is an AI-powered restaurant recommendation system that helps users find the best dining options based on their preferences. The system leverages a hybrid recommendation model combining content-based and collaborative filtering to ensure accurate and personalized suggestions.

## 🎯 Features
- **Personalized Recommendations**: Suggests restaurants based on user preferences, including cuisine type, price range, ambiance, and specific food items.
- **Hybrid Recommendation System**: Utilizes content-based filtering (restaurant attributes) and collaborative filtering (user reviews) for improved accuracy.
- **Data-Driven Insights**: Analyzes restaurant features, reviews, and menu data to enhance recommendations.
- **User-Centric Filtering**: Allows users to filter recommendations based on location, cuisine, and budget constraints.
- **Review & Sentiment Analysis**: Evaluates customer reviews to identify trending dishes and user sentiments.

## 🔍 How It Works
1. **Data Preprocessing**: Cleans and structures data from restaurant listings, reviews, and menus.
2. **Feature Engineering**: Extracts meaningful features from reviews, ratings, and restaurant descriptions.
3. **Hybrid Recommendation Model**:
   - **Content-Based Filtering**: Matches user preferences with restaurant attributes.
   - **Collaborative Filtering**: Leverages user reviews and ratings for better recommendations.
4. **User Query Processing**: Takes input (cuisine, budget, ambiance, dish preference) and returns the best matching restaurants.
5. **Result Optimization**: Filters out unsuitable options to ensure high-quality suggestions.

## 🚀 Deployment
- The system can be deployed as a **web application** or **API** to integrate with other platforms.
- Future enhancements may include **real-time user feedback** to refine recommendations further.

## 📌 Future Scope
- **Real-Time User Feedback**: Improve recommendation accuracy by incorporating user choices.
- **Geospatial Analysis**: Enhance location-based recommendations using mapping APIs.
- **Mobile App Integration**: Expand accessibility through a dedicated mobile application.

## 🤖 Technologies Used
- **Python** (Pandas, NumPy, Scikit-Learn, TensorFlow)
- **Machine Learning** (Hybrid Recommendation System)
- **NLP** (Sentiment Analysis on Reviews) **FastAPI** (For Model Deployment)
- **HTML, JavaScript** (For Building the Website)
- **PostgreSQL** (For Database Management)

## 📌 Installation & Usage
```bash
# Clone the repository
git clone https://github.com/Vruddhi18/WhereToDine.git

# Navigate to the project directory
cd WhereToDine

# Install dependencies
pip install -r requirements.txt

# Run the FASRAPI application
uvicorn app:app --reload

# Start the Node.js server
node server.js

# Open the website
Open index.html in a browser
```

## 🏆 Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📜 License
This project is open-source and available under the MIT License.


