const stripImagesContainer = document.getElementById('strip-images-container');
const photoStrip = document.getElementById('photo-strip');

const inputTitle = document.getElementById('input-title');
const inputCaption = document.getElementById('input-caption');
const inputDate = document.getElementById('input-date');

const titlePreview = document.getElementById('strip-title-preview');
const captionPreview = document.getElementById('strip-caption-preview');
const datePreview = document.getElementById('strip-date-preview');

const colorBtns = document.querySelectorAll('.color-btn');
const designBtns = document.querySelectorAll('.design-btn');
const finishBtn = document.getElementById('finish-btn');


const savedPhotos = JSON.parse(localStorage.getItem('capturedPhotos')) || [];
if (savedPhotos.length > 0) {
    savedPhotos.forEach(photoSrc => {
        const img = document.createElement('img');
        img.src = photoSrc;
        stripImagesContainer.appendChild(img);
    });
}

inputTitle.addEventListener('input', (e) => {
    titlePreview.textContent = e.target.value;
});

inputCaption.addEventListener('input', (e) => {
    captionPreview.textContent = e.target.value;
});

inputDate.addEventListener('input', (e) => {
    datePreview.textContent = e.target.value;
});


let selectedDesign = 'design-classic';
designBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        designBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        photoStrip.className = `photo-strip ${btn.dataset.design}`;
        selectedDesign = btn.dataset.design;
    });
});


let selectedBgColor = '#ffffff';
colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedBgColor = btn.dataset.color;
        photoStrip.style.backgroundColor = selectedBgColor;
    });
});


finishBtn.addEventListener('click', () => {
    const customData = {
        title: inputTitle.value,
        caption: inputCaption.value,
        date: inputDate.value,
        bgColor: selectedBgColor,
        design: selectedDesign
    };

    localStorage.setItem('stripCustomization', JSON.stringify(customData));
    window.location.href = 'result.html';
});