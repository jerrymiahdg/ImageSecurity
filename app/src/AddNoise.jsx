import { useEffect, useRef } from "react";

function addUniformNoise(amount = 50, originalImageData, ctx) {
  if (!originalImageData) return;

  let imageData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Generate a random value between -amount and +amount
    const noise = (Math.random() - 0.5) * 2 * amount;

    data[i] = clamp(data[i] + noise); // R
    data[i + 1] = clamp(data[i + 1] + noise); // G
    data[i + 2] = clamp(data[i + 2] + noise); // B
  }

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

        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        addUniformNoise(50, originalImageData, ctx);

        const newDataUrl = canvas.toDataURL("image/jpeg", 0.95);
        const newDataUrl = canvas.toDataURL("image/png", 0.95);

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
