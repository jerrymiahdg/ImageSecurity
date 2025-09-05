import { useEffect, useRef } from "react";

export default function InvertColors({ imageFile, setImageUrl, trigger }) {
  const canvasRef = useRef(null);

  const invertImage = () => {
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

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Invert colors
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]; // Red
          data[i + 1] = 255 - data[i + 1]; // Green
          data[i + 2] = 255 - data[i + 2]; // Blue
          // data[i + 3] is alpha, leave it
        }

        ctx.putImageData(imageData, 0, 0);

        const newDataUrl = canvas.toDataURL("image/png");
        setImageUrl(newDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  useEffect(() => {
    if (trigger) invertImage();
  }, [trigger]);

  return <canvas ref={canvasRef} className="hidden" />;
}
