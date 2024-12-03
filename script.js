<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Overlay on Webcam Feed</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #000;
        }
        canvas {
            position: absolute;
            top: 0;
            left: 0;
        }
        video {
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
</head>
<body>
    <video id="camera" autoplay playsinline></video>
    <canvas id="canvas"></canvas>

    <script>
        const camera = document.getElementById("camera");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        const targetWidth = 667;
        const targetHeight = 373;

        camera.width = targetWidth;
        camera.height = targetHeight;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Load the overlay image
        const overlay = new Image();
        overlay.src = "overlay.png"; // Replace with your overlay image path

        // Load face-api.js models (make sure these models are accessible)
        Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]).then(startVideo);

        // Start the webcam feed
        function startVideo() {
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
                        detectFace();
                    });
                })
                .catch((err) => {
                    console.error("Error accessing camera:", err);
                });
        }

        // Function to detect face and adjust overlay size dynamically
        async function detectFace() {
            const detections = await faceapi.detectAllFaces(camera).withFaceLandmarks().withFaceDescriptors();
            
            if (detections.length > 0) {
                const { width, height, x, y } = detections[0].detection.box; // Get bounding box of the first face

                // Calculate new overlay size based on face detection
                const overlayWidth = width * 1.5; // You can adjust the multiplier to increase/decrease size
                const overlayHeight = height * 1.5;

                // Adjust the overlay position and size
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
                ctx.drawImage(camera, 0, 0, targetWidth, targetHeight); // Draw video feed

                // Draw the resized overlay
                ctx.drawImage(overlay, x, y, overlayWidth, overlayHeight);
            }

            requestAnimationFrame(detectFace); // Repeat the face detection
        }
    </script>
</body>
</html>
