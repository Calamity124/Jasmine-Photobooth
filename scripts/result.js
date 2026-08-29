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
    downloadBtn.innerText = "Saving...";
    
    html2canvas(photoStrip, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'enimsaj-photobooth-strip.jpg';
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
        
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
    }).catch(err => {
        console.error("Error saving image: ", err);
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Save';
        alert("Failed to download image.");
    });
});