const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import JWT
require("dotenv").config();

const app = express();
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: "http://localhost:8000", // Adjust this to your frontend's origin
    credentials: true  // Allow credentials (cookies) to be sent
}));

// PostgreSQL Connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "wheretodine",
    password: "aateka0408",
    port: 5432
});

// Secret key for JWT (store it securely)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; 

// Register User
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword]
        );

        const user = result.rows[0];

        // Generate JWT Token
        const token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });

        res.json({ message: "User registered successfully!", token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Login Attempt for:", username); // Debugging

        // Ensure case-insensitive search (optional: use LOWER(username) = LOWER($1) if needed)
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        console.log("Database Result:", result.rows); // Debugging

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });

        res.json({ message: "Login successful", token });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



// Protected Route: Profile (with JWT verification)
app.get("/profile", async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];  // Get the token from Authorization header

    if (!token) return res.status(401).json({ message: "Token not provided" });

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user info from the database using the decoded user ID
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.user_id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user data (e.g., username, email)
        res.json({ username: user.username, email: user.email });
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});


// Logout User (Delete Token on the Client Side)
app.post("/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
    // In JWT, no server-side session to destroy, so the client needs to delete the token
});



function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Token not provided" });

    jwt.verify(token, process.env.JWT_SECRET || "your_secret_key", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.username = decoded.username; // Attach username to request
        next();
    });
}

app.get("/get-favorites", authenticateToken, async (req, res) => {
    try {
        const username = req.username; // Extracted from JWT token
        const result = await pool.query("SELECT favorites FROM users WHERE username = $1", [username]);

        if (result.rows.length > 0) {
            const favorites = result.rows[0].favorites || [];
            res.json({ favorites }); // Send the correct format
        } else {
            res.json({ favorites: [] });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/update-favorites", authenticateToken, async (req, res) => {
    const { cafeIndex } = req.body;
    const username = req.username;

    try {
        const result = await pool.query("SELECT favorites FROM users WHERE username = $1", [username]);
        let favorites = result.rows[0]?.favorites || [];

        if (favorites.includes(cafeIndex)) {
            favorites = favorites.filter(fav => fav !== cafeIndex); // Remove favorite
            res.json({ status: "removed", message: "Cafe removed from favorites!" });
        } else {
            favorites.push(cafeIndex); // Add favorite
            res.json({ status: "added", message: "Cafe added to favorites!" });
        }

        await pool.query("UPDATE users SET favorites = $1 WHERE username = $2", [favorites, username]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/get-visit-later", authenticateToken, async (req, res) => {
    try {
        const username = req.username;
        const result = await pool.query("SELECT visit_later FROM users WHERE username = $1", [username]);

        if (result.rows.length > 0) {
            res.json({ visit_later: result.rows[0].visit_later || [] });
        } else {
            res.json({ visit_later: [] });
        }
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});
app.post("/update-visit-later", authenticateToken, async (req, res) => {
    const { cafeIndex } = req.body;
    const username = req.username;

    try {
        const result = await pool.query("SELECT visit_later FROM users WHERE username = $1", [username]);
        let visitLaterList = result.rows[0]?.visit_later || [];

        if (visitLaterList.includes(cafeIndex)) {
            visitLaterList = visitLaterList.filter(v => v !== cafeIndex); // Remove
            res.json({ status: "removed", message: "Cafe removed from Visit Later!" });
        } else {
            visitLaterList.push(cafeIndex); // Add
            res.json({ status: "added", message: "Cafe added to Visit Later!" });
        }

        await pool.query("UPDATE users SET visit_later = $1 WHERE username = $2", [visitLaterList, username]);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});


app.listen(8001, () => {
    console.log("Server running on port 8001");
});
