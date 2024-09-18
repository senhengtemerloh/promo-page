// Display promo information
function displayPromoInfo(promo) {
    const today = new Date();
    const promoEndDate = new Date(promo.END); // Assuming "END" column holds the date in a recognizable format

    if (promoEndDate < today) {
        // If the promo has expired, show an error message
        const expiredMessage = document.createElement('p');
        expiredMessage.innerText = "This promo has expired. Please refer to the page admin to update the database.";
        expiredMessage.style.color = 'red';
        expiredMessage.style.fontSize = '1.5em';
        expiredMessage.style.fontWeight = 'bold';

        // Clear previous content and display the error message
        document.getElementById('promo-info-section').innerHTML = ''; // Clear existing promo info
        document.getElementById('promo-info-section').appendChild(expiredMessage);
        document.getElementById('promo-info-section').style.display = 'block'; // Show the section with the message

        // Hide other sections and buttons
        document.getElementById('brands').style.display = 'none';
        document.getElementById('model-section').style.display = 'none';
        document.getElementById('view-promo-section').style.display = 'none';
        document.getElementById('reset-btn-section').style.display = 'block'; // Only show reset button
        return;
    }

    // If promo is still valid, display selected model and promo details
    document.getElementById('selected-model').innerText = `Selected Model: ${selectedModel}`;
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
