import React, { useRef, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";

const requiredMsg = "필수 입력 항목입니다.";

function isPositiveInt(v) {
  if (v === "" || v === null || v === undefined) return false;
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
}
function isNonNegativeInt(v) {
  if (v === "" || v === null || v === undefined) return false;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0;
}
function isPastOrToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr + "T00:00:00");
  // 날짜만 비교(시분초 무시)
  return d.setHours(0, 0, 0, 0) <= new Date(today.setHours(0, 0, 0, 0));
}

export default function EquipmentsRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    equipmentType: "",
    name: "",
    manufacturer: "",
    price: "",
    purchaseDate: "",
    ipRating: "",
    lifespan: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "info", message: "" });

  // 각 필드 ref (첫 에러로 스크롤/포커스)
  const refs = {
    category: useRef(null),
    name: useRef(null),
    manufacturer: useRef(null),
    price: useRef(null),
    purchaseDate: useRef(null),
    ipRating: useRef(null),
    lifespan: useRef(null),
  };

  const showSnack = (severity, message) => setSnack({ open: true, severity, message });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    // 숫자 필드 정리(불필요한 문자 제거)
    if (name === "price" || name === "lifespan") {
      v = v.replace(/[^\d]/g, ""); // 숫자만
    }
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const validate = () => {
    const next = {};

    // 1) 필수
    if (!form.category) next.category = requiredMsg;
    if (!form.name || form.name.trim().length < 2) {
      next.name = "장비명은 2자 이상 입력하세요.";
    }
    if (!form.manufacturer) next.manufacturer = requiredMsg;
    if (!form.purchaseDate) next.purchaseDate = requiredMsg;
    if (!form.ipRating) next.ipRating = requiredMsg;
    if (form.price === "") next.price = requiredMsg;
    if (form.lifespan === "") next.lifespan = requiredMsg;

    // 2) 형식/범위
    if (form.price !== "" && !isPositiveInt(form.price)) {
      next.price = "구매 금액은 1 이상의 정수여야 합니다.";
    } else if (Number(form.price) > 1_000_000_000_000) {
      next.price = "구매 금액이 비정상적으로 큽니다.";
    }

    if (form.lifespan !== "" && !isNonNegativeInt(form.lifespan)) {
      next.lifespan = "내용연수는 0 이상의 정수여야 합니다.";
    } else if (Number(form.lifespan) > 100) {
      next.lifespan = "내용연수가 비정상적으로 큽니다.";
    }

    if (form.purchaseDate && !isPastOrToday(form.purchaseDate)) {
      next.purchaseDate = "구매일은 오늘 이전(또는 오늘)이어야 합니다.";
    }

    // 3) 카테고리별 추가 필드가 생기면 여기 확장 (예: 조명 전용 필드 등)
    // if (form.category === "조명" && !form.lampType) next.lampType = requiredMsg; ...

    setErrors(next);
    return next;
  };

  const scrollToFirstError = (errs) => {
    const keys = Object.keys(errs);
    if (!keys.length) return;
    const firstKey = keys[0];
    const el = refs[firstKey]?.current;
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // TextField input에 포커스
      const input = el.querySelector("input") || el.querySelector("div[role='button']");
      if (input?.focus) setTimeout(() => input.focus(), 250);
    }
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      showSnack("warning", "입력값을 확인해주세요. 빨간 표시된 항목을 수정하세요.");
      scrollToFirstError(errs);
      return;
    }

    // 엔드포인트 결정 + 상세 필드(현재는 비워둠)
    let endpoint = "";
    let details = {};

    switch (form.equipmentType) {
      case "조명":
        endpoint = "/equipments/lighting";
        details = { lightingDetail: {} };
        break;
      case "기상":
        endpoint = "/equipments/weather";
        details = { weatherDetail: {} };
        break;
      case "표지":
        endpoint = "/equipments/sign";
        details = { signDetail: {} };
        break;
      default:
        showSnack("error", "카테고리를 선택하세요.");
        return;
    }

    const equipmentData = {
      equipment: {
        equipmentName: form.name.trim(),
        category: form.category, // ✅ 실제 선택값 전송 (예전엔 '')
        manufacturer: form.manufacturer,
        protectionRating: form.ipRating,
        purchase: parseInt(form.price, 10),
        purchaseDate: form.purchaseDate ? `${form.purchaseDate}T09:00:00` : null,
        serviceYears: parseInt(form.lifespan, 10),
        // 백엔드 Not-Null 대비 기본값
        state: "normal",
        failure: 0,
        runtime: 0,
        repairCost: 0,
        repairTime: 0,
        laborRate: 0,
        avgLife: 0,
        maintenanceCost: 0,
      },
      ...details,
    };

    setSubmitting(true);
    try {
      await api.post(endpoint, equipmentData, {
        headers: { "Content-Type": "application/json" },
      });
      showSnack("success", "장비가 성공적으로 등록되었습니다.");
      // 약간 딜레이 후 리스트로 이동
      setTimeout(() => navigate("/equipment"), 500);
    } catch (error) {
      console.error("Failed to register equipment:", error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "장비 등록에 실패했습니다. 입력값 또는 서버 상태를 확인하세요.";
      showSnack("error", serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", mt: 4, mb: 6 }}>
      <Typography variant="h6" gutterBottom>
        신규 장비 등록
      </Typography>

      {/* 카테고리 */}
      <Box ref={refs.category}>
        <TextField
          required
          select
          name="category"
          label="카테고리"
          fullWidth
          value={form.category}
          onChange={handleChange}
          error={!!errors.category}
          helperText={errors.category}
          sx={{ mt: 2 }}
        >
          <MenuItem value="조명">조명</MenuItem>
          <MenuItem value="기상">기상</MenuItem>
          <MenuItem value="표지">표지</MenuItem>
        </TextField>
      </Box>

      {/* 장비명 */}
      <Box ref={refs.name}>
        <TextField
          required
          name="name"
          label="장비명"
          fullWidth
          value={form.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mt: 2 }}
          inputProps={{ maxLength: 50 }}
        />
      </Box>

      {/* 제조사 */}
      <Box ref={refs.manufacturer}>
        <TextField
          required
          select
          name="manufacturer"
          label="제조사"
          fullWidth
          value={form.manufacturer}
          onChange={handleChange}
          error={!!errors.manufacturer}
          helperText={errors.manufacturer}
          sx={{ mt: 2 }}
        >
          <MenuItem value="Samsung">Samsung</MenuItem>
          <MenuItem value="Honeywell">Honeywell</MenuItem>
          <MenuItem value="GE">GE</MenuItem>
          <MenuItem value="LSElectric">LSElectric</MenuItem>
        </TextField>
      </Box>

      {/* 구매 금액 */}
      <Box ref={refs.price}>
        <TextField
          required
          name="price"
          label="구매 금액(원)"
          fullWidth
          value={form.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price || "숫자만 입력"}
          sx={{ mt: 2 }}
          inputProps={{ inputMode: "numeric", pattern: "\\d*", min: 1 }}
        />
      </Box>

      {/* 구매일 */}
      <Box ref={refs.purchaseDate}>
        <TextField
          required
          name="purchaseDate"
          label="구매일"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={form.purchaseDate}
          onChange={handleChange}
          error={!!errors.purchaseDate}
          helperText={errors.purchaseDate}
          sx={{ mt: 2 }}
        />
      </Box>

      {/* 보호등급 */}
      <Box ref={refs.ipRating}>
        <TextField
          required
          select
          name="ipRating"
          label="보호등급(IP)"
          fullWidth
          value={form.ipRating}
          onChange={handleChange}
          error={!!errors.ipRating}
          helperText={errors.ipRating}
          sx={{ mt: 2 }}
        >
          <MenuItem value="IP65">IP65</MenuItem>
          <MenuItem value="IP66">IP66</MenuItem>
          <MenuItem value="IP67">IP67</MenuItem>
        </TextField>
      </Box>

      {/* 내용연수 */}
      <Box ref={refs.lifespan}>
        <TextField
          required
          name="lifespan"
          label="내용연수(년)"
          fullWidth
          value={form.lifespan}
          onChange={handleChange}
          error={!!errors.lifespan}
          helperText={errors.lifespan || "숫자만 입력"}
          sx={{ mt: 2 }}
          inputProps={{ inputMode: "numeric", pattern: "\\d*", min: 0, max: 100 }}
        />
      </Box>

      {/* 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "등록 중..." : "등록"}
        </Button>
        <Button onClick={() => navigate(-1)} disabled={submitting}>
          취소
        </Button>
      </Box>

      {/* 스낵바 */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}