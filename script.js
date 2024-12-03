import cv2
import numpy as np

def overlay_foreground_on_camera(foreground_path):
    # Load the foreground image (with alpha channel if present)
    foreground = cv2.imread(foreground_path, cv2.IMREAD_UNCHANGED)

    if foreground is None:
        print("Error: Unable to load the foreground image.")
        return

    # Check if the image has an alpha channel
    if foreground.shape[2] == 4:
        alpha_channel = foreground[:, :, 3] / 255.0
        rgb_foreground = foreground[:, :, :3]
    else:
        print("No transparency detected in the foreground image.")
        rgb_foreground = foreground
        alpha_channel = np.ones(rgb_foreground.shape[:2], dtype=np.float32)

    # Get the dimensions of the foreground image
    fg_h, fg_w, _ = rgb_foreground.shape

    # Start video capture
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Unable to access the camera.")
        return

    # Resize the camera feed to match the foreground dimensions
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, fg_w)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, fg_h)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Unable to read from camera.")
            break

        # Resize the camera frame to match the foreground dimensions
        frame = cv2.resize(frame, (fg_w, fg_h))

        # Get the position for bottom-right corner
        x = fg_w - fg_w  # Adjusted to start from bottom-right
        y = fg_h - fg_h

        # Overlay the foreground onto the camera feed
        for c in range(3):  # Apply to all color channels
            frame[y:fg_h, x:fg_w, c] = (
                alpha_channel * rgb_foreground[:, :, c]
                + (1 - alpha_channel) * frame[y:fg_h, x:fg_w, c]
            )

        # Display the resulting frame
        cv2.imshow("Live Camera with Bottom-Right Foreground Overlay", frame)

        # Break on 'q' key press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the video capture and close windows
    cap.release()
    cv2.destroyAllWindows()

# Path to the foreground image
foreground_path = "D:/Downloads/Snapchat-1242412492_preview_rev_1.png" # Update with your uploaded image path

# Call the function
overlay_foreground_on_camera(foreground_path)
