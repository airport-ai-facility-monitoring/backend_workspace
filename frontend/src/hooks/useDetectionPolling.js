// src/hooks/useDetectionPolling.js
import { useEffect, useState } from "react";
import api from "../config/api"; // axios instance import

/**
 * 비디오 ref와 cameraId를 받아 주기적으로 프레임을 캡처하여 서버로 전송하고
 * 감지된 boxes를 반환합니다.
 *
 * - 안정화 포인트:
 *   1) video.readyState 체크 (메타데이터/프레임 준비 전 전송 방지)
 *   2) 캔버스 1회 생성/재사용 (GC/성능)
 *   3) JPEG 품질 0.6로 전송량 절감
 *   4) dataURL 헤더/길이 검증 (깨진 base64 예방)
 *   5) 중복 전송 방지 플래그(sending)
 *   6) 카메라 4번(microservice) 응답 → cm / cm² 단위 변환, DB 저장
 */
const useDetectionPolling = (videoRef, cameraId) => {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    let intervalId = null;
    let sending = false;

    // 오프스크린 캔버스 1회 생성/재사용
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const INTERVAL_MS = 500; // 2 FPS (= 1000/500)

    const captureAndSend = async () => {
      const video = videoRef?.current;
      if (!video) return;

      // 비디오가 준비되지 않았다면 스킵
      if (video.readyState < 2 /* HAVE_CURRENT_DATA */) return;

      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 360;

      // 가끔 0x0이 들어오는 경우 방지
      if (!vw || !vh) return;

      canvas.width = vw;
      canvas.height = vh;
      ctx.drawImage(video, 0, 0, vw, vh);

      // JPEG로 용량 절감
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

      // 기본 검증: 헤더/길이
      if (!dataUrl || !dataUrl.startsWith("data:image/jpeg;base64,")) {
        console.warn("[useDetectionPolling] invalid dataUrl header");
        return;
      }
      if (dataUrl.length < 1000) {
        // 너무 짧으면 전송 안 함
        console.warn("[useDetectionPolling] dataUrl too short:", dataUrl.length);
        return;
      }

      if (sending) return; // 이전 요청이 끝나지 않았다면 스킵
      sending = true;

      try {
        const camId = parseInt(cameraId, 10);

        if (camId === 4 || camId === 5 || camId === 13 || camId === 14 || camId === 15) {
          /**
           * 카메라 4,5,13,14,15:
           * - /api/runwaycracksDetect 호출
           * - 응답 saved[0].boxes: [x1, y1, x2, y2] 배열들
           * - DB 저장: /runwaycracks (item.length_m[m] → cm, item.area_m2[m²] → cm²)
           */
          const res = await api.post("/api/runwaycracksDetect", {
            image_base64: dataUrl,
            cameraId: camId,
          });

          const saved = res?.data?.saved || [];
          const first = saved[0];

          const rawBoxes = first?.boxes || [];
          const convertedBoxes = rawBoxes.map(([x1, y1, x2, y2]) => ({
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            label: "crack",
            score: 1.0,
          }));
          setBoxes(convertedBoxes);

          // 이미지가 저장되었으면 DB 반영 (best-effort)
          if (saved.length > 0) {
            const payloads = saved
              .filter((it) => it?.image_path)
              .map((it) => {
                const lengthCm = Math.round((Number(it.length_m || 0) * 100) * 10) / 10;   // m → cm, 소수1자리
                const areaCm2 = Math.round((Number(it.area_m2 || 0) * 10000) * 10) / 10;  // m² → cm², 소수1자리
                return api.post("/runwaycracks", {
                  imageUrl: it.image_path,
                  cctvId: camId,
                  lengthCm,
                  areaCm2,
                });
              });

            if (payloads.length) {
              // 실패해도 로직 중단하지 않도록 allSettled
              await Promise.allSettled(payloads);
            }
          }
        } else {
          /**
           * 일반 카메라:
           * - /detect 호출
           * - 응답 { boxes: [{x,y,width,height,label,score}], result_image_base64? }
           */
          const res = await api.post("/detect", {
            image_base64: dataUrl,
            cameraId: camId,
          });

          const newBoxes = res?.data?.boxes || [];
          setBoxes(newBoxes);
        }
      } catch (err) {
        // 서버가 400 detail을 주면 콘솔에서 확인 가능
        const detail = err?.response?.data?.detail || err?.message || "unknown error";
        console.error(`[useDetectionPolling] Camera ${cameraId} detect error:`, detail);
      } finally {
        sending = false;
      }
    };

    // 폴링 시작
    intervalId = setInterval(captureAndSend, INTERVAL_MS);

    // 정리
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoRef, cameraId]);

  return boxes;
};

export default useDetectionPolling;