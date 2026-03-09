---
project: {프로젝트명}
wiki: {프로젝트슬러그}
---

# {프로젝트명} Wiki

이 문서는 에이전트(Claude 등)가 {프로젝트명} 위키를 이해하고 작업하기 위한 지침이다.

## 역할

비정형 정보를 받아 Product Brief, Product Backlog, Epic, User Story, DoD, Sitemap, Data Model을 생성·갱신한다.

## 문서 구조

- [`product-brief.md`](product-brief.md) — 제품 컨텍스트 (플랫폼, 대상 사용자, 기술 제약)
- [`product-backlog.md`](product-backlog.md) — 전체 인덱스 (Epic 목록, Story 전체 목록, 의존성 맵)
- [`epics/`](epics/) — Epic별 상세 문서
- [`user-stories/`](user-stories/) — User Story별 상세 문서
- [`definition-of-done.md`](definition-of-done.md) — 공통 완료 기준
- [`sitemap.md`](sitemap.md) — 화면 목록 (UI 정보 있을 때 자동 생성)
- [`data-model.md`](data-model.md) — 엔티티·관계 정의 (MVP 프론트 검토 후 생성)

## 에이전트 작업 방식

**이 위키 디렉토리 자체에서 작업하는 경우 (wiki workspace):**
- `agent-wiki` 스킬을 통해 문서를 생성·수정한다
- 변경 후 `git commit && git push`

**소스코드 프로젝트의 서브모듈로 사용되는 경우:**
- 이 AGENTS.md와 주요 문서를 읽어 제품 컨텍스트를 파악한다
- 문서 업데이트 요청 시 `agent-wiki` 스킬의 UPDATE 모드를 실행한다

## 원격 리포지토리

> 이 섹션은 원격 리포 정보가 있는 경우에만 유지한다.

| 항목 | 내용 |
|------|------|
| 플랫폼 | GitHub / GitLab |
| 리포지토리 | {repo-url} |
| Clone URL | {clone-url} |
