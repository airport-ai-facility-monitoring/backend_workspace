import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import api from "../../config/api"; // API 모듈 위치 맞게 조정

const EmployeeRegister = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchEmployeeList = async () => {
    setListLoading(true);
    try {
      const res = await api.get("/employees");
      setEmployeeList(res.data);
    } catch (err) {
      console.error("직원 리스트 조회 실패", err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!employeeId.trim()) {
      setErrorMsg("사번을 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/employees", { employeeId: Number(employeeId) });
      setSuccessMsg("사번 등록 완료!");
      setEmployeeId("");
      await fetchEmployeeList();
    } catch (err) {
      setErrorMsg("등록 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`사번 ${id}를 삭제하시겠습니까?`)) return;

    setDeleteLoadingId(id);
    try {
      await api.delete(`/employees/${id}`);
      setSuccessMsg(`사번 ${id} 삭제 완료!`);
      await fetchEmployeeList();
    } catch (err) {
      setErrorMsg(`사번 ${id} 삭제 중 오류가 발생했습니다.`);
      console.error(err);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // 🔹 로그아웃 처리
  const handleLogout = () => {
    // localStorage에 저장된 두 개 값 삭제
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    // 필요하면 추가 데이터도 삭제
    // localStorage.clear(); // 전부 삭제할 경우

    // 로그아웃 후 페이지 이동 (예: 로그인 페이지로)
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        bgcolor: "#f3f6fe",
        minHeight: "100vh",
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 4,
        flexWrap: "wrap",
      }}
    >
      <Paper sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            관리자 사번 등록
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </Box>

        <TextField
          label="사번"
          variant="outlined"
          fullWidth
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          sx={{ mb: 3 }}
          disabled={loading}
          type="number"
          inputProps={{ min: 1 }}
        />

        {errorMsg && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Typography>
        )}
        {successMsg && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {successMsg}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "등록하기"}
        </Button>
      </Paper>

      <Paper sx={{ width: 300, p: 3, maxHeight: 500, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          등록된 사번 목록
        </Typography>

        {listLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : employeeList.length === 0 ? (
          <Typography color="text.secondary">등록된 사번이 없습니다.</Typography>
        ) : (
          <List dense>
            {employeeList.map((emp) => (
              <React.Fragment key={emp.id ?? emp.employeeId}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDelete(emp.employeeId ?? emp.id)}
                      disabled={deleteLoadingId === (emp.employeeId ?? emp.id)}
                    >
                      {deleteLoadingId === (emp.employeeId ?? emp.id) ? (
                        <CircularProgress size={20} />
                      ) : (
                        <CloseIcon />
                      )}
                    </IconButton>
                  }
                >
                  <ListItemText primary={`사번: ${emp.employeeId ?? emp.id}`} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default EmployeeRegister;