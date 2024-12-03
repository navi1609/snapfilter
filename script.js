const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set the target dimensions for the video feed and canvas
const targetWidth = 667;
const targetHeight = 373;

// Resize the video and canvas to match the overlay dimensions
camera.width = targetWidth;
camera.height = targetHeight;
canvas.width = targetWidth;
canvas.height = targetHeight;

// Access the video feed using the front camera
navigator.mediaDevices
    .getUserMedia({
        video: {
            width: targetWidth,
            height: targetHeight,
            facingMode: "user", // Use front camera
        },
    })
    .then((stream) => {
        camera.srcObject = stream;
        camera.addEventListener("loadedmetadata", () => {
            draw();
        });
    })
    .catch((err) => {
        console.error("Error accessing camera:", err);
    });

// Load the overlay image
const overlay = new Image();
overlay.src = "overlay.png"; // Replace with your overlay image path

// Draw the video feed and overlay image
function draw() {
    ctx.drawImage(camera, 0, 0, targetWidth, targetHeight); // Draw video feed

    // Draw the overlay
    ctx.drawImage(overlay, 0, 0, targetWidth, targetHeight);

    requestAnimationFrame(draw); // Repeat drawing
}
