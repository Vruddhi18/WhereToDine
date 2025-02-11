document.addEventListener("DOMContentLoaded", function () {
    const profileLink = document.getElementById("profileLink");

    profileLink.addEventListener("click", function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            // If no token, redirect to login page
            window.location.href = "login.html";
        } else {
            // If token exists, check if it's valid
            fetch("http://localhost:8001/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    window.location.href = "profile.html";
                } else {
                    window.location.href = "login.html"; // Redirect to login if token is invalid
                }
            })
            .catch(() => {
                window.location.href = "login.html";
            });
        }
    });
});
