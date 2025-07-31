import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const dummyData = {
  '1': {
    title: '제1활주로',
    logs: [
      { date: '2018/10/02 10:57:46', detail: '1번 활주로 FOD 감지' },
      { date: '2018/10/13 10:57:46', detail: '작업자 위험 동작 탐지' },
    ],
  },
  '2': {
    title: '제2활주로',
    logs: [
      { date: '2018/10/10 10:57:46', detail: '2번 활주로 비인가 차량' },
      { date: '2018/10/30 10:57:46', detail: '--------------------------' },
    ],
  },
};

const DashDetail = () => {
  const { id } = useParams();
  const data = dummyData[id];

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectedImage, setDetectedImage] = useState(null);

  if (!data) return <Typography>존재하지 않는 페이지입니다.</Typography>;

  const videoPath = `/videos/${id}.mp4`;

  // 🔸 프레임 캡처 및 객체 탐지 API 요청
  const handleDetect = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg');

    try {
      const res = await axios.post('https://special-fishstick-v676qp7v9x962xrw9-8000.app.github.dev/detect', {
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
        {data.title}
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
            {data.logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.date}</TableCell>
                <TableCell>{log.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashDetail;