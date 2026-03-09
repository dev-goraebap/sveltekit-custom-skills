---
type: product-backlog
project: <project-name>
epic_count: N
story_count: N
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Product Backlog

## 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | (프로젝트명) |
| Product Brief | [product-brief.md](product-brief.md) |
| 작성일 | YYYY-MM-DD |
| Epic 수 | N |
| Story 수 | N |

## 소스 이력

| 버전 | 파일 | 입력일 | 비고 |
|------|------|--------|------|
| v1 | [rfp-document.txt](.sources/v1_rfp-document.txt) | YYYY-MM-DD | 최초 RFP |
| v2 | [meeting-notes.txt](.sources/v2_meeting-notes.txt) | YYYY-MM-DD | 회의록 반영 |

## Epic 목록

| Epic ID | Epic명 | Story 수 | 우선순위 |
|---------|--------|----------|---------|
| [EP-001](epics/ep-001-xxx.md) | Epic명 | N | Must |
| [EP-002](epics/ep-002-xxx.md) | Epic명 | N | Should |

## User Story 전체 목록

| Story ID | Story명 | Epic | 타입 | 우선순위 | 상태 | 라벨 |
|----------|---------|------|------|---------|------|------|
| [US-001](user-stories/us-001-xxx.md) | Story명 | [EP-001](epics/ep-001-xxx.md) | feature | Must | Todo | frontend, backend |
| [US-002](user-stories/us-002-xxx.md) | Story명 | [EP-001](epics/ep-001-xxx.md) | bug | Must | Todo | frontend |

## 의존성 맵

| Story | 선행 Story |
|-------|-----------|
| [US-002](user-stories/us-002-xxx.md) | [US-001](user-stories/us-001-xxx.md) |
| [US-005](user-stories/us-005-xxx.md) | [US-003](user-stories/us-003-xxx.md), [US-004](user-stories/us-004-xxx.md) |
