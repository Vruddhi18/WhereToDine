// let selectedRestaurants = [];
// let selectedDishes = [];

// // Sample list of cafes for autocomplete (to be replaced with actual data from the recommender)
// let cafes = []; // This will be populated with data from the recommender

// // Fetch cafe names from the recommender
// async function fetchCafeNames() {
//     try {
//         const response = await fetch('https://where-to-dine.vercel.app/cafe-names/'); // Adjust the endpoint as needed
//         if (!response.ok) throw new Error('Network response was not ok');
//         cafes = await response.json(); // Assuming the response is a JSON array of cafe names
//     } catch (error) {
//         console.error('Error fetching cafe names:', error);
//     }
// }

// // Call the function to fetch cafe names on page load
// fetchCafeNames();

// // Add a restaurant to the selection
// function addRestaurant() {
//     const input = document.getElementById('search-bar');
//     const name = input.value.trim();
    
//     if (name && selectedRestaurants.length < 5) {
//         selectedRestaurants.push(name);
//         updateRestaurantsList();
//         input.value = '';
//         document.getElementById('suggestions').innerHTML = ''; // Clear suggestions
//         document.getElementById('suggestions').classList.add('hidden'); // Hide suggestions
//     } else if (selectedRestaurants.length >= 5) {
//         alert('Maximum 5 restaurants can be selected');
//     }
// }

// // Show suggestions based on user input
// function showSuggestions() {
//     const input = document.getElementById('search-bar').value.toLowerCase();
//     const suggestionsContainer = document.getElementById('suggestions');
//     suggestionsContainer.innerHTML = ''; // Clear previous suggestions

//     if (input) {
//         const filteredCafes = cafes.filter(cafe => cafe.toLowerCase().startsWith(input));
        
//         if (filteredCafes.length > 0) {
//             suggestionsContainer.classList.remove('hidden'); // Show suggestions
//             filteredCafes.forEach(cafe => {
//                 const suggestionItem = document.createElement('div');
//                 suggestionItem.textContent = cafe;
//                 suggestionItem.classList.add('suggestion-item', 'p-2', 'cursor-pointer');
//                 suggestionItem.onclick = () => selectCafe(cafe); // Select cafe on click
//                 suggestionsContainer.appendChild(suggestionItem);
//             });
//         } else {
//             suggestionsContainer.classList.add('hidden'); // Hide if no matches
//         }
//     } else {
//         suggestionsContainer.classList.add('hidden'); // Hide if input is empty
//     }
// }

// // Select a cafe from suggestions
// function selectCafe(cafe) {
//     document.getElementById('search-bar').value = cafe; // Set input value
//     document.getElementById('suggestions').classList.add('hidden'); // Hide suggestions
//     addRestaurant(); // Add the selected cafe to the list
// }

// // Add a dish to the selection
// function addDish() {
//     const input = document.getElementById('dishInput');
//     const name = input.value.trim();
    
//     if (name) {
//         selectedDishes.push(name);
//         updateDishesList();
//         input.value = '';
//     }
// }

// // Update the displayed list of selected restaurants
// function updateRestaurantsList() {
//     const container = document.getElementById('selectedRestaurants');
//     container.innerHTML = selectedRestaurants.map((name, index) => `
//         <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
//             <span>${name}</span>
//             <button onclick="removeRestaurant(${index})" 
//                     class="text-red-500 hover:text-red-700">
//                 Remove
//             </button>
//         </div>
//     `).join('');
// }

// // Update the displayed list of selected dishes
// function updateDishesList() {
//     const container = document.getElementById('selectedDishes');
//     container.innerHTML = selectedDishes.map((name, index) => `
//         <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
//             <span>${name}</span>
//             <button onclick="removeDish(${index})" 
//                     class="text-red-500 hover:text-red-700">
//                 Remove
//             </button>
//         </div>
//     `).join('');
// }

// // Remove a restaurant from the selection
// function removeRestaurant(index) {
//     selectedRestaurants.splice(index, 1);
//     updateRestaurantsList();
// }

// // Remove a dish from the selection
// function removeDish(index) {
//     selectedDishes.splice(index, 1);
//     updateDishesList();
// }

// // Get recommendations from the API
// async function getRecommendations() {
//     if (selectedRestaurants.length < 2) {
//         alert('Please select at least 2 restaurants');
//         return;
//     }
//     const loading = document.getElementById('loading');
//     const results = document.getElementById('results');
    
//     loading.classList.remove('hidden');
//     results.classList.add('hidden');

//     try {
//         const response = await fetch('https://where-to-dine.vercel.app/recommendations/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             body: JSON.stringify({
//                 restaurants: selectedRestaurants.map(name => ({ name })),
//                 favorite_dishes: selectedDishes.map(name => ({ name }))
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         displayResults(data);
//     } catch (error) {
//         alert(`Error getting recommendations: ${error.message}\nMake sure the API server is running at http://127.0.0.1:8000`);
//         console.error('Error:', error);
//     } finally {
//         loading.classList.add('hidden');
//     }
// }

// // Display the recommendation results
// function displayResults(data) {
//     const results = document.getElementById('results');
//     const restaurantsContainer = document.getElementById('recommendedRestaurants');
//     const dishesContainer = document.getElementById('similarDishes');

//     // Display recommended restaurants
//     restaurantsContainer.innerHTML = data.recommended_restaurants.map(restaurant => `
//         <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-800">
//             <h3 class="text-xl font-semibold text-white">${restaurant.name}</h3>
//             <p class="text-gray-300">${restaurant.address}</p>
//             <p class="mt-2 text-white"><span class="font-medium text-white">Cuisines:</span> ${restaurant.cuisines}</p>
//             <div class="mt-2 flex flex-wrap gap-2">
//                 ${restaurant.highlights ? restaurant.highlights.split(',').map(highlight => 
//                     `<span class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">${highlight.trim()}</span>`
//                 ).join('') : ''}
//             </div>
//             <div class="mt-3 grid grid-cols-2 gap-2 text-sm text-white">
//                 <div>💰 Avg Cost: ₹${restaurant.avg_price}</div>
//                 <div>👥 Votes: ${restaurant.votes}</div>
//                 <div>👍 Positive Reviews: ${(restaurant.positive_ratio * 100).toFixed(1)}%</div>
//                 <div>📊 Total Reviews: ${restaurant.total_reviews}</div>
//             </div>
//         </div>
//     `).join('');

//     // Display similar dishes if available
//     if (data.similar_dishes && data.similar_dishes.length > 0) {
//         dishesContainer.innerHTML = data.similar_dishes.map(dish => `
//             <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-800">
//                 <h3 class="text-lg font-semibold text-white">${dish.similar_dish}</h3>
//                 <p class="text-white">${dish.restaurant}</p>
//                 <div class="mt-2 grid grid-cols-2 gap-2 text-sm text-white">
//                     <div>💰 Price: ₹${dish.price}</div>
//                     <div>🥬 Type: ${dish.veg_status}</div>
//                     ${dish.rating ? `<div class="text-white">⭐ Rating: ${dish.rating}</div>` : ''}
//                     <div>📊 Similarity: ${dish.similarity}%</div>
//                 </div>
//             </div>
//         `).join('');
//     } else {
//         dishesContainer.innerHTML = '<p class="text-gray-500">No similar dishes found</p>';
//     }

//     results.classList.remove('hidden');
// }

let selectedRestaurants = [];
let selectedDishes = [];
let cafes = [];

// Load cafe names from final_cleaned.json for autocomplete
async function fetchCafeNames() {
    try {
        const response = await fetch('final_cleaned.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        cafes = data.map(cafe => cafe.name);
    } catch (error) {
        console.error('Error fetching cafe names:', error);
        // Fallback for local testing
        cafes = [
            'Mocha',
            'Moca Cabana',
            'Refresh Mocktail',
            'Cafe Coffee Day',
            'Starbucks',
            'The Chocolate Room',
            'Tea Post',
            'La Milano',
            'Turquoise Villa',
            'Cafe Alfresco'
        ];
    }
}
fetchCafeNames();

// Add a restaurant
function addRestaurant() {
    const input = document.getElementById('search-bar');
    const name = input.value.trim();
    if (name && selectedRestaurants.length < 5) {
        selectedRestaurants.push(name);
        updateRestaurantsList();
        input.value = '';
        document.getElementById('suggestions').innerHTML = '';
        document.getElementById('suggestions').classList.add('hidden');
    } else if (selectedRestaurants.length >= 5) {
        alert('Maximum 5 restaurants can be selected');
    }
}

// Show suggestions while typing
function showSuggestions() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    if (input) {
        const filteredCafes = cafes.filter(cafe => cafe.toLowerCase().startsWith(input));
        if (filteredCafes.length > 0) {
            suggestionsContainer.classList.remove('hidden');
            filteredCafes.forEach(cafe => {
                const suggestionItem = document.createElement('div');
                suggestionItem.textContent = cafe;
                suggestionItem.classList.add('suggestion-item', 'p-2', 'cursor-pointer');
                suggestionItem.onclick = () => selectCafe(cafe);
                suggestionsContainer.appendChild(suggestionItem);
            });
        } else {
            suggestionsContainer.classList.add('hidden');
        }
    } else {
        suggestionsContainer.classList.add('hidden');
    }
}

// Select a cafe from suggestions
function selectCafe(cafe) {
    document.getElementById('search-bar').value = cafe;
    document.getElementById('suggestions').classList.add('hidden');
    addRestaurant();
}

// Add a dish
function addDish() {
    const input = document.getElementById('dishInput');
    const name = input.value.trim();
    if (name) {
        selectedDishes.push(name);
        updateDishesList();
        input.value = '';
    }
}

// Update selected restaurants
function updateRestaurantsList() {
    const container = document.getElementById('selectedRestaurants');
    container.innerHTML = selectedRestaurants.map((name, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>${name}</span>
            <button onclick="removeRestaurant(${index})" class="text-red-500 hover:text-red-700">Remove</button>
        </div>
    `).join('');
}

// Update selected dishes
function updateDishesList() {
    const container = document.getElementById('selectedDishes');
    container.innerHTML = selectedDishes.map((name, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>${name}</span>
            <button onclick="removeDish(${index})" class="text-red-500 hover:text-red-700">Remove</button>
        </div>
    `).join('');
}

// Remove restaurant
function removeRestaurant(index) {
    selectedRestaurants.splice(index, 1);
    updateRestaurantsList();
}

// Remove dish
function removeDish(index) {
    selectedDishes.splice(index, 1);
    updateDishesList();
}

// Get recommendations from API
async function getRecommendations() {
    if (selectedRestaurants.length < 2) {
        alert('Please select at least 2 restaurants');
        return;
    }

    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    loading.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        const response = await fetch(`${BASE_URL}/recommendations/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                restaurants: selectedRestaurants.map(name => ({ name })),
                favorite_dishes: selectedDishes.map(name => ({ name }))
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        alert(`Oops! Couldn't fetch recommendations.\n\n${error.message}`);
        console.error('Error:', error);
    } finally {
        loading.classList.add('hidden');
    }
}

// Display recommendations
function displayResults(data) {
    const results = document.getElementById('results');
    const restaurantsContainer = document.getElementById('recommendedRestaurants');
    const dishesContainer = document.getElementById('similarDishes');

    restaurantsContainer.innerHTML = data.recommended_restaurants.map(restaurant => `
        <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-800">
            <h3 class="text-xl font-semibold text-white">${restaurant.name}</h3>
            <p class="text-gray-300">${restaurant.address}</p>
            <p class="mt-2 text-white"><span class="font-medium text-white">Cuisines:</span> ${restaurant.cuisines}</p>
            <div class="mt-2 flex flex-wrap gap-2">
                ${restaurant.highlights ? restaurant.highlights.split(',').map(highlight => 
                    `<span class="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">${highlight.trim()}</span>`
                ).join('') : ''}
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-sm text-white">
                <div>💰 Avg Cost: ₹${restaurant.avg_price}</div>
                <div>👥 Votes: ${restaurant.votes}</div>
                <div>👍 Positive Reviews: ${(restaurant.positive_ratio * 100).toFixed(1)}%</div>
                <div>📊 Total Reviews: ${restaurant.total_reviews}</div>
            </div>
        </div>
    `).join('');

    if (data.similar_dishes && data.similar_dishes.length > 0) {
        dishesContainer.innerHTML = data.similar_dishes.map(dish => `
            <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-800">
                <h3 class="text-lg font-semibold text-white">${dish.similar_dish}</h3>
                <p class="text-white">${dish.restaurant}</p>
                <div class="mt-2 grid grid-cols-2 gap-2 text-sm text-white">
                    <div>💰 Price: ₹${dish.price}</div>
                    <div>🥬 Type: ${dish.veg_status}</div>
                    ${dish.rating ? `<div>⭐ Rating: ${dish.rating}</div>` : ''}
                    <div>📊 Similarity: ${dish.similarity}%</div>
                </div>
            </div>
        `).join('');
    } else {
        dishesContainer.innerHTML = '<p class="text-gray-500">No similar dishes found</p>';
    }

    results.classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile menu toggle
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');

    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }

    // Initial fetch of cafe names
    fetchCafeNames();
});
