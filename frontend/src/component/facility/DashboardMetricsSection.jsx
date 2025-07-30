import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";

// Mock data for the metrics
const metricsData = [
  { name: "주기 시설", normalCount: 85, inspectionNeeded: 15 },
  { name: "조명", normalCount: 85, inspectionNeeded: 15 },
  { name: "급유 설비", normalCount: 85, inspectionNeeded: 15 },
  { name: "안내표지", normalCount: 85, inspectionNeeded: 15 },
];

const DashboardMetricsSection = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "388px",
        borderRadius: "42px",
        p: 3,
        position: "relative",
      }}
    >
      {/* Top section with donut charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {metricsData.slice(0, 2).map((metric, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative", width: 75, height: 75 }}>
                {/* This would be a proper donut chart in a real implementation */}
                <Box
                  sx={{
                    width: 75,
                    height: 75,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: 31,
                      height: 37,
                      bottom: 0,
                      left: 0,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
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
                sx={{
                  mt: 1,
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                {metric.name}
              </Typography>
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} sm={6}>
          <Grid container spacing={2}>
            {metricsData.slice(2, 4).map((metric, index) => (
              <Grid item xs={6} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ position: "relative", width: 74, height: 70 }}>
                    {/* This would be a proper donut chart in a real implementation */}
                    <Box
                      sx={{
                        width: 74,
                        height: 70,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          width: 30,
                          height: 34,
                          bottom: 0,
                          left: 0,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
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
                    sx={{
                      mt: 1,
                      textAlign: "center",
                      fontSize: 12,
                    }}
                  >
                    {metric.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Legend */}
      <Box sx={{ position: "absolute", top: 119, right: 30 }}>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#6366F1",
                  borderRadius: "50%",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 500 }}>
              정상 가동 수
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#EC4899",
                  borderRadius: "50%",
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ ml: 1, fontWeight: 500 }}>
              점검 필요
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Graph section */}
      <Box sx={{ mt: 4, width: "100%" }}>
        <Box
          component="img"
          src="/group-2636-2.png"
          alt="Metrics Graph"
          sx={{ width: "100%", height: "96px" }}
        />
        <Grid container sx={{ mt: 1 }}>
          {metricsData.map((metric, index) => (
            <Grid item xs={3} key={index} sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ fontSize: 12 }}>
                {metric.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default DashboardMetricsSection;
