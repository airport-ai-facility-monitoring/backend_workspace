---
name: FeatureRequest
about: Describe this issue template's purpose here.
title: ''
labels: ''
assignees: ''

---

name: ✨ Feature Request
description: 새로운 기능 요청을 위한 템플릿입니다.
labels: ["enhancement"]

body:
  - type: textarea
    id: overview
    attributes:
      label: 기능 설명
      description: 제안하고 싶은 기능이 무엇인가요?
      placeholder: 예: 사용자 프로필 수정 기능

  - type: textarea
    id: reason
    attributes:
      label: 필요성
      description: 왜 이 기능이 필요한가요? 어떤 문제를 해결할 수 있나요?
      placeholder: 예: 사용자 정보 변경이 현재 불가능하여 UX가 저하됨

  - type: textarea
    id: additional
    attributes:
      label: 추가 정보
      description: 관련 참고자료나 예상 UI/UX가 있다면 첨부해주세요.
