import { useEffect, useState } from "react";
import api from "../config/api"; // axios instance import

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
        let res;

        if (parseInt(cameraId) === 4) {
          // Camera 4: runwaycracksDetect + DB 저장
          res = await api.post("/api/runwaycracksDetect", {
            image_base64: dataUrl,
            cameraId: parseInt(cameraId),
          });
          
          const rawBoxes = res.data.saved[0].boxes || [];
          const convertedBoxes = rawBoxes.map(([x1, y1, x2, y2]) => ({
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            label: "crack"
          }));

          setBoxes(convertedBoxes);
          // DB 저장
          console.log(res.data)
          if(res.data.saved[0].image_path != null){
            res.data.saved.map(item =>
              api.post("/runwaycracks", {
                imageUrl: item.image_path,
                cctvId : parseInt(cameraId),
                lengthCm: parseFloat((item.length_m).toFixed(1)),
                areaCm2: parseFloat((item.area_m2).toFixed(1)),
              })
            );
          }



        } else {
          // 그 외 카메라
          res = await api.post("/detect", {
            image_base64: dataUrl,
            cameraId: parseInt(cameraId),
          });

                  // boxes 업데이트: axios는 res.data에 JSON이 이미 있음
          setBoxes(res.data.boxes || []);
        }



      } catch (err) {
        console.error(`Camera ${cameraId} detection error:`, err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoRef, cameraId]);

  return boxes;
};

export default useDetectionPolling;