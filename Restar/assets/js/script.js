// Open Popup
function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

// Close Popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Handle Submitting Preferences (Just for demonstration)
function submitPreferences() {
    const cuisines = document.querySelectorAll('#cuisine-options .clickable-option');
    const prices = document.querySelectorAll('#price-options .clickable-option');
    const cafes = document.querySelectorAll('#cafe-options .clickable-option');
    
    let selectedCuisines = [];
    let selectedPrices = [];
    let selectedCafes = [];

    cuisines.forEach(cuisine => {
        if (cuisine.classList.contains('selected')) {
            selectedCuisines.push(cuisine.innerText);
        }
    });

    prices.forEach(price => {
        if (price.classList.contains('selected')) {
            selectedPrices.push(price.innerText);
        }
    });

    cafes.forEach(cafe => {
        if (cafe.classList.contains('selected')) {
            selectedCafes.push(cafe.innerText);
        }
    });

    console.log('Selected Preferences:', {
        cuisines: selectedCuisines,
        prices: selectedPrices,
        cafes: selectedCafes,
    });

    closePopup(); // Close popup after submission
}

// Toggle the selection of each option
document.querySelectorAll('.clickable-option').forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('selected');
    });
});
