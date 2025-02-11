document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8001/login", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        console.log("Server Response:", data); // Debugging

        if (response.ok) {
            if (!data.token) {
                throw new Error("Token is missing in response!");
            }
            localStorage.setItem("token", data.token);
            window.location.href = "profile.html"; 
        } else {
            alert(data.message || "Login failed!");  
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again.");
    }
});
