let promoData = []; // Store Excel data globally
let selectedBrand = '';
let selectedModel = '';
let selectedModelButton = null; // Store the selected model button

// Ensure the Excel file is publicly accessible in the same folder on GitHub Pages
fetch('promo_list.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        // Use SheetJS to read the Excel data
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Assume the first sheet contains the data
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON format
        promoData = XLSX.utils.sheet_to_json(sheet);

        // Initialize the page with the data
        initializePage(promoData);
    })
    .catch(error => {
        console.error('Error loading Excel data:', error);
        alert('Error loading Excel file. Ensure the file is publicly accessible.');
    });

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
    // Ensure promoData is available and contains data
    if (promoData && promoData.length > 0) {
        // Find the promo for the selected brand and model
        const promo = promoData.find(item => item.BRAND === selectedBrand && item.MODEL === selectedModel);
        if (promo) {
            displayPromoInfo(promo);
        } else {
            console.error('No promo found for the selected brand and model.');
        }

        // Hide all buttons except reset after displaying promo info
        document.getElementById('brands').style.display = 'none';
        document.getElementById('model-section').style.display = 'none';
        document.getElementById('view-promo-section').style.display = 'none';

        // Show the reset button
        document.getElementById('reset-btn-section').style.display = 'block';
    } else {
        console.error('Promo data is not loaded yet.');
    }
});

// Display promo information
function displayPromoInfo(promo) {
    // Display selected model
    document.getElementById('selected-model').innerText = `Selected Model: ${selectedModel}`;

    // Display promo details
    document.getElementById('normal-price').innerText = `RM ${promo.RCP}`;
    document.getElementById('discounted-price').innerText = `RM ${promo.FINAL}`;
    document.getElementById('free-gift').innerText = promo.GIFT !== '' ? promo.GIFT : 'No free gift available';

    // Handle S-Coin - Replace with image
    const sCoinValue = promo['S-Coin'] ? promo['S-Coin'] * 100 : null;
    const sCoinSection = document.getElementById('s-coin-section');
    sCoinSection.innerHTML = ''; // Clear existing content

    if (sCoinValue) {
        const img = document.createElement('img');
        img.src = `S-Coin_${sCoinValue}.png`; // Dynamically use the correct image
        img.alt = `${sCoinValue}% S-Coin Rebate`;
        img.style.width = '100%'; // Make it responsive to the container
        img.style.maxWidth = '300px'; // Ensure it fits nicely
        img.style.display = 'block';
        img.style.margin = '0 auto'; // Center the image
        sCoinSection.appendChild(img);
    }

    // Handle PAC and VOU (Code need to key section)
    let pacInfo = promo.PAC || ''; // Get PAC value
    let vouInfo = promo.VOU ? `INSTANTSAVE${promo.VOU}` : ''; // Format VOU value if it exists
    let codeToKeyText = '';

    // Combine PAC and VOU based on existence
    if (pacInfo && vouInfo) {
        codeToKeyText = `Code need to key: ${pacInfo} & ${vouInfo}`;
    } else if (pacInfo) {
        codeToKeyText = `Code need to key: ${pacInfo}`;
    } else if (vouInfo) {
        codeToKeyText = `Code need to key: ${vouInfo}`;
    }

    // Display the "Code need to key" section if applicable
    const codeToKeySection = document.getElementById('code-to-key');
    codeToKeySection.innerText = codeToKeyText;
    codeToKeySection.style.display = codeToKeyText ? 'block' : 'none'; // Show or hide based on content

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
    document.getElementById('selected-model').innerText = '';
    document.getElementById('s-coin-section').innerHTML = ''; // Reset the S-Coin section
    document.getElementById('code-to-key').innerText = ''; // Reset the code-to-key section
}
