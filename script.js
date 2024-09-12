// Sample JSON data (you will replace this with your JSON file)
const promoDataUrl = 'promo_list.json';

let selectedBrand = '';
let selectedModel = '';
let selectedModelButton = null; // Store the selected model button

// Load data from JSON
fetch(promoDataUrl)
    .then(response => response.json())
    .then(data => {
        initializePage(data);
    })
    .catch(error => console.error('Error loading data:', error));

// Initialize the page with brands and models
function initializePage(data) {
    const brands = [...new Set(data.map(item => item.BRAND))]; // Unique brands
    const brandSection = document.getElementById('brands');

    brands.forEach(brand => {
        const button = document.createElement('button');
        button.innerText = brand;
        button.addEventListener('click', () => handleBrandSelection(brand, data));
        brandSection.appendChild(button);
    });

    // Add the reset button functionality
    document.getElementById('reset-btn').addEventListener('click', resetPage);
}

// Handle brand selection
function handleBrandSelection(brand, data) {
    selectedBrand = brand;
    const models = data.filter(item => item.BRAND === brand).map(item => item.MODEL);
    const modelSection = document.getElementById('models');
    modelSection.innerHTML = ''; // Clear existing models

    models.forEach(model => {
        const button = document.createElement('button');
        button.innerText = model;
        button.addEventListener('click', () => handleModelSelection(button, model));
        modelSection.appendChild(button);
    });

    // Show model section
    document.getElementById('model-section').style.display = 'block';
}

// Handle model selection
function handleModelSelection(button, model) {
    selectedModel = model;

    // Hide other model buttons
    const modelButtons = document.querySelectorAll('#models button');
    modelButtons.forEach(btn => {
        btn.style.display = 'none'; // Hide all other model buttons
    });

    // Make the selected model button visible
    button.style.display = 'block';
    button.style.backgroundColor = '#007bff'; // Change background color to indicate it's selected
    button.style.color = 'white'; // Change text color to white
    button.style.fontWeight = 'bold'; // Make the text bold

    // Show the "View Promo" button after selecting the model
    document.getElementById('view-promo-section').style.display = 'block';
}

// Handle "View Promo" button click
document.getElementById('view-promo-btn').addEventListener('click', () => {
    fetch(promoDataUrl)
        .then(response => response.json())
        .then(data => {
            const promo = data.find(item => item.BRAND === selectedBrand && item.MODEL === selectedModel);
            displayPromoInfo(promo);

            // Hide all buttons except reset after displaying promo info
            document.getElementById('brands').style.display = 'none';
            document.getElementById('model-section').style.display = 'none';
            document.getElementById('view-promo-section').style.display = 'none';
            
            // Show the reset button
            document.getElementById('reset-btn-section').style.display = 'block';
        })
        .catch(error => console.error('Error loading promo data:', error));
});

// Display promo information
function displayPromoInfo(promo) {
    document.getElementById('normal-price').innerText = `RM ${promo.RCP}`;
    document.getElementById('discounted-price').innerText = `RM ${promo.FINAL}`;
    document.getElementById('free-gift').innerText = promo.GIFT !== '' ? promo.GIFT : 'No free gift available';
    document.getElementById('s-coin-rebate').innerText = `${promo['S-Coin'] * 100}%`;

    // Show promo information section
    document.getElementById('promo-info-section').style.display = 'block';
}

// Reset the page to start from scratch
function resetPage() {
    selectedBrand = '';
    selectedModel = '';

    // Show all sections and buttons again
    document.getElementById('brands').style.display = 'block';
    document.getElementById('view-promo-section').style.display = 'none';
    document.getElementById('promo-info-section').style.display = 'none';
    document.getElementById('model-section').style.display = 'none';
    document.getElementById('reset-btn-section').style.display = 'none';

    // Clear models and promo information
    document.getElementById('models').innerHTML = '';
    document.getElementById('normal-price').innerText = '';
    document.getElementById('discounted-price').innerText = '';
    document.getElementById('free-gift').innerText = '';
    document.getElementById('s-coin-rebate').innerText = '';
}
