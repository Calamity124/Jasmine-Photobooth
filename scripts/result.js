const stripImagesContainer = document.getElementById('strip-images-container');
const photoStrip = document.getElementById('photo-strip');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const retakeBtn = document.getElementById('retake-btn');

// 1. Load custom data from localStorage
const customData = JSON.parse(localStorage.getItem('stripCustomization')) || {
    title: "Enimsaj's PhotoBooth",
    caption: "Memories ♡",
    date: "2026.08.29",
    bgColor: "#ffffff",
    design: "design-classic"
};

// 2. Apply background color, design class, and custom text fields safely
photoStrip.style.backgroundColor = customData.bgColor;
photoStrip.className = `photo-strip ${customData.design}`;

document.getElementById('strip-title-preview').textContent = customData.title;
document.getElementById('strip-caption-preview').textContent = customData.caption;
document.getElementById('strip-date-preview').textContent = customData.date;

// 3. Load captured photos
const savedPhotos = JSON.parse(localStorage.getItem('capturedPhotos')) || [];

if (savedPhotos.length > 0) {
    stripImagesContainer.innerHTML = ''; 
    savedPhotos.forEach(photoSrc => {
        const img = document.createElement('img');
        img.src = photoSrc;
        stripImagesContainer.appendChild(img);
    });
} else {
    stripImagesContainer.innerHTML = '<p style="font-size:12px; text-align:center; padding: 20px 0;">No photos found!</p>';
}

// 4. Check for Messenger IMMEDIATELY on load to show the warning banner tip
const ua = navigator.userAgent || navigator.vendor || window.opera;
const isMessenger = /FBAN|FBAV|Messenger/i.test(ua);

if (isMessenger) {
    const tip = document.getElementById('messenger-tip');
    if (tip) tip.style.display = 'block';
}

// 5. Retake Button: Clear session data and go back to start
retakeBtn.addEventListener('click', () => {
    localStorage.removeItem('capturedPhotos');
    localStorage.removeItem('selectedMood');
    localStorage.removeItem('stripCustomization');
});

// 6. Print Button: Triggers native print dialog
printBtn.addEventListener('click', () => {
    window.print();
});

// 7. Robust Download Functionality
downloadBtn.addEventListener('click', () => {
    downloadBtn.innerText = "Generating...";
    
    html2canvas(photoStrip, { scale: 2, useCORS: true }).then(canvas => {
        const imageUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        if (isMessenger) {
            // Show overlay with instructions on how to open in browser / save
            showSaveOverlay(imageUrl);
        } else {
            // Normal browsers download directly to device
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'enimsaj-photobooth-strip.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
    }).catch(err => {
        console.error("Error saving image: ", err);
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
        alert("Failed to generate image.");
    });
});

// Helper function to show a friendly save overlay with the "three dots" tip for Messenger users
function showSaveOverlay(imageUrl) {
    const existing = document.getElementById('messenger-save-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'messenger-save-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
        font-family: 'Montserrat', sans-serif;
    `;

    overlay.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; max-width: 320px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
            <h3 style="color: #3E312C; font-size: 15px; margin-bottom: 8px;">Can't save inside Messenger? 💡</h3>
            <p style="color: #8c7b75; font-size: 11px; margin-bottom: 12px; line-height: 1.4;">
                Tap the <b>three dots (...)</b> in your top corner and choose <b>"Open in Browser"</b> (Chrome/Safari) so you can download straight to your album!
            </p>
            <div style="font-size: 10px; color: #a67c7b; margin-bottom: 8px;">Or try holding the image below:</div>
            <img src="${imageUrl}" style="width: 100%; max-height: 280px; object-fit: contain; border-radius: 6px; border: 1px solid #EADCD6; margin-bottom: 15px;" />
            <button id="close-overlay-btn" style="background: #C46D70; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; font-size: 13px; cursor: pointer; width: 100%;">Close</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('close-overlay-btn').addEventListener('click', () => {
        overlay.remove();
    });
}