import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TermsModal from "./TermsModal"; // 경로: 실제 구조에 맞춰 조정

const privacyPolicyText = `
개인정보처리방침

1. 수집하는 개인정보 항목
  - 이름, 이메일 등 서비스 제공에 필요한 기본 정보
  - 로그 정보 및 이용 기록(쿠키 등)

2. 수집 및 이용 목적
  - 서비스 제공 및 회원관리
  - 개인정보 문의 대응
  - 통계 분석을 통한 서비스 개선

3. 보유 및 이용 기간
  - 회원 탈퇴 시 까지, 법령에 따라 별도 보관이 필요한 경우 해당 기간 동안 보관

4. 제3자 제공
  - 원칙적으로 제공하지 않으며, 이용자 동의가 있는 경우에 한함

5. 이용자의 권리
  - 개인정보 열람, 정정, 삭제, 처리정지 요청 가능
`;

const termsOfServiceText = `
이용약관

제1조 (목적)
이 약관은 본 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "이용자"란 이 약관에 따라 서비스를 이용하는 자를 말합니다.
2. "회원"은 서비스를 이용하기 위해 회원가입을 한 자를 말합니다.

제3조 (서비스 이용)
- 회원은 정상적인 방법으로 로그인하여 서비스를 이용할 수 있습니다.
- 회사는 서비스 제공을 위해 필요한 경우 사전 고지 후 일시적으로 서비스를 중단할 수 있습니다.

제4조 (계정 관리)
- 회원은 자신의 계정 정보의 비밀번호 관리 책임이 있으며, 제3자에게 양도하거나 공유할 수 없습니다.

제5조 (게시물)
- 이용자가 게시한 콘텐츠에 대한 권리는 이용자에게 있으나, 회사는 운영 목적상 필요한 범위 내에서 사용할 수 있습니다.

제6조 (면책)
- 천재지변, 시스템 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 회사는 책임을 지지 않습니다.

제7조 (약관 변경)
- 회사는 약관을 변경할 수 있으며, 변경 시 사전에 공지합니다.
`;

const Footer = () => {
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  return (
    <>
      <Box
        component="footer"
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          p: 2,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: 12,
        }}
      >
        <Button variant="text" onClick={() => setOpenPrivacy(true)}>
          개인정보처리방침
        </Button>
        <Button variant="text" onClick={() => setOpenTerms(true)}>
          이용약관
        </Button>
        <Typography component="span" sx={{ ml: 1 }}>
          © {new Date().getFullYear()} My App
        </Typography>
      </Box>

      <TermsModal
        open={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        title="개인정보처리방침"
      >
        {privacyPolicyText}
      </TermsModal>

      <TermsModal
        open={openTerms}
        onClose={() => setOpenTerms(false)}
        title="이용약관"
      >
        {termsOfServiceText}
      </TermsModal>
    </>
  );
};

export default Footer;