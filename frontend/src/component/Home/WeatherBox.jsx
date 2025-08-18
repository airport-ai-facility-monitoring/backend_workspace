// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const WeatherBox = () => {
//   const [weather, setWeather] = useState(null);
//   const apiKey = '7f558feb2601573fba750208db98fb2e'; // 실제 API 키 7f558feb2601573fba750208db98fb2e

//   useEffect(() => {
//     const fetchWeather = async () => {
//       try {
//         const url = `https://api.openweathermap.org/data/2.5/weather?q=Busan&appid=${apiKey}&units=metric&lang=kr`;
//         const res = await axios.get(url);
//         console.log('날씨 데이터:', res.data);
//         setWeather(res.data);
//       } catch (error) {
//         console.error('날씨 정보 불러오기 실패:', error);
//       }
//     };

//     fetchWeather();
//   }, []);

//   return (
//     <div style={{ padding: '16px' }}>
//       <h2>현재 날씨</h2>
//       {weather ? (
//         <>
//           <p>도시: {weather.name}</p>
//           <p>온도: {weather.main.temp}°C</p>
//           <p>상태: {weather.weather[0].description}</p>
//           <p>습도: {weather.main.humidity}%</p>
//           <img
//             src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
//             alt="날씨 아이콘"
//           />
//         </>
//       ) : (
//         <p>날씨 정보를 불러오는 중입니다...</p>
//       )}
//     </div>
//   );
// };

// export default WeatherBox;

// WeatherBox.jsx
// WeatherBox.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import CompressRoundedIcon from "@mui/icons-material/CompressRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

// 🔑 테스트용: 프런트에서 직접 키를 사용합니다.
// 1) .env(권장): REACT_APP_OWM_KEY=xxxxxxxxxxxxxxxxxxxx
// 2) 아래 FALLBACK_KEY에 테스트 키를 임시로 넣어두면 .env가 없을 때 사용됩니다.
const FALLBACK_KEY = "7f558feb2601573fba750208db98fb2e";
const OWM_KEY = "7f558feb2601573fba750208db98fb2e" || FALLBACK_KEY;

const LANG = "kr";
const UNITS = "metric";

// 공항 좌표(ICAO)
const AIRPORTS = [
  { key: "RKPK", label: "부산(김해)", lat: 35.1796, lon: 128.9382 }, // 김해
  { key: "RKSI", label: "인천",     lat: 37.4692, lon: 126.4505 },  // 인천
  { key: "RKPC", label: "제주",     lat: 33.5104, lon: 126.4914 },  // 제주
  { key: "RKSS", label: "김포",     lat: 37.5583, lon: 126.7906 },  // 김포
];

// 방위(deg) → 16방위 문자열
function degToCompass(deg) {
  if (typeof deg !== "number") return "-";
  const dirs = [
    "N","NNE","NE","ENE","E","ESE","SE","SSE",
    "S","SSW","SW","WSW","W","WNW","NW","NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

// 안전 접근 유틸
const safe = (fn, fallback = "-") => {
  try { const v = fn(); return (v === 0 || !!v) ? v : fallback; } catch { return fallback; }
};

// ts(sec) → HH:mm
function hhmm(ts) {
  try {
    const d = new Date(ts * 1000);
    return d.toTimeString().slice(0,5);
  } catch { return "-"; }
}

export default function WeatherBox({
  defaultAirportKey = "RKPK",  // 기본: 김해
  refreshMinutes = 10,         // 자동 새로고침(분)
}) {
  const [airportKey, setAirportKey] = useState(defaultAirportKey);
  const [current, setCurrent] = useState(null);   // 현재
  const [forecast, setForecast] = useState([]);   // 3시간 간격 리스트
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const ap = useMemo(
    () => AIRPORTS.find(a => a.key === airportKey) || AIRPORTS[0],
    [airportKey]
  );

  const fetchAll = async () => {
    if (!OWM_KEY || OWM_KEY === "YOUR_TEST_OPENWEATHER_API_KEY") {
      console.warn("⚠️ OpenWeather API Key가 비어있거나 테스트 키입니다. .env의 REACT_APP_OWM_KEY를 설정하세요.");
    }
    setErr("");
    setLoading(true);
    try {
      const curUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${ap.lat}&lon=${ap.lon}&appid=${OWM_KEY}&units=${UNITS}&lang=${LANG}`;
      const fcUrl  = `https://api.openweathermap.org/data/2.5/forecast?lat=${ap.lat}&lon=${ap.lon}&appid=${OWM_KEY}&units=${UNITS}&lang=${LANG}`;
      const [cur, fc] = await Promise.all([axios.get(curUrl), axios.get(fcUrl)]);
      setCurrent(cur.data);
      setForecast(Array.isArray(fc.data?.list) ? fc.data.list.slice(0, 6) : []); // 6칸(약 18시간)
    } catch (e) {
      console.error(e);
      setErr("날씨 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const ms = Math.max(1, refreshMinutes) * 60 * 1000;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") fetchAll();
    }, ms);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airportKey]);

  // 파생값
  const icon    = safe(() => current.weather[0].icon, "01d");
  const temp    = safe(() => Math.round(current.main.temp));
  const feels   = safe(() => Math.round(current.main.feels_like));
  const desc    = safe(() => current.weather[0].description);
  const humid   = safe(() => current.main.humidity);
  const visKm   = safe(() => Math.round(current.visibility / 1000), "-");
  const clouds  = safe(() => current.clouds.all);
  const pressure= safe(() => current.main.pressure);
  const windSpd = safe(() => current.wind.speed?.toFixed(1));
  const windDeg = safe(() => current.wind.deg);
  const windDir = typeof windDeg === "number" ? degToCompass(windDeg) : "-";
  const sunrise = safe(() => hhmm(current.sys.sunrise));
  const sunset  = safe(() => hhmm(current.sys.sunset));
  const cityNm  = safe(() => current.name, ap.label);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 40%, #f6f8fd 100%)",
      }}
    >
      {/* 헤더: 공항 토글 + 새로고침 */}
      <Box sx={{ px: 2, pt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={airportKey}
          onChange={(_, v) => v && setAirportKey(v)}
          sx={{
            flexWrap: "wrap",
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontSize: 12,
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
            },
          }}
        >
          {AIRPORTS.map((a) => (
            <ToggleButton key={a.key} value={a.key}>
              {a.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Tooltip title="새로고침">
          <span>
            <IconButton size="small" onClick={fetchAll} disabled={loading}>
              <RefreshRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <CardContent sx={{ pt: 1.5 }}>
        {/* 현재 */}
        {loading ? (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} md={5}>
              <Skeleton variant="rounded" height={92} />
            </Grid>
            <Grid item xs={6} md={7}>
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="40%" />
            </Grid>
          </Grid>
        ) : err ? (
          <Typography variant="body2" color="error">
            {err}
          </Typography>
        ) : (
          <>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} md={5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    alt="날씨 아이콘"
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    sx={{ width: 64, height: 64 }}
                  />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1 }}>
                      {temp}°C
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      체감 {feels}°C · {desc}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {cityNm} · 업데이트 {new Date().toLocaleTimeString().slice(0,5)}
                </Typography>
              </Grid>

              <Grid item xs={6} md={7}>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={4}>
                    <Chip variant="outlined" icon={<AirRoundedIcon />} label={`풍속 ${windSpd} m/s`} sx={{ width: "100%" }} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Chip variant="outlined" icon={<ExploreRoundedIcon />} label={`풍향 ${windDir}`} sx={{ width: "100%" }} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Chip variant="outlined" icon={<WaterDropRoundedIcon />} label={`습도 ${humid}%`} sx={{ width: "100%" }} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Chip variant="outlined" icon={<VisibilityRoundedIcon />} label={`가시 ${visKm} km`} sx={{ width: "100%" }} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Chip variant="outlined" icon={<CloudQueueRoundedIcon />} label={`운량 ${clouds}%`} sx={{ width: "100%" }} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Chip variant="outlined" icon={<CompressRoundedIcon />} label={`기압 ${pressure} hPa`} sx={{ width: "100%" }} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* 일출/일몰 */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              <Grid item xs={6} md={3}>
                <Chip icon={<WbSunnyRoundedIcon />} label={`일출 ${sunrise}`} sx={{ width: "100%" }} />
              </Grid>
              <Grid item xs={6} md={3}>
                <Chip icon={<DarkModeRoundedIcon />} label={`일몰 ${sunset}`} sx={{ width: "100%" }} />
              </Grid>
            </Grid>

            {/* 타임라인: 향후 6칸(3시간 간격) */}
            <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 0.5 }}>
              {forecast.map((f, i) => {
                const t = Math.round(f.main?.temp ?? 0);
                const ic = f.weather?.[0]?.icon ?? "01d";
                return (
                  <Box
                    key={i}
                    sx={{
                      minWidth: 88,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      p: 1,
                      textAlign: "center",
                      background: "linear-gradient(180deg,#ffffff,#f7f9ff)",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {hhmm(f.dt)}
                    </Typography>
                    <Box
                      component="img"
                      alt="icon"
                      src={`https://openweathermap.org/img/wn/${ic}.png`}
                      sx={{ width: 36, height: 36, display: "block", mx: "auto" }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {t}°C
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}