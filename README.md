# WhereToDine 🍽️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.11-blue.svg)](https://python.org)
[![Node.js Version](https://img.shields.io/badge/node->=14.0.0-green.svg)](https://nodejs.org/)

WhereToDine is an intelligent, AI-powered restaurant recommendation system that helps users find the perfect dining spot based on their specific tastes and preferences. By combining content-based filtering (restaurant attributes and menus) with collaborative filtering (user sentiments and votes), it provides highly accurate and personalized dining suggestions.

## 🚀 Why WhereToDine?

Finding the right restaurant can be overwhelming. WhereToDine simplifies this process by leveraging Machine Learning and Natural Language Processing to analyze restaurant data, menus, and customer sentiment.

### Key Features
- **Hybrid Recommendation Engine**: Employs both feature-based matching (cuisines, location, price) and menu-based matching to deliver tailored suggestions.
- **Fuzzy Search Integration**: Easily find restaurants even with slight misspellings or incomplete names.
- **Sentiment-Aware**: Factors in real user feedback by analyzing the ratio of positive to negative food sentiments in reviews.
- **User Accounts & Preferences**: Save your favorite spots and create a "Visit Later" list using our secure, JWT-authenticated Node.js backend.
- **Dish-Level Recommendations**: Input your favorite dishes to discover similar menu items across different restaurants in your city.

## 🛠️ Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### Prerequisites
- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js & npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (Ensure you have a database named `wheretodine` running locally)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vruddhi18/WhereToDine.git
   cd WhereToDine
   ```

2. **Set up the PostgreSQL Database:**
   - Create a database called `wheretodine`.
   - Ensure the required tables are set up (e.g., `users` with `id`, `username`, `password`, `favorites`, and `visit_later` columns).

3. **Install Python Dependencies (FastAPI Machine Learning Server):**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Node.js Dependencies (Express Auth Server):**
   ```bash
   cd Restar/assets/js
   npm install express pg cors bcryptjs jsonwebtoken dotenv
   ```

### Usage

The application utilizes two separate servers focusing on the recommendation engine and user authentication.

1. **Start the FastAPI Recommendation Server:**
   From the root of the project, run:
   ```bash
   uvicorn Restar.app:app --reload --port 8000
   ```

2. **Start the Node.js Authentication Server:**
   From the `Restar/assets/js` directory, run:
   ```bash
   node server.js
   ```

**(Note: The Express server defaults to port 8001. Ensure your `.env` is configured properly if you use different ports, and your `JWT_SECRET` is set securely).**

3. **Open the Application:**
   Open `Restar/index.html` in your favorite web browser to explore the platform.

## 🤝 Where to Get Help

If you run into any issues during setup or usage:
- **Documentation**: We plan to host more detailed guides on the [GitHub Wiki](https://github.com/Vruddhi18/WhereToDine/wiki) (coming soon).
- **Issue Tracker**: Found a bug or have a suggestion? Open an issue on our [GitHub Issues page](https://github.com/Vruddhi18/WhereToDine/issues).
- **Direct Support**: Contact the maintainers directly through GitHub.

## 👨‍💻 Maintainers and Contributing

**Maintainer**: [Vruddhi18](https://github.com/Vruddhi18)

We welcome community contributions! Whether it's adding a new feature, fixing a bug, or improving documentation, your help is appreciated.

To contribute:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/Feature`).
3. Commit your changes.
4. Push to the branch (`git push origin feature/Feature`).
5. Open a Pull Request.

For detailed guidelines on our coding standards and pull request process, please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
