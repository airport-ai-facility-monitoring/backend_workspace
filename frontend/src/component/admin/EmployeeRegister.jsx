import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import api from "../../config/api";
import { logout } from "../login/logout";

const EmployeeRegister = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const [employeeList, setEmployeeList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [q, setQ] = useState("");

  const fetchEmployeeList = async () => {
    setListLoading(true);
    try {
      const res = await api.get("/employees");
      setEmployeeList(res.data || []);
    } catch (err) {
      console.error("직원 리스트 조회 실패", err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return employeeList;
    return employeeList.filter((e) =>
      String(e.employeeId ?? e.id).includes(q.trim())
    );
  }, [q, employeeList]);

  const showToast = (msg, type) => {
    if (type === "success") setSuccessMsg(msg);
    else setErrorMsg(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const trimmed = employeeId.trim();
    if (!trimmed) {
      setLoading(false);
      showToast("사번을 입력해주세요.", "error");
      return;
    }

    // 1) 프론트 사전 중복 검사
    const exists = employeeList.some(
      (e) => String(e.employeeId ?? e.id) === String(trimmed)
    );
    if (exists) {
      setLoading(false);
      showToast("이미 등록된 사번입니다.", "error"); // ← 알림만
      return; // 서버 호출 막기
    }

    try {
      // 2) 서버 등록
      await api.post("/employees", { employeeId: Number(trimmed) });
      setEmployeeId("");
      await fetchEmployeeList();
      showToast("사번 등록 완료!", "success");
    } catch (err) {
      // 3) 서버 측에서 이미 등록되어 500/409 등을 던진 경우도 사용자 메시지로 처리
      //    (콘솔에 시끄러운 에러 로그 남기지 않도록)
      const status = err?.response?.status;
      const msg =
        status === 409
          ? "이미 등록된 사번입니다."
          : "이미 등록된 사번이거나 등록 중 오류가 발생했습니다.";
      showToast(msg, "error");
      // 필요하면 개발용으로만 확인:
      // console.debug("register error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`사번 ${id}를 삭제하시겠습니까?`)) return;

    setDeleteLoadingId(id);
    try {
      await api.delete(`/employees/${id}`);
      await fetchEmployeeList();
      showToast(`사번 ${id} 삭제 완료!`, "success");
    } catch (err) {
      console.error(err);
      showToast(`사번 ${id} 삭제 중 오류가 발생했습니다.`, "error");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 3,
        py: 6,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 4,
        flexWrap: "wrap",
        background:
          "radial-gradient(80rem 80rem at -20% -10%, #3b82f640 0%, transparent 60%), radial-gradient(70rem 70rem at 120% 20%, #60a5fa33 0%, transparent 55%), linear-gradient(180deg, #0b1f5a 0%, #0a1b4a 40%, #08163a 100%)",
      }}
    >
      {/* 등록 카드 */}
      <Card
        elevation={0}
        sx={{
          width: 460,
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 4,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          color: "white",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(96,165,250,0.25), rgba(99,102,241,0.25))",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <BadgeOutlinedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  관리자 사번 등록
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  관리 권한을 줄 사번을 등록하세요.
                </Typography>
              </Box>
            </Stack>

            <Tooltip title="로그아웃">
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.18)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <TextField
            label="사번"
            placeholder="예: 102938"
            fullWidth
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            type="number"
            inputProps={{ min: 1 }}
            sx={{
              mb: 2.5,
              "& .MuiInputBase-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
              },
              "& .MuiFormLabel-root": { color: "rgba(255,255,255,0.8)" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            startIcon={loading ? null : <AddCircleRoundedIcon />}
            disabled={loading}
            sx={{
              py: 1.2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 10px 20px rgba(59,130,246,0.35)",
            }}
          >
            {loading ? <CircularProgress size={22} /> : "등록하기"}
          </Button>

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.12)" }} />

          {!!errorMsg && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                backgroundColor: "rgba(220,38,38,0.9)",
                borderRadius: 2,
              }}
              onClose={() => setErrorMsg("")}
            >
              {errorMsg}
            </Alert>
          )}
          {!!successMsg && (
            <Alert
              severity="success"
              variant="filled"
              sx={{
                mt: errorMsg ? 1.5 : 0,
                backgroundColor: "rgba(34,197,94,0.9)",
                borderRadius: 2,
              }}
              onClose={() => setSuccessMsg("")}
            >
              {successMsg}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 목록 카드 */}
      <Card
        elevation={0}
        sx={{
          width: 520,
          maxHeight: 560,
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 4,
          color: "white",
        }}
      >
        <CardContent sx={{ p: 3, pb: 1.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              등록된 사번 목록
              <Chip
                label={`${filtered.length}건`}
                size="small"
                sx={{
                  ml: 1,
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.14)",
                  borderColor: "rgba(255,255,255,0.22)",
                }}
                variant="outlined"
              />
            </Typography>

            <TextField
              size="small"
              placeholder="사번 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{
                width: 220,
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <Box sx={{ px: 2, py: 1, overflowY: "auto", flex: 1 }}>
          {listLoading ? (
            <Stack spacing={1.2}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    height: 52,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </Stack>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, opacity: 0.9 }}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                표시할 사번이 없습니다.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                상단에서 사번을 등록하거나, 검색어를 지워보세요.
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {filtered.map((emp) => {
                const id = emp.employeeId ?? emp.id;
                const isDeleting = deleteLoadingId === id;
                return (
                  <React.Fragment key={id}>
                    <ListItem
                      sx={{
                        px: 1,
                        borderRadius: 2,
                        my: 0.75,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                      }}
                      secondaryAction={
                        <Tooltip title="삭제">
                          <span>
                            <IconButton
                              edge="end"
                              size="small"
                              color="error"
                              onClick={() => handleDelete(id)}
                              disabled={isDeleting}
                              sx={{
                                backgroundColor: "rgba(239,68,68,0.15)",
                                "&:hover": {
                                  backgroundColor: "rgba(239,68,68,0.25)",
                                },
                                border: "1px solid rgba(239,68,68,0.35)",
                              }}
                            >
                              {isDeleting ? (
                                <CircularProgress size={18} />
                              ) : (
                                <DeleteOutlineRoundedIcon />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 700 }}>
                            사번 {id}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            관리자 권한 대상
                          </Typography>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>
      </Card>

      {/* 토스트 */}
      <Snackbar
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {successMsg ? (
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setToastOpen(false)}
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        ) : errorMsg ? (
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setToastOpen(false)}
            sx={{ width: "100%" }}
          >
            {errorMsg}
          </Alert>
        ) : (
          <></>
        )}
      </Snackbar>
    </Box>
  );
};

export default EmployeeRegister;
