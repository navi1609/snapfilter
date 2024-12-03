// Get the video and canvas elements
const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set the target dimensions for the video feed and canvas
const targetWidth = 667;
const targetHeight = 373;

// Set the video and canvas dimensions
camera.width = targetWidth;
camera.height = targetHeight;
canvas.width = targetWidth;
canvas.height = targetHeight;

// Access the front camera
navigator.mediaDevices
    .getUserMedia({
        video: {
            width: targetWidth,
            height: targetHeight,
            facingMode: "user" // Use the front camera
        },
    })
    .then((stream) => {
        // Assign the video stream to the camera element
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
    // Draw the video feed onto the canvas
    ctx.drawImage(camera, 0, 0, targetWidth, targetHeight);

    // Draw the overlay on top of the video feed
    ctx.drawImage(overlay, 0, 0, targetWidth, targetHeight);

    // Continuously update the canvas
    requestAnimationFrame(draw);
}
