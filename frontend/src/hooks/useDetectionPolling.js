import { useEffect, useState } from "react";

const useDetectionPolling = (videoRef, cameraId) => {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg");

      try {
        const res = await fetch("https://glowing-space-fiesta-g4w47xwqjgj525qp-8000.app.github.dev/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: dataUrl,
            cameraId: parseInt(cameraId), 
          }),
        });

        if (!res.ok) {
          console.error("Fetch failed:", res.statusText);
          return;
        }

        const json = await res.json();
        setBoxes(json.boxes);
      } catch (err) {
        console.error("Detection polling error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoRef, cameraId]); // ✅ cameraId도 의존성에 추가

  return boxes;
};

export default useDetectionPolling;