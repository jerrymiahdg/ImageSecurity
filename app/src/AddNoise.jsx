import React, { useRef, useEffect } from "react";

export default function AddNoise({ imageFile, setImageUrl }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const newDataUrl = canvas.toDataURL("image/jpeg", 0.95);

        setImageUrl(newDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile, setImageUrl]);

  return <canvas ref={canvasRef} className="hidden" />;
}
