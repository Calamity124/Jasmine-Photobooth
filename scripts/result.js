const stripImagesContainer = document.getElementById('strip-images-container');
const photoStrip = document.getElementById('photo-strip');
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const retakeBtn = document.getElementById('retake-btn');


const customData = JSON.parse(localStorage.getItem('stripCustomization')) || {
    title: "Enimsaj's PhotoBooth",
    caption: "Memories ♡",
    date: "2026.08.29",
    bgColor: "#ffffff",
    design: "design-classic"
};

photoStrip.style.backgroundColor = customData.bgColor;
photoStrip.className = `photo-strip ${customData.design}`;

document.getElementById('strip-title-preview').textContent = customData.title;
document.getElementById('strip-caption-preview').textContent = customData.caption;
document.getElementById('strip-date-preview').textContent = customData.date;


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

retakeBtn.addEventListener('click', () => {
    localStorage.removeItem('capturedPhotos');
    localStorage.removeItem('selectedMood');
    localStorage.removeItem('stripCustomization');
});


printBtn.addEventListener('click', () => {
    window.print();
});


downloadBtn.addEventListener('click', () => {
    downloadBtn.innerText = "Generating...";
    
    html2canvas(photoStrip, { scale: 2, useCORS: true }).then(canvas => {
        const imageUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        // Check if it's a mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // On mobile, open the image in a new tab so they can long-press to save
            let newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`
                    <html>
                        <head><title>Your Photo Strip</title></head>
                        <body style="background:#F5EFEB; text-align:center; padding:20px; font-family:sans-serif;">
                            <h3>Press and hold the image to save! ♡</h3>
                            <img src="${imageUrl}" style="width:100%; max-width:300px; border-radius:4px; box-shadow:0 4px 10px rgba(0,0,0,0.1);"/>
                        </body>
                    </html>
                `);
            } else {
                // Fallback if popup blocker stops it
                window.location.href = imageUrl;
            }
        } else {
            // Standard desktop download trigger
            const link = document.createElement('a');
            link.download = 'enimsaj-photobooth-strip.jpg';
            link.href = imageUrl;
            link.click();
        }
        
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
    }).catch(err => {
        console.error("Error saving image: ", err);
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
        alert("Failed to generate image.");
    });
});