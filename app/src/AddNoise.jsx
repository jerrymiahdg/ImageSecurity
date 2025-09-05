import { useEffect, useRef } from "react";

//vignette for separate vignette function
const addVignette = (ctx, width, height, intensity = 0.7) => {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0, // Center of the circle (x, y, radius)
    width / 2,
    height / 2,
    Math.max(width, height) / 1.5 // Outer circle radius
  );

  // Add stops to the gradient: transparent in the center, dark at the edges.
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)"); // Center: transparent
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`); // Edges: black with opacity

  // Fill the canvas with the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

function addSaltAndPepperNoise(intensity = 0.05, originalImageData, ctx) {
  if (!originalImageData) return;

  // Create a copy of the original data to work on
  let imageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Generate a random number between 0 and 1
    const random = Math.random();

    // If the random number is less than intensity/2, set pixel to black (pepper)
    if (random < intensity / 2) {
      data[i] = 0; // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
    }
    // If the random number is greater than 1 - intensity/2, set pixel to white (salt)
    else if (random > 1 - intensity / 2) {
      data[i] = 255; // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
    }
    // Otherwise, leave the pixel unchanged
  }

  // Put the modified data back to the canvas
  ctx.putImageData(imageData, 0, 0);
}

export default function AddNoise({ imageFile, setImageUrl, trigger }) {
  const canvasRef = useRef(null);

  const processImage = () => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const originalImageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        addSaltAndPepperNoise(0.2, originalImageData, ctx);
        // addVignette(ctx, canvas.width, canvas.height);

        const fileType =
          imageFile.type === "image/png" ? "image/png" : "image/jpeg";
        const newDataUrl = canvas.toDataURL(fileType, 0.95);

        setImageUrl(newDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  useEffect(() => {
    if (trigger) processImage();
  }, [trigger]);

  return <canvas ref={canvasRef} className="hidden" />;
}
