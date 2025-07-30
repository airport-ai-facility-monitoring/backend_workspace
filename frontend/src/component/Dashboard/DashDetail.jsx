import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const dummyLogs = [
  { date: '2018/10/02 10:57:46', detail: '2번 활주로 FOD 감지' },
  { date: '2018/10/10 10:57:46', detail: '1번 활주로 FOD 감지' },
  { date: '2018/10/10 10:57:46', detail: '3번 활주로 작업자 이상행동' },
  { date: '2018/10/13 10:57:46', detail: '4번 활주로 호박 덩치' },
  { date: '2018/10/13 10:57:46', detail: '--------------------------' },
  { date: '2018/10/23 10:57:46', detail: '--------------------------' },
  { date: '2018/10/23 10:57:46', detail: '--------------------------' },
  { date: '2018/10/30 10:57:46', detail: '--------------------------' },
  { date: '2018/10/30 10:57:46', detail: '--------------------------' },
];

const DashDetail = () => {
  return (
    <Box sx={{ p: 4 }}>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{ textTransform: 'none' }}
        >
          뒤로가기
        </Button>
      </Box>
      {/* 상단 타이틀 */}
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        제2활주로
      </Typography>

      {/* CCTV 영상 영역 (임시 이미지 사용) */}
      <Box
        sx={{
          width: '100%',
          height: 480,
          backgroundColor: '#e0e0e0',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <img
          src="/cctvDummy1.png"
          alt="CCTV Footage"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

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
            {dummyLogs.map((log, index) => (
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