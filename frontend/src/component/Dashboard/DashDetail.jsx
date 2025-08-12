import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import api from '../../api/axios'; // api import 추가

const DashDetail = () => {
  const { id } = useParams();
  const [alerts, setAlerts] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedImage, setDetectedImage] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get(`/alerts/search/findByCctvId?cctvId=${id}&sort=alertDate,desc`);
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
  const videoPath = `${import.meta.env.BASE_URL}videos/${id}.mp4`;
  console.log("Constructed video path:", videoPath);

  // 🔸 프레임 캡처 및 객체 탐지 API 요청
  const handleDetect = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg');

    try {
      const res = await axios.post('https://localhost:8000/detect', {
        image_base64: imageBase64,
        cameraId: Number(id)
      });

      setDetectedImage(res.data.result_image_base64);
    } catch (err) {
      console.error('객체 탐지 실패:', err);
    }
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

      {/* 탐지 버튼 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleDetect}
        sx={{ mb: 2 }}
      >
        객체 탐지 실행
      </Button>

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
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(alert.alertDate).toLocaleString()}</TableCell>
                <TableCell>{alert.alertLog}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashDetail;