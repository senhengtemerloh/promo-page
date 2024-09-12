// Sample JSON data (you will replace this with your JSON file)
const promoDataUrl = 'promo_list.json';

let selectedBrand = '';
let selectedModel = '';

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
        button.addEventListener('click', () => handleModelSelection(model));
        modelSection.appendChild(button);
    });

    // Show model section
    document.getElementById('model-section').style.display = 'block';
}

// Handle model selection
function handleModelSelection(model) {
    selectedModel = model;

    // Hide the model section after selecting a model
    document.getElementById('model-section').style.display = 'none';

    // Show the "View Promo" button immediately after selecting the model
    document.getElementById('view-promo-section').style.display = 'block';
}

// Handle "View Promo" button click
document.getElementById('view-promo-btn').addEventListener('click', () => {
    fetch(promoDataUrl)
        .then(response => response.json())
        .then(data => {
            const promo = data.find(item => item.BRAND === selectedBrand && item.MODEL === selectedModel);
            displayPromoInfo(promo);
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
