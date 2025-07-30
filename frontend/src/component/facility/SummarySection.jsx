import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import React from "react";

// Data for the circular charts
const chartData = [
  { id: 1, name: "주기 시설", normalPercentage: 85, inspectionPercentage: 15 },
  { id: 2, name: "조명", normalPercentage: 85, inspectionPercentage: 15 },
  { id: 3, name: "급유 설비", normalPercentage: 85, inspectionPercentage: 15 },
  { id: 4, name: "안내 표지", normalPercentage: 85, inspectionPercentage: 15 },
];

const SummarySection = () => {
  return (
    <Card
      sx={{
        width: "100%",
        height: "388px",
        borderRadius: "42px",
        p: 3,
        position: "relative",
      }}
    >
      {/* Top section with circular charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {chartData.slice(0, 2).map((item) => (
          <Grid item xs={6} sm={3} key={item.id}>
            <Stack alignItems="center">
              <Box sx={{ position: "relative", width: 75, height: 75 }}>
                {/* Blue circle (normal percentage) */}
                <Box
                  sx={{
                    width: 75,
                    height: 75,
                    borderRadius: "50%",
                    background: "rgba(100, 150, 255, 0.8)",
                    position: "relative",
                  }}
                >
                  {/* Red segment (inspection percentage) */}
                  <Box
                    sx={{
                      width: 31,
                      height: 37,
                      borderRadius: "50%",
                      background: "rgba(255, 100, 150, 0.8)",
                      position: "absolute",
                      top: 37,
                      left: 0,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 5,
                        color: "white",
                        fontWeight: 500,
                        fontSize: 10,
                      }}
                    >
                      15%
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: 3,
                      left: 23,
                      color: "white",
                      fontWeight: 500,
                      fontSize: 10,
                    }}
                  >
                    85
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 1, fontSize: 12 }}
              >
                {item.name}
              </Typography>
            </Stack>
          </Grid>
        ))}

        {/* Second row with two more charts */}
        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            {chartData.slice(2, 4).map((item) => (
              <Grid item xs={6} key={item.id}>
                <Stack alignItems="center">
                  <Box sx={{ position: "relative", width: 74, height: 70 }}>
                    {/* Blue circle (normal percentage) */}
                    <Box
                      sx={{
                        width: 74,
                        height: 70,
                        borderRadius: "50%",
                        background: "rgba(100, 150, 255, 0.8)",
                        position: "relative",
                      }}
                    >
                      {/* Red segment (inspection percentage) */}
                      <Box
                        sx={{
                          width: 30,
                          height: 34,
                          borderRadius: "50%",
                          background: "rgba(255, 100, 150, 0.8)",
                          position: "absolute",
                          top: 34,
                          left: 0,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            position: "absolute",
                            top: 15,
                            left: 5,
                            color: "white",
                            fontWeight: 500,
                            fontSize: 10,
                          }}
                        >
                          15%
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: 3,
                          left: 23,
                          color: "white",
                          fontWeight: 500,
                          fontSize: 10,
                        }}
                      >
                        85
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 1, fontSize: 12 }}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Legend */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ p: 1 }}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ position: "relative", width: 16, height: 16 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      top: 4,
                      left: 4,
                      backgroundColor: "rgba(100, 150, 255, 0.8)",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  정상 가동 수
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ position: "relative", width: 16, height: 16 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      top: 4,
                      left: 4,
                      backgroundColor: "rgba(255, 100, 150, 0.8)",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  점검 필요
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Bar chart section */}
      <Box sx={{ mt: 2, width: "100%" }}>
        <Box
          component="img"
          src="./group-2636.png"
          alt="Bar chart"
          sx={{ width: "100%", height: "95.86px" }}
        />
        <Grid container>
          {chartData.map((item) => (
            <Grid item xs={3} key={item.id}>
              <Typography variant="body2" align="center" sx={{ fontSize: 12 }}>
                {item.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default SummarySection;
