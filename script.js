const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let overlayImage;

// Dynamically adjust video and canvas sizes to match the screen
camera.width = window.innerWidth;
camera.height = window.innerHeight;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the overlay image
overlayImage = new Image();
overlayImage.src = "overlay.png"; // Replace with your overlay image path

// Initialize FaceAPI.js and start the camera
async function start() {
    await faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/npm/@vladmandic/face-api/models/");
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
            camera.srcObject = stream;
            camera.addEventListener("loadedmetadata", async () => {
                draw();
            });
        })
        .catch((err) => {
            console.error("Error accessing camera:", err);
        });
}

// Draw video and overlay dynamically
async function draw() {
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height); // Draw the video feed

    // Detect face in the current frame
    const detections = await faceapi.detectSingleFace(
        camera,
        new faceapi.TinyFaceDetectorOptions()
    );

    if (detections) {
        const { x, y, width, height } = detections.box;

        // Dynamically position and scale the overlay image based on face box
        const overlayWidth = width * 1.5; // Slightly larger than face
        const overlayHeight = height * 1.5;
        const overlayX = x - (overlayWidth - width) / 2; // Center horizontally
        const overlayY = y - (overlayHeight - height) / 2; // Center vertically

        // Draw overlay image over the detected face
        ctx.drawImage(
            overlayImage,
            overlayX,
            overlayY,
            overlayWidth,
            overlayHeight
        );
    }

    requestAnimationFrame(draw); // Continuously repeat
}

// Start the application
start();
