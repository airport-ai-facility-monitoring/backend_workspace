import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import React from "react";

// Mock data for the chart components
const chartData = [
  { name: "주기 시설", normalValue: 85, inspectionValue: 15 },
  { name: "조명", normalValue: 85, inspectionValue: 15 },
  { name: "급유 설비", normalValue: 85, inspectionValue: 15 },
  { name: "안내표지", normalValue: 85, inspectionValue: 15 },
];

const ChartSection = () => {
  return (
    <Card
      sx={{
        width: "100%",
        height: "388px",
        borderRadius: "42px",
        position: "relative",
        p: 3,
      }}
    >
      {/* Top section with donut charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* First two donut charts */}
        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box sx={{ position: "relative", width: 75, height: 75 }}>
              <Box
                sx={{
                  width: 75,
                  height: 75,
                  borderRadius: "50%",
                  background: "url(/ellipse-195-13.svg) 100% 100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 31,
                    height: 37,
                    top: 37,
                    left: 0,
                    background: "url(/ellipse-196-13.svg) 100% 100%",
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 5,
                      fontFamily: "Inter-Medium, Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: 10,
                      textAlign: "center",
                    }}
                  >
                    15%
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    position: "absolute",
                    left: 24,
                    top: 3,
                    fontFamily: "Inter-Medium, Helvetica",
                    fontWeight: 500,
                    color: "white",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  85
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ mt: 1, textAlign: "center" }}>
              주기 시설
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box sx={{ position: "relative", width: 75, height: 75 }}>
              <Box
                sx={{
                  width: 75,
                  height: 75,
                  borderRadius: "50%",
                  background: "url(/ellipse-195-14.svg) 100% 100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 31,
                    height: 37,
                    top: 37,
                    left: 0,
                    background: "url(/ellipse-196-14.svg) 100% 100%",
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 5,
                      fontFamily: "Inter-Medium, Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: 10,
                      textAlign: "center",
                    }}
                  >
                    15%
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    position: "absolute",
                    left: 24,
                    top: 3,
                    fontFamily: "Inter-Medium, Helvetica",
                    fontWeight: 500,
                    color: "white",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  85
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ mt: 1, textAlign: "center" }}>조명</Typography>
          </Stack>
        </Grid>

        {/* Second two donut charts */}
        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box sx={{ position: "relative", width: 74, height: 70 }}>
              <Box
                sx={{
                  width: 74,
                  height: 70,
                  borderRadius: "50%",
                  background: "url(/ellipse-195-16.svg) 100% 100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 30,
                    height: 34,
                    top: 34,
                    left: 0,
                    background: "url(/ellipse-196-16.svg) 100% 100%",
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 15,
                      left: 5,
                      fontFamily: "Inter-Medium, Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: 10,
                      textAlign: "center",
                    }}
                  >
                    15%
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    position: "absolute",
                    left: 23,
                    top: 3,
                    fontFamily: "Inter-Medium, Helvetica",
                    fontWeight: 500,
                    color: "white",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  85
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ mt: 1, textAlign: "center" }}>
              급유 설비
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box sx={{ position: "relative", width: 74, height: 70 }}>
              <Box
                sx={{
                  width: 74,
                  height: 70,
                  borderRadius: "50%",
                  background: "url(/ellipse-195-15.svg) 100% 100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 30,
                    height: 34,
                    top: 34,
                    left: 0,
                    background: "url(/ellipse-196-15.svg) 100% 100%",
                  }}
                >
                  <Typography
                    sx={{
                      position: "absolute",
                      top: 15,
                      left: 5,
                      fontFamily: "Inter-Medium, Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: 10,
                      textAlign: "center",
                    }}
                  >
                    15%
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    position: "absolute",
                    left: 23,
                    top: 3,
                    fontFamily: "Inter-Medium, Helvetica",
                    fontWeight: 500,
                    color: "white",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  85
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ mt: 1, textAlign: "center" }}>
              안내표지
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* Legend */}
      <Box sx={{ position: "absolute", top: 119, right: 30 }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, position: "relative" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  top: 4,
                  left: 4,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  position: "absolute",
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: "Poppins-Medium, Helvetica",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              정상 가동 수
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 16, position: "relative" }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  top: 4,
                  left: 4,
                  borderRadius: "50%",
                  bgcolor: "error.light",
                  position: "absolute",
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: "Poppins-Medium, Helvetica",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              점검 필요
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Bottom chart section */}
      <Box sx={{ mt: 15 }}>
        <Box
          component="img"
          src={"/group-2636-4.png"}
          alt="Chart"
          sx={{ width: "100%", height: "95.86px" }}
        />
        <Grid container>
          {chartData.map((item, index) => (
            <Grid item xs={3} key={index}>
              <Typography sx={{ textAlign: "center" }}>{item.name}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default ChartSection;
