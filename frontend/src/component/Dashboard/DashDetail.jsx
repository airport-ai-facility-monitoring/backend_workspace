import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import api from '../../config/api'; // api import 추가

const DashDetail = () => {
  const { id } = useParams();
  const [alerts, setAlerts] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedImage, setDetectedImage] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get(`/alerts/search/findByCctvId?cctvId=${id}`);
        setAlerts(response.data._embedded.alerts || []);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 1000);

    return () => clearInterval(interval);
  }, [id]);

  console.log("ID from URL params:", id);
  const videoPath = `/videos/${id}.mp4`;
  console.log("Constructed video path:", videoPath);

  // 🔸 프레임 캡처 및 객체 탐지 API 요청
  const handleDetect = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg');

    try {
      const res = await api.post('/objectDetect', {
        image_base64: imageBase64,
        cameraId: Number(id)
      });

      setDetectedImage(res.data.result_image_base64);
    } catch (err) {
      console.error('객체 탐지 실패:', err);
    }
  };

  // 처리 요청 버튼 클릭 핸들러 (Alert.jsx에서 가져옴)
  const handleRequest = (alertLog) => {
    let message = "";
    if (alertLog.includes("FOD감지")) {
      message = "[FOD감지] FOD 전담 처리반을 호출 하였습니다.";
    } else if (alertLog.includes("조류 출현")) {
      message = "[조류 출현] 조류 전담 처리반을 호출 하였습니다.";
    } else if (alertLog.includes("동물 출현")) {
      message = "[동물 출현] 동물 처리 전담반을 호출하였습니다.";
    } else {
      message = "[처리 요청] 신호를 보냈습니다.";
    }
    console.log(message);
    alert(message);
    // 나중에 실제 API 호출 로직을 여기에 추가할 수 있습니다.
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* 뒤로가기 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{ textTransform: 'none' }}
        >
          뒤로가기
        </Button>
      </Box>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        CCTV ID: {id}
      </Typography>

      {/* 원본 CCTV 영상 */}
      <Box
        sx={{
          width: '100%',
          height: 480,
          backgroundColor: '#e0e0e0',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={videoPath}
          controls
          autoPlay
          muted
          loop
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {/* 캔버스 (숨겨짐, 프레임 캡처용) */}
      <canvas ref={canvasRef} width={640} height={480} style={{ display: 'none' }} />

      

      {/* 탐지 결과 이미지 */}
      {detectedImage && (
        <Box
          sx={{
            border: '2px solid #4caf50',
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <img
            src={detectedImage}
            alt="탐지 결과"
            style={{ width: '100%', height: 'auto' }}
          />
        </Box>
      )}

      {/* 로그 테이블 */}
      <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Detail</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert, index) => {
              const isTargetAlert =
                alert.alertLog.includes("FOD감지") ||
                alert.alertLog.includes("조류 출현") ||
                alert.alertLog.includes("동물 출현");

              return (
                <TableRow key={index}>
                  <TableCell>{new Date(alert.alertDate).toLocaleString()}</TableCell>
                  <TableCell>{alert.alertLog}</TableCell>
                  <TableCell>
                    {isTargetAlert && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRequest(alert.alertLog)}
                      >
                        처리 요청
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashDetail;