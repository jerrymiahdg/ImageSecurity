import { useEffect, useRef } from "react";

export default function RemoveMetaData({ imageFile, setImageUrl, trigger }) {
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
