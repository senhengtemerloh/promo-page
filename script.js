let promoData = []; // Store Excel data globally
let selectedBrand = '';
let selectedModel = '';

// Ensure the Excel file is publicly accessible in the same folder
fetch('promo_list.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        promoData = XLSX.utils.sheet_to_json(sheet);
        initializePage(promoData);
    })
    .catch(error => {
        console.error('Error loading Excel data:', error);
        alert('Error loading Excel file.');
    });

function initializePage(data) {
    const brands = [...new Set(data.map(item => item.BRAND))];
    const brandSection = document.getElementById('brands');

    brands.forEach(brand => {
        const button = document.createElement('button');
        button.innerText = brand;
        button.addEventListener('click', () => handleBrandSelection(brand, data));
        brandSection.appendChild(button);
    });

    document.getElementById('reset-btn').addEventListener('click', resetPage);
}

function handleBrandSelection(brand, data) {
    selectedBrand = brand;
    const models = data.filter(item => item.BRAND === brand).map(item => item.MODEL);
    const modelSection = document.getElementById('models');
    modelSection.innerHTML = '';

    models.forEach(model => {
        const button = document.createElement('button');
        button.innerText = model;
        button.addEventListener('click', () => handleModelSelection(button, model));
        modelSection.appendChild(button);
    });

    document.getElementById('model-section').style.display = 'block';
}

function handleModelSelection(button, model) {
    selectedModel = model;
    document.getElementById('view-promo-section').style.display = 'block';
    document.getElementById('selected-model').innerText = `Selected: ${selectedBrand} ${selectedModel}`;

    document.getElementById('view-promo-btn').addEventListener('click', showPromoInfo);
}

function showPromoInfo() {
    const selectedPromo = promoData.find(item => item.BRAND === selectedBrand && item.MODEL === selectedModel);
    if (selectedPromo) {
        document.getElementById('normal-price').innerText = selectedPromo['NORMAL PRICE'];
        document.getElementById('discounted-price').innerText = selectedPromo['DISCOUNTED PRICE'];
        document.getElementById('free-gift').innerText = selectedPromo['FREE GIFT'];
        document.getElementById('code-to-key').style.display = 'block';

        // Handle promo period
        const now = new Date();
        const endDate = new Date(selectedPromo['PROMO END DATE']);

        if (now > endDate) {
            document.getElementById('promo-period').innerHTML = '<span class="expired-promo">This promo already expired</span>';
        } else {
            const formattedEndDate = formatDate(endDate);
            document.getElementById('promo-period').innerText = `Promo Period: Now until ${formattedEndDate}`;
        }

        // Load S-Coin image (as an example)
        const sCoinImage = document.createElement('img');
        sCoinImage.src = selectedPromo['SCOIN IMAGE']; // Replace with your actual image path logic
        document.getElementById('s-coin-section').appendChild(sCoinImage);

        document.getElementById('promo-info-section').style.display = 'block';
        document.getElementById('reset-btn-section').style.display = 'block';
    }
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/ /g, ' ');
}

function resetPage() {
    selectedBrand = '';
    selectedModel = '';
    document.getElementById('model-section').style.display = 'none';
    document.getElementById('view-promo-section').style.display = 'none';
    document.getElementById('promo-info-section').style.display = 'none';
    document.getElementById('reset-btn-section').style.display = 'none';
    document.getElementById('selected-model').innerText = '';
    document.getElementById('brands').innerHTML = '';
    initializePage(promoData);
}
