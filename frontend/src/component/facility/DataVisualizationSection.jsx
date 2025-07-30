import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import React from "react";

const DataVisualizationSection = () => {
  // Data for the facility categories
  const facilityData = [
    { name: "주기 시설", value: 85, inspectionNeeded: 15 },
    { name: "조명", value: 85, inspectionNeeded: 15 },
    { name: "급유 설비", value: 85, inspectionNeeded: 15 },
    { name: "안내표지", value: 85, inspectionNeeded: 15 },
  ];

  return (
    <Card sx={{ borderRadius: "42px", p: 3, width: "100%", height: "388px" }}>
      {/* Top section with donut charts */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* First two donut charts */}
        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box position="relative" width={75} height={75}>
              {/* This would be a proper donut chart in a real implementation */}
              <Box
                sx={{
                  width: 75,
                  height: 75,
                  borderRadius: "50%",
                  position: "relative",
                  bgcolor: "#f0f0f0",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: 24,
                    color: "white",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  85
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: 31,
                    height: 37,
                    top: 37,
                    left: 0,
                    borderRadius: "50%",
                    bgcolor: "#f0f0f0",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 5,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  >
                    15%
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography align="center" sx={{ mt: 1 }}>
              주기 시설
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box position="relative" width={75} height={75}>
              {/* This would be a proper donut chart in a real implementation */}
              <Box
                sx={{
                  width: 75,
                  height: 75,
                  borderRadius: "50%",
                  position: "relative",
                  bgcolor: "#f0f0f0",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: 24,
                    color: "white",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  85
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: 31,
                    height: 37,
                    top: 37,
                    left: 0,
                    borderRadius: "50%",
                    bgcolor: "#f0f0f0",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 5,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  >
                    15%
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography align="center" sx={{ mt: 1 }}>
              조명
            </Typography>
          </Stack>
        </Grid>

        {/* Second two donut charts */}
        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box position="relative" width={75} height={75}>
              {/* This would be a proper donut chart in a real implementation */}
              <Box
                sx={{
                  width: 75,
                  height: 75,
                  borderRadius: "50%",
                  position: "relative",
                  bgcolor: "#f0f0f0",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: 24,
                    color: "white",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  85
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: 31,
                    height: 37,
                    top: 37,
                    left: 0,
                    borderRadius: "50%",
                    bgcolor: "#f0f0f0",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 5,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  >
                    15%
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography align="center" sx={{ mt: 1 }}>
              급유 설비
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={6} md={3}>
          <Stack alignItems="center">
            <Box position="relative" width={75} height={75}>
              {/* This would be a proper donut chart in a real implementation */}
              <Box
                sx={{
                  width: 75,
                  height: 75,
                  borderRadius: "50%",
                  position: "relative",
                  bgcolor: "#f0f0f0",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: 24,
                    color: "white",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  85
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    width: 31,
                    height: 37,
                    top: 37,
                    left: 0,
                    borderRadius: "50%",
                    bgcolor: "#f0f0f0",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 5,
                      color: "white",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  >
                    15%
                  </Box>
                </Box>
              </Box>
            </Box>
            <Typography align="center" sx={{ mt: 1 }}>
              안내표지
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* Legend */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Stack spacing={1}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FiberManualRecordIcon
              sx={{ color: "primary.main", fontSize: 16, mr: 1 }}
            />
            <Typography variant="caption" fontWeight="medium">
              정상 가동 수
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FiberManualRecordIcon
              sx={{ color: "error.light", fontSize: 16, mr: 1 }}
            />
            <Typography variant="caption" fontWeight="medium">
              점검 필요
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Bar chart section */}
      <Box sx={{ mt: 2 }}>
        <Box
          component="img"
          src="/group-2636-3.png"
          alt="Bar chart"
          sx={{ width: "100%" }}
        />

        {/* Category labels below chart */}
        <Grid container>
          {facilityData.map((item, index) => (
            <Grid item xs={3} key={index}>
              <Typography align="center">{item.name}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default DataVisualizationSection;
