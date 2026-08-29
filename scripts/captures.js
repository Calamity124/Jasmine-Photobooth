const videoElement = document.getElementById('video-feed');
const cameraPreview = document.getElementById('camera-preview');
const layoutBtns = document.querySelectorAll('.layout-btn');
const canvas = document.getElementById('capture-canvas');
const ctx = canvas.getContext('2d');
const countdownOverlay = document.getElementById('countdown-overlay');
const flashOverlay = document.getElementById('flash-overlay');

let selectedTakes = 3; 


const savedMood = localStorage.getItem('selectedMood') || 'mood-normal';
cameraPreview.className = savedMood;


async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        videoElement.srcObject = stream;
    } catch (error) {
        console.error("Camera access denied: ", error);
        alert("Please allow camera access to use the photobooth.");
    }
}

layoutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        layoutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTakes = parseInt(btn.dataset.takes);
    });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


document.getElementById('start-capture').addEventListener('click', async (e) => {
    const captureBtn = e.currentTarget;
    captureBtn.disabled = true;
    captureBtn.style.opacity = '0.5';

    let capturedPhotos = [];

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    
    const moodFilters = {
        'mood-normal': 'none',
        'mood-dreamy': 'brightness(1.1) saturate(1.3) hue-rotate(15deg)',
        'mood-retro': 'sepia(0.6) contrast(1.1) brightness(0.9)',
        'mood-midnight': 'grayscale(0.5) contrast(1.2) brightness(0.7) hue-rotate(200deg)'
    };

    for (let i = 0; i < selectedTakes; i++) {
        
        countdownOverlay.classList.remove('hidden');
        for (let c = 3; c > 0; c--) {
            countdownOverlay.innerText = c;
            await sleep(1000);
        }
        countdownOverlay.classList.add('hidden');

        
        flashOverlay.classList.remove('hidden');
        
      
        ctx.filter = moodFilters[savedMood] || 'none';

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = 'none'; 

        capturedPhotos.push(canvas.toDataURL('image/jpeg'));

        await sleep(200);
        flashOverlay.classList.add('hidden');
        await sleep(800);
    }

  localStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
    window.location.href = 'customize.html';
});

startCamera();