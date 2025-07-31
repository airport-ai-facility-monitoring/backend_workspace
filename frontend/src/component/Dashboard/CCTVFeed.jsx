import React, { useRef, useEffect, useState } from "react";
import useDetectionPolling from "../../hooks/useDetectionPolling";

const CCTVFeed = ({ videoSrc, cameraId }) => {
  const videoRef = useRef();
  const [videoSize, setVideoSize] = useState({ width: 1, height: 1 }); // 기본값 1 방지

  const boxes = useDetectionPolling(videoRef, cameraId);

  useEffect(() => {
    const updateSize = () => {
      if (videoRef.current) {
        setVideoSize({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        });
      }
    };
    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadedmetadata", updateSize);
    }
    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", updateSize);
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {boxes.map((box, idx) => {
        const container = videoRef.current?.getBoundingClientRect();
        const widthRatio = container?.width / videoSize.width;
        const heightRatio = container?.height / videoSize.height;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: `${box.x * widthRatio}px`,
              top: `${box.y * heightRatio}px`,
              width: `${box.width * widthRatio}px`,
              height: `${box.height * heightRatio}px`,
              border: "2px solid #00FF00",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#00FF00",
              fontSize: "0.7rem",
              fontWeight: "bold",
              padding: "2px",
            }}
          >
            {box.label} {box.score}
          </div>
        );
      })}
    </div>
  );
};

export default CCTVFeed;