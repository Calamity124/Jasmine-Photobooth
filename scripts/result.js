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

// 4. Retake Button: Clear session data and go back to start
retakeBtn.addEventListener('click', () => {
    localStorage.removeItem('capturedPhotos');
    localStorage.removeItem('selectedMood');
    localStorage.removeItem('stripCustomization');
});

// 5. Print Button: Triggers native print dialog
printBtn.addEventListener('click', () => {
    window.print();
});

// 6. Direct Mobile Blob Download Functionality
downloadBtn.addEventListener('click', () => {
    downloadBtn.innerText = "Downloading...";
    
    html2canvas(photoStrip, { scale: 2, useCORS: true }).then(canvas => {
        canvas.toBlob((blob) => {
            // Create a safe object URL for the blob
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'enimsaj-photobooth-strip.jpg';
            
            // Required for mobile Firefox/Chrome to trigger file download
            document.body.appendChild(link);
            link.click();
            
            // Clean up the URL object after download triggers
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);
            
            downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
        }, 'image/jpeg', 1.0);
        
    }).catch(err => {
        console.error("Error saving image: ", err);
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
        alert("Failed to download image.");
    });
});