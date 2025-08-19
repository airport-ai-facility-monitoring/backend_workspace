import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert, // 누락된 import 추가
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const buttonBase = {
  bgcolor: "white",
  color: "#3150b0",
  height: "45px",
  fontFamily: "Montserrat",
  fontWeight: 600,
  fontSize: "14px",
  "&:hover": { bgcolor: "#f5f5f5" },
  boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
};

const detailedPrivacyPolicyText = `
개인정보처리방침

본 개인정보처리방침은 프린세스 공항 서비스(이하 "회사")가 운영하는 서비스(이하 "서비스")를 이용하는 회원님의 개인정보를 보호하기 위해 수립되었습니다.

제1조 (개인정보의 수집 및 이용 목적)
회사는 다음의 목적을 위해 개인정보를 수집하고 이용합니다.
1. 회원 가입 및 관리: 회원 식별, 본인 확인, 연령 확인, 부정이용 방지, 고지사항 전달
2. 서비스 제공: 맞춤형 서비스 제공, 콘텐츠 추천, 공지사항 및 중요 업데이트 전송
3. 신규 서비스 개발 및 마케팅 활용: 신규 서비스 개발, 통계학적 특성에 따른 서비스 제공, 이벤트 및 광고성 정보 제공(수신 동의 시)
4. 보안 및 서비스 안정성 확보: 서비스의 안정적인 운영, 보안 위협 대응, 계정 도용 및 부정 거래 방지

제2조 (수집하는 개인정보 항목)
회사는 서비스 제공을 위해 다음과 같은 최소한의 개인정보를 수집합니다.
1. 필수 항목: 사원번호, 성명, 이메일 주소, 비밀번호
2. 선택 항목: 부서, 직책, 연락처
3. 자동 수집 항목: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기 정보

제3조 (개인정보의 보유 및 이용 기간)
회사는 원칙적으로 회원 탈퇴 시까지 개인정보를 보유 및 이용하며, 관련 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)
- 대금결제 및 재화 등의 공급에 관한 기록: 5년 (同)
- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (同)
- 통신비밀보호법에 따른 통신사실확인자료: 3개월

제4조 (개인정보의 제3자 제공)
회사는 정보주체의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다.
1. 정보주체로부터 별도의 동의를 받은 경우
2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
3. 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 가공하여 제공하는 경우

제5조 (개인정보 처리의 위탁)
회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁할 수 있습니다.
- 클라우드 서버 운영: [위탁업체명]
- 결제 처리: [PG사명]
- 고객 지원 및 상담: [고객센터 아웃소싱 업체명]
회사는 위탁계약 체결 시 개인정보보호 관련 법규의 준수, 개인정보에 관한 제3자 제공 금지 및 책임부담 등을 명확히 규정하고, 당해 계약내용을 서면 또는 전자적으로 보관하겠습니다.

제6조 (정보주체의 권리·의무 및 그 행사방법)
회원은 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입 해지를 요청할 수도 있습니다. 개인정보의 조회, 수정, 삭제, 처리정지 요청은 회사의 개인정보보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다.

제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
회사는 개인화되고 맞춤화된 서비스를 제공하기 위해서 회원의 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 회원은 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.

제8조 (개인정보보호책임자)
회사는 회원의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보보호책임자를 지정하고 있습니다.
- 개인정보보호책임자: [이름]
- 소속부서: [부서명]
- 직위: [직위]
- 이메일: [이메일 주소]
- 전화번호: [전화번호]

제9조 (고지의 의무)
현 개인정보처리방침 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일전부터 홈페이지의 '공지사항'을 통해 고지할 것입니다.
`;

const detailedCCtvText = `CCTV 개인정보 처리방침

1. 수집 및 이용 목적
- 공항 내 안전사고, 도난, 분실, 불법행위 방지 및 대응
- 시설물 관리 및 운영 모니터링
- 사고 발생 시 증거 자료 확보 및 조사
- 공항 보안 및 출입 통제

2. 수집 항목
- 영상 정보: CCTV 촬영 영상(시간, 위치, 상황 포함)
- 자동 수집 정보: 영상 촬영 시점의 시간, CCTV 장치 식별 정보, 관련 로그

3. 보유 및 이용 기간
- CCTV 영상: 원칙적으로 30일 이내 보관
- 사고 관련 영상: 사고 처리 완료 시까지 보관
- 보안 관련 사건: 법령에 따라 정해진 기간 동안 보관

4. 제3자 제공
- CCTV 영상은 원칙적으로 외부 제공하지 않음
- 단, 법령 근거 수사기관 요청 시 또는 영상 속 개인 식별 불가 형태의 통계/연구 목적으로 제공 가능

5. 개인정보 처리 위탁
- CCTV 운영, 영상 저장 및 관리 업무를 외부 전문 업체에 위탁 가능
- 위탁 계약 시 개인정보 보호 관련 법규 준수 및 제3자 제공 금지 명시

6. 정보주체 권리 및 행사 방법
- CCTV 영상 속 개인은 관련 법령에서 정한 절차에 따라 열람, 삭제, 정지 요청 가능
- 요청은 개인정보보호책임자를 통해 가능
- 단, 법령에서 열람 제한 규정이 있을 경우 제한될 수 있음

7. 개인정보보호책임자
- 기존 개인정보보호책임자가 CCTV 관련 개인정보 처리에 대해서도 책임을 집니다.
`;

const PrivacyConsent = () => {
  const navigate = useNavigate();
  const [requiredConsent, setRequiredConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [cctvConsent, setCctvConsent] = useState(false); // CCTV 동의 추가
  const [locationConsent, setLocationConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState("");

    // 상세보기 토글
  const [showRequiredDetail, setShowRequiredDetail] = useState(false);
  const [showCctvDetail, setShowCctvDetail] = useState(false);
  const handleAgree = () => {
    if (!requiredConsent) {
      setError("필수 개인정보 수집 및 이용에 동의하셔야 합니다.");
      return;
    }
    if (!cctvConsent) {
      setError("CCTV 개인정보 수집 및 이용에 동의하셔야 합니다.");
      return;
    }

    localStorage.setItem("privacyConsent", "agreed");
    localStorage.setItem("marketingConsent", marketingConsent);
    localStorage.setItem("locationConsent", locationConsent);
    localStorage.setItem("cctvConsent", cctvConsent);
    navigate("/signup");
  };

  const handleReject = () => {
    alert("개인정보 수집/이용에 동의하지 않으면 서비스를 이용할 수 없습니다.");
  };

  return (
        <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#2148c0", display: "flex", justifyContent: "center", alignItems: "center", p: { xs: 2, md: 4 }, position: "relative", overflow: "hidden" }}>
      {/* 배경 감성 유지 */}
      <Box sx={{ position: "absolute", width: "650px", height: "650px", bottom: "-320px", left: "-300px", bgcolor: "#264ec9", borderRadius: "50%", filter: "blur(40px)", zIndex: 0, pointerEvents: "none" }} />
      
      <Box sx={{ width: "100%", maxWidth: 960, zIndex: 1, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "stretch" }}>
        <Paper elevation={12} sx={{ flex: "1 1 320px", p: { xs: 3, md: 4 }, borderRadius: 3, position: "relative", bgcolor: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", minWidth: 0 }}>
          <Typography variant="h5" align="center" sx={{ color: "white", fontFamily: "Montserrat", fontWeight: 600, mb: 1 }}>
            개인정보 수집 및 이용 동의
          </Typography>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.3)", mb: 3 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* 기존 필수/선택 항목 */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={requiredConsent}
                  onChange={(e) => {
                    setRequiredConsent(e.target.checked);
                    setError("");
                  }}
                  sx={{ color: "white", "&.Mui-checked": { color: "#4caf50" } }}
                />
              }
              label={
                <Box
                  onClick={() => setShowRequiredDetail(true)} // 전체 라벨 클릭 시 다이어로그
                  sx={{ cursor: "pointer" }}
                >
                  <Typography component="div" sx={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                    [필수] 개인정보 수집 및 이용 동의
                  </Typography>
                  <Typography component="div" variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                    서비스 제공을 위해 필요한 정보(이름, 사번, 이메일 등)를 수집합니다. 클릭하면 상세내용을 확인할 수 있습니다.
                  </Typography>
                </Box>
              }
            />

            {/* 상세보기 Dialog */}
                  <Dialog open={showRequiredDetail} onClose={() => setShowRequiredDetail(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ bgcolor: "#1f3fa0", color: "white" }}>개인정보 처리방침</DialogTitle>
                    <DialogContent dividers sx={{ bgcolor: "#1f47c4", color: "white", whiteSpace: "pre-wrap" }}>
                      {detailedPrivacyPolicyText}
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: "#1f47c4" }}>
                      <Button onClick={() => setShowRequiredDetail(false)} sx={{ color: "white" }}>닫기</Button>
                    </DialogActions>
                  </Dialog>
            
                        {/* CCTV 동의 추가 */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={cctvConsent}
                  onChange={(e) => {
                    setCctvConsent(e.target.checked);
                    setError("");
                  }}
                  sx={{ color: "white", "&.Mui-checked": { color: "#4caf50" } }}
                />
              }
              label={
                <Box
                  onClick={() => setShowCctvDetail(true)} // 전체 라벨 클릭 시 다이어로그
                  sx={{ cursor: "pointer" }}
                >
                  <Typography component="div" sx={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                    [필수] CCTV 영상 수집·이용 동의
                  </Typography>
                  <Typography component="div" variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                    공항 안전, 사고 예방, 보안 목적을 위해 CCTV 영상을 수집하고 이용합니다. 클릭하면 상세내용을 확인할 수 있습니다.
                  </Typography>
                </Box>
              }
            />

            {/* CCTV 상세보기 Dialog */}
            <Dialog
              open={showCctvDetail}
              onClose={() => setShowCctvDetail(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle sx={{ bgcolor: "#1f3fa0", color: "white" }}>CCTV 개인정보 처리방침</DialogTitle>
              <DialogContent dividers sx={{ bgcolor: "#1f47c4", color: "white", whiteSpace: "pre-wrap" }}>
                {/* CCTV 관련 상세내용 */}
                {detailedCCtvText}
              </DialogContent>
              <DialogActions sx={{ bgcolor: "#1f47c4" }}>
                <Button onClick={() => setShowCctvDetail(false)} sx={{ color: "white" }}>닫기</Button>
              </DialogActions>
            </Dialog>

            <FormControlLabel
              control={
                <Checkbox checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} sx={{ color: "white", "&.Mui-checked": { color: "#4caf50" } }} />
              }
              label={<Box>
                <Typography component="div" sx={{ color: "white", fontWeight: 700, fontSize: 14 }}>[선택] 마케팅 정보 수신 동의</Typography>
                <Typography component="div" variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>이벤트 및 프로모션 정보를 이메일 또는 SMS로 수신합니다.</Typography>
              </Box>}
            />

            <FormControlLabel
              control={
                <Checkbox checked={locationConsent} onChange={(e) => setLocationConsent(e.target.checked)} sx={{ color: "white", "&.Mui-checked": { color: "#4caf50" } }} />
              }
              label={<Box>
                <Typography component="div" sx={{ color: "white", fontWeight: 700, fontSize: 14 }}>[선택] 위치 기반 서비스 이용 동의</Typography>
                <Typography component="div" variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>더 정확한 서비스 제공을 위해 위치 정보를 수집 및 이용합니다.</Typography>
              </Box>}
            />


          </Box>

          {error && <Box sx={{ mt: 1 }}><Alert severity="error" sx={{ fontSize: 13 }} role="alert">{error}</Alert></Box>}

          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" fullWidth onClick={handleAgree} sx={{ ...buttonBase, flex: "1 1 180px" }} disabled={!requiredConsent || !cctvConsent}>
              동의하고 계속
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/login")}
              sx={{
                flex: "1 1 180px",
                borderColor: "white",
                color: "white",
                fontWeight: 600,
              }}
            >
              취소
            </Button>
          </Box>

          <Typography variant="caption" sx={{ display: "block", mt: 2, color: "rgba(255,255,255,0.7)" }}>
            * 필수 동의는 거부할 수 없으며, 동의하지 않으면 회원가입이 불가능합니다.
          </Typography>
        </Paper>
      </Box>


    </Box>
  );
};

export default PrivacyConsent;