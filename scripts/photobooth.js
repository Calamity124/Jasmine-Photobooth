const videoElement = document.getElementById('video-feed');
const cameraPreview = document.getElementById('camera-preview');
const moodCards = document.querySelectorAll('.mood-card');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "user",
                // Request a 16:9 widescreen resolution to fit more people
                width: { ideal: 1920 }, 
                height: { ideal: 1080 } 
            },
            audio: false
        });
        videoElement.srcObject = stream;
    } catch (error) {
        console.error("Camera access denied or unavailable: ", error);
        alert("Please allow camera access to use the photobooth.");
    }
}

moodCards.forEach((card) => {
    card.addEventListener('click', () => {
        
        moodCards.forEach(c => c.classList.remove('active'));
        
       
        card.classList.add('active');
        
       
        cameraPreview.className = card.dataset.mood;
    });
});

const nextBtn = document.getElementById('next-btn');
if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
        const activeCard = document.querySelector('.mood-card.active');
        localStorage.setItem('selectedMood', activeCard.dataset.mood);
    });
}

startCamera();