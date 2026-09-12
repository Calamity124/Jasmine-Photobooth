const stripImagesContainer =
    document.getElementById("strip-images-container");

const photoStrip =
    document.getElementById("photo-strip");

const downloadBtn =
    document.getElementById("download-btn");

const printBtn =
    document.getElementById("print-btn");

const retakeBtn =
    document.getElementById("retake-btn");


const customData =
    JSON.parse(
        localStorage.getItem("stripCustomization")
    ) || {
        title: "Enimsaj's PhotoBooth",
        caption: "Memories ♡",
        date: "2026.08.29",
        bgColor: "#EFCBD9",
        design: "design-film"
    };


photoStrip.style.backgroundColor =
    customData.bgColor;

photoStrip.className =
    `photo-strip ${customData.design}`;


document.getElementById(
    "strip-title-preview"
).textContent = customData.title;


document.getElementById(
    "strip-caption-preview"
).textContent = customData.caption;


document.getElementById(
    "strip-date-preview"
).textContent = customData.date;


const savedPhotos =
    JSON.parse(
        localStorage.getItem("capturedPhotos")
    ) || [];


if (savedPhotos.length > 0) {

    stripImagesContainer.innerHTML = "";

    savedPhotos.forEach(photoSrc => {

        const imgDiv =
            document.createElement("div");

        imgDiv.style.backgroundImage =
            `url(${photoSrc})`;

        stripImagesContainer.appendChild(imgDiv);

    });

} else {

    stripImagesContainer.innerHTML = `
        <p style="
            font-size: 12px;
            text-align: center;
            padding: 20px 0;
            color: #8C706E;
        ">
            No photos found!
        </p>
    `;
}


const ua =
    navigator.userAgent ||
    navigator.vendor ||
    window.opera;


const isMessenger =
    /FBAN|FBAV|Messenger/i.test(ua);


if (isMessenger) {

    const tip =
        document.getElementById("messenger-tip");

    if (tip) {
        tip.style.display = "block";
    }
}


retakeBtn.addEventListener("click", () => {

    localStorage.removeItem("capturedPhotos");

    localStorage.removeItem("selectedMood");

    localStorage.removeItem("stripCustomization");

});


printBtn.addEventListener("click", () => {

    window.print();

});


downloadBtn.addEventListener("click", () => {

    downloadBtn.innerHTML = "Generating...";

    const originalWidth =
        photoStrip.style.width;

    const originalMaxWidth =
        photoStrip.style.maxWidth;


    photoStrip.style.width = "380px";

    photoStrip.style.maxWidth = "none";


    html2canvas(photoStrip, {

        scale: 5,

        useCORS: true,

        allowTaint: true,

        logging: false

    })

        .then(canvas => {

            photoStrip.style.width =
                originalWidth;

            photoStrip.style.maxWidth =
                originalMaxWidth;


            const imageUrl =
                canvas.toDataURL("image/png");


            if (isMessenger) {

                showSaveOverlay(imageUrl);

            } else {

                const link =
                    document.createElement("a");

                link.href = imageUrl;

                link.download =
                    "enimsaj-photobooth-strip.png";

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

            }


            downloadBtn.innerHTML =
                '<i class="fa-solid fa-download"></i> Save';

        })

        .catch(error => {

            console.error(
                "Error saving image:",
                error
            );

            photoStrip.style.width =
                originalWidth;

            photoStrip.style.maxWidth =
                originalMaxWidth;

            downloadBtn.innerHTML =
                '<i class="fa-solid fa-download"></i> Save';

            alert(
                "Failed to generate image."
            );

        });

});


function showSaveOverlay(imageUrl) {

    const existing =
        document.getElementById(
            "messenger-save-overlay"
        );


    if (existing) {
        existing.remove();
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "messenger-save-overlay";


    overlay.style.cssText = `

        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        background: rgba(0, 0, 0, 0.85);

        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        z-index: 9999;

        padding: 20px;

        font-family: "Montserrat", sans-serif;

    `;


    overlay.innerHTML = `

        <div style="
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            max-width: 320px;
            width: 100%;
            box-shadow:
                0 10px 25px
                rgba(0, 0, 0, 0.3);
        ">

            <h3 style="
                color: #3E312C;
                font-size: 15px;
                margin-bottom: 8px;
            ">
                Can't save inside Messenger? 💡
            </h3>

            <p style="
                color: #8C7B75;
                font-size: 11px;
                margin-bottom: 12px;
                line-height: 1.4;
            ">
                Tap the
                <b>three dots (...)</b>
                in the top corner and choose
                <b>"Open in Browser"</b>
                so you can download your strip.
            </p>

            <div style="
                font-size: 10px;
                color: #A67C7B;
                margin-bottom: 8px;
            ">
                Or try holding the image below:
            </div>

            <img
                src="${imageUrl}"
                style="
                    width: 100%;
                    max-height: 280px;
                    object-fit: contain;
                    border-radius: 6px;
                    border: 1px solid #EADCD6;
                    margin-bottom: 15px;
                "
            >

            <button
                id="close-overlay-btn"
                style="
                    background: #C46D70;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    width: 100%;
                "
            >
                Close
            </button>

        </div>
    `;


    document.body.appendChild(overlay);


    document
        .getElementById("close-overlay-btn")
        .addEventListener("click", () => {

            overlay.remove();

        });

}