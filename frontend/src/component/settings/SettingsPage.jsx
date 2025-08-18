// /src/component/settings/SettingsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../config/api";
import {
  Box, Card, CardHeader, CardContent, Avatar, Chip, Typography,
  Stack, Divider, Button, Skeleton, Alert, Grid, IconButton
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const LAYOUT = {
  WIDTH: 1280,          // 전체 캔버스 폭 (필요시 1360/1440으로 더 키워도 OK)
  LEFT_COL: 380,        // 좌측 프로필 카드 폭
  RIGHT_COL: 880,       // 우측 정보 카드 폭
  GAP: 20,
};

const maskPhone = (v) => {
  if (!v) return "-";
  const only = v.replace(/\D/g, "");
  if (only.length >= 10) return `${only.slice(0, 3)}-****-${only.slice(-4)}`;
  return v.replace(/(\d{2,3})\d{3,4}(\d{4})/, "$1-****-$2");
};
const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
};
const getStatusChip = (status) => {
  const map = {
    ACTIVE: { label: "활성", color: "success" },
    INACTIVE: { label: "비활성", color: "default" },
    SUSPENDED: { label: "정지", color: "warning" },
  };
  const meta = map[status] || { label: status || "알수없음", color: "default" };
  return <Chip size="small" label={meta.label} color={meta.color} variant="outlined" />;
};
const Row = ({ icon, label, value }) => (
  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.7 }}>
    {icon}
    <Typography sx={{ width: 110, color: "text.secondary" }}>{label}</Typography>
    <Typography sx={{ fontWeight: 600 }}>{value ?? "-"}</Typography>
  </Stack>
);

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/users/setting");
        if (mounted) setUser(data);
      } catch (e) {
        setErr("사용자 정보를 불러오지 못했습니다.");
        console.error(e);
      }
    })();
    return () => (mounted = false);
  }, []);

  const loading = !user;
  const profileInitial = useMemo(() => (user?.name ? user.name[0] : "?"), [user]);

  if (err) {
    return (
      <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f5f7fc" }}>
        <Typography variant="h5" fontWeight={800} mb={2}>Settings</Typography>
        <Alert severity="error">{err}</Alert>
      </Box>
    );
  }

  return (
    // ⭐️ 바깥 컨테이너: 고정 폭 + 중앙 정렬 + 작은 화면에서 가로 스크롤 허용
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fc", display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: LAYOUT.WIDTH, minWidth: LAYOUT.WIDTH, px: 0, py: 3 }}>
        <Typography variant="h5" fontWeight={800} mb={2}>Settings</Typography>

        {/* 1행: 고정 2열 그리드 (픽셀) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `${LAYOUT.LEFT_COL}px ${LAYOUT.RIGHT_COL}px`,
            gap: `${LAYOUT.GAP}px`,
          }}
        >
          {/* 좌: 프로필 */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <CardHeader
              avatar={
                loading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar sx={{ bgcolor: "primary.main", fontWeight: 700 }}>{profileInitial}</Avatar>
                )
              }
              title={loading ? <Skeleton width={120} /> : <Typography fontWeight={700}>{user.name}</Typography>}
              subheader={
                loading ? (
                  <Skeleton width={160} />
                ) : (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BadgeIcon fontSize="small" />
                    <Typography variant="body2">
                      사번 {String(user.employeeId ?? "-").replace(/(\d{2})(\d+)(\d{2})/, "$1***$3")}
                    </Typography>
                    {getStatusChip(user.status)}
                  </Stack>
                )
              }
              // action={
              //   <Button
              //     size="small"
              //     variant="outlined"
              //     startIcon={<ManageAccountsRoundedIcon />}
              //     onClick={() => {} }
              //     sx={{ mr: 1 }}
              //   >
              //     정보 수정
              //   </Button>
              // }
            />
            <Divider />
            <CardContent>
              {loading ? (
                <>
                  <Skeleton height={28} />
                  <Skeleton height={28} />
                  <Skeleton height={28} />
                </>
              ) : (
                <Stack spacing={0.5}>
                  <Row icon={<WorkRoundedIcon fontSize="small" />} label="직급" value={user.position} />
                  <Row icon={<BusinessRoundedIcon fontSize="small" />} label="부서" value={user.department} />
                  <Row icon={<CalendarMonthRoundedIcon fontSize="small" />} label="입사일" value={formatDate(user.hireDate)} />
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* 우: 내 정보(연락처 + 조직) - 크게 */}
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", minHeight: 360 }}>
            <CardHeader title="내 정보" />
            <Divider />
            <CardContent>
              {loading ? (
                <>
                  <Skeleton height={28} />
                  <Skeleton height={28} />
                  <Skeleton height={28} />
                  <Skeleton height={28} />
                </>
              ) : (
                <Grid container columnSpacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>연락처</Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2, p: 1.2 }}>
                      <Row icon={<PhoneIphoneRoundedIcon fontSize="small" />} label="휴대폰" value={maskPhone(user.phoneNumber)} />
                      <Divider />
                      <Row icon={<EmailRoundedIcon fontSize="small" />} label="이메일" value={user.email} />
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>조직 정보</Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2, p: 1.2 }}>
                      <Row icon={<BusinessRoundedIcon fontSize="small" />} label="부서" value={user.department} />
                      <Divider />
                      <Row icon={<WorkRoundedIcon fontSize="small" />} label="직급" value={user.position} />
                      <Divider />
                      <Row icon={<BadgeIcon fontSize="small" />} label="사번" value={user.employeeId ?? "-"} />
                      <Divider />
                      <Row label="상태" value={getStatusChip(user.status)} />
                    </Card>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* 2행: 바로가기(폭 전체 사용)로 여백 채우기 */}
        {/* <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: `${LAYOUT.LEFT_COL}px ${LAYOUT.RIGHT_COL}px`,
            gap: `${LAYOUT.GAP}px`,
          }}
        >
          <Card
            sx={{
              gridColumn: "1 / -1",
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <CardHeader title="바로가기" />
            <Divider />
            <CardContent>
              <Stack direction="row" spacing={1.2} flexWrap="wrap">
                <Chip
                  label="내가 작성한 활주로 손상 보고서"
                  onClick={() => navigate("/crack/reports?author=me")}
                  clickable
                  variant="outlined"
                  onDelete={undefined}
                  deleteIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
                />
                <Chip
                  label="내가 작성한 장비 보고서"
                  onClick={() => {} }
                  clickable
                  variant="outlined"
                  onDelete={undefined}
                  deleteIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
                />
                <Chip
                  label="내 담당 장비"
                  onClick={() => navigate("/equipments?assignee=me")}
                  clickable
                  variant="outlined"
                />
                <Chip
                  label="부서 연락망"
                  onClick={() => {} }
                  clickable
                  variant="outlined"
                  onDelete={undefined}
                  deleteIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />}
                />
              </Stack>
            </CardContent>
          </Card>
        </Box> */}
      </Box>
    </Box>
  );
}