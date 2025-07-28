---
name: BugReport
about: Describe this issue template's purpose here.
title: ''
labels: ''
assignees: ''

---

name: 🐞 Bug Report
description: 버그가 발생했을 때 작성하는 템플릿입니다.
labels: ["bug"]

body:
  - type: textarea
    id: description
    attributes:
      label: 버그 설명
      description: 어떤 문제가 발생했는지 명확히 설명해주세요.
      placeholder: 예: 로그인 시 500 에러 발생

  - type: textarea
    id: steps
    attributes:
      label: 재현 절차
      description: 버그를 어떻게 재현할 수 있나요?
      placeholder: |
        1. 로그인 페이지로 이동
        2. 아이디 입력 후 로그인 시도
        3. 500 에러 발생

  - type: input
    id: environment
    attributes:
      label: 환경 정보
      description: 실행 환경에 대한 정보를 작성해주세요.
      placeholder: 예: Chrome 120 / Spring Boot 3.2.2 / MySQL 8.0

  - type: textarea
    id: logs
    attributes:
      label: 관련 로그
      description: 에러 로그 또는 콘솔 출력 내용이 있다면 첨부해주세요.
      placeholder: 예: java.lang.NullPointerException ...
      render: shell
