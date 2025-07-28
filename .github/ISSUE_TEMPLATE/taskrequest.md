---
name: TaskRequest
about: Describe this issue template's purpose here.
title: ''
labels: ''
assignees: ''

---

name: 🛠 Task Request
description: 특정 작업 요청을 위한 템플릿입니다.
labels: ["task"]

body:
  - type: input
    id: summary
    attributes:
      label: 작업 요약
      placeholder: 예: DB 마이그레이션 스크립트 작성

  - type: textarea
    id: details
    attributes:
      label: 상세 설명
      placeholder: 어떤 작업이고 어떤 부분에 영향을 주는지 기술해주세요.

  - type: dropdown
    id: priority
    attributes:
      label: 우선순위
      options:
        - 높음
        - 중간
        - 낮음
