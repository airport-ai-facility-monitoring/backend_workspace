// src/hooks/useDetectionPolling.js
import { useEffect, useRef, useState } from "react";
import api from "../config/api"; // axios instance

/**
 * 비디오 ref와 cameraId를 받아 주기적으로 프레임을 캡처하여 서버로 전송하고
 * 감지된 boxes(오버레이용)를 반환합니다.
 *
 * 적용 포인트:
 *  1) 비디오 준비상태 확인 후 캡처(HAVE_CURRENT_DATA)
 *  2) 캔버스 1회 생성/재사용으로 GC/성능 이점
 *  3) JPEG 품질 0.6으로 전송량 절감
 *  4) dataURL 헤더/길이 검증으로 깨진 base64 예방
 *  5) 중복 전송 방지(sendingRef)
 *  6) 활주로 카메라: /api/runwaycracksDetect 호출
 *     - 백엔드가 내려주는 preview(항상 표시)와 saved(저장 발생시에만)를 분리 처리
 *     - 저장시 길이/면적을 m→cm, m²→cm² 변환하여 /runwaycracks에 기록
 *  7) 일반 카메라: /detect 호출 (기존 형식 유지)
 *  8) 카메라별 meters_per_pixel을 명시 전달(실측 근사 정확도 개선)
 */

const RUNWAY_CAMERAS = new Set([4, 5, 13, 14, 15]);

// TODO: 실제 캘리브레이션 결과로 보정하세요 (m/px)
// 기준선(활주로 마킹, 표지판 등) 픽셀 길이로 역산해서 산출하는 것을 권장합니다.
const MPP_BY_CAM = {
  4: 0.0075,
  5: 0.0075,
  13: 0.0050,
  14: 0.0050,
  15: 0.0060,
};

const HAVE_CURRENT_DATA = 2;
const INTERVAL_MS = 500; // 2 FPS

const useDetectionPolling = (videoRef, cameraId) => {
  const [boxes, setBoxes] = useState([]);
  const sendingRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // 언마운트/카메라 변경 시 기존 타이머 클리어
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const video = videoRef?.current;
    if (!video) return;

    // 오프스크린 캔버스 생성(재사용)
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const doCaptureAndSend = async () => {
      // video 준비 전이면 스킵
      if (!videoRef?.current) return;
      const v = videoRef.current;
      if (v.readyState < HAVE_CURRENT_DATA) return;

      const vw = v.videoWidth || 640;
      const vh = v.videoHeight || 360;
      if (!vw || !vh) return;

      canvas.width = vw;
      canvas.height = vh;
      ctx.drawImage(v, 0, 0, vw, vh);

      // JPEG로 용량 절감
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);

      // 기본 검증
      if (!dataUrl || !dataUrl.startsWith("data:image/jpeg;base64,")) {
        // eslint-disable-next-line no-console
        console.warn("[useDetectionPolling] invalid dataUrl header");
        return;
      }
      if (dataUrl.length < 1000) {
        // eslint-disable-next-line no-console
        console.warn("[useDetectionPolling] dataUrl too short:", dataUrl.length);
        return;
      }

      if (sendingRef.current) return; // 전송 중이면 스킵
      sendingRef.current = true;

      try {
        const camId = parseInt(cameraId, 10);
        if (RUNWAY_CAMERAS.has(camId)) {
          // 활주로 카메라: 백엔드(중복 병합·중복 저장 방지·트래킹 유지)와 연동
          const metersPerPixel = MPP_BY_CAM[camId] ?? 0.01; // fallback
          const res = await api.post("/runwaycracksDetect", {
            image_base64: dataUrl,
            cameraId: camId,
            meters_per_pixel: metersPerPixel,
          });

          // ===== 오버레이(항상 표시) =====
          // 신형 응답: { preview: { boxes: [[x1,y1,x2,y2], ...] }, saved: [...] }
          // 구형 호환: { saved: [ { boxes: [[x1,y1,x2,y2], ...] } ] }
          const previewBoxes =
            res?.data?.preview?.boxes ??
            res?.data?.saved?.[0]?.boxes ??
            [];

          const overlay = previewBoxes.map(([x1, y1, x2, y2]) => ({
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            label: "crack",
            score: 1.0,
          }));
          setBoxes(overlay);

          // ===== 저장(DB 반영) =====
          const saved = Array.isArray(res?.data?.saved) ? res.data.saved : [];
          if (saved.length > 0) {
            const payloads = saved
              .filter((it) => it && it.image_path)
              .map((it) => {
                const lengthCm = Math.round((Number(it.length_m || 0) * 100) * 10) / 10; // m→cm(소수1)
                const areaCm2 =
                  Math.round((Number(it.area_m2 || 0) * 10000) * 10) / 10; // m²→cm²(소수1)
                return api.post("/runwaycracks", {
                  imageUrl: it.image_path,
                  cctvId: camId,
                  lengthCm,
                  areaCm2,
                });
              });

            if (payloads.length) {
              await Promise.allSettled(payloads); // 실패해도 흐름 유지
            }
          }
        } else {
          // 일반 카메라: 기존 /detect 응답 { boxes: [{x,y,width,height,label,score}], ... }
          const res = await api.post("/detect", {
            image_base64: dataUrl,
            cameraId: parseInt(cameraId, 10),
          });
          const newBoxes = Array.isArray(res?.data?.boxes) ? res.data.boxes : [];
          setBoxes(newBoxes);
        }
      } catch (err) {
        const detail = err?.response?.data?.detail || err?.message || "unknown error";
        // eslint-disable-next-line no-console
        console.error(`[useDetectionPolling] Camera ${cameraId} detect error:`, detail);
      } finally {
        sendingRef.current = false;
      }
    };

    // 폴링 시작
    intervalRef.current = setInterval(doCaptureAndSend, INTERVAL_MS);

    // 정리 함수
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // 컴포넌트 언마운트 시 전송중 플래그 해제
      sendingRef.current = false;
    };
  }, [videoRef, cameraId]);

  return boxes;
};

export default useDetectionPolling;
