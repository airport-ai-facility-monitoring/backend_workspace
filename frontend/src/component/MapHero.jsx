import React from "react";
import { Box, Card, CardHeader, Divider, Chip, Typography } from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";

/**
 * 공항 지도 + 라벨 오버레이 공용 컴포넌트 (홈/대시보드 동일 사용)
 * 라벨의 top/left는 % (이미지 기준)로 넣어주세요.
 */
export default function MapHero({
  labels = [],
  onLabelClick = () => {},
  title = "공항 전경 & 위치 핫스팟",
  subtitle = "라벨을 클릭하면 해당 구역 상세로 이동합니다.",
  height = 620,
  imageSrc = "/chart.png",
}) {
  return (
    <Card
      elevation={1}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        bgcolor: "#e8eefc",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* 제목 영역 (이미지 기준에서 제외) */}
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceRoundedIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={800}>
              {title}
            </Typography>
          </Box>
        }
        subheader={subtitle}
        sx={{ px: 2, py: 1.5, "& .MuiCardHeader-subheader": { fontSize: 12 } }}
      />
      <Divider />

      {/* ✅ 이미지 박스: 라벨의 absolute 기준이 되는 컨테이너 */}
      <Box
        sx={{
          position: "relative",
          height,            // 높이 고정/반응형 조절
          overflow: "hidden",
          backgroundColor: "#dfe7ff",
        }}
      >
        {/* 이미지 */}
        <Box
          component="img"
          src={imageSrc}
          alt="Airport overview"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(1.02)",
          }}
        />

        {/* ✅ 라벨: 이미지 박스를 기준으로 위치 */}
        {labels.map(({ id, name, top, left }) => (
          <Chip
            key={id}
            label={name}
            clickable
            onClick={() => onLabelClick(id)}
            size="small"
            sx={{
              position: "absolute",
              top,
              left,
              transform: "translate(-50%, -50%)",
              bgcolor: "#ffffff",
              border: "1px solid #f1c40f",
              fontSize: 12,
              fontWeight: 800,
              color: "#111827",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": { bgcolor: "#fffcee" },
              zIndex: 2,
            }}
          />
        ))}
      </Box>
    </Card>
  );
}