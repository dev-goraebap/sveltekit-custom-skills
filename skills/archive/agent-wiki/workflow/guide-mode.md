# GUIDE 모드 — 스킬 안내

스킬 자체에 대한 질문에 답한다. 위키 문서를 생성하거나 수정하지 않는다.

---

## 안내 응답 템플릿

아래 내용을 바탕으로 질문에 맞게 간결하게 답한다.

---

**agent-wiki**는 비정형 기획 정보를 구조화된 애자일 문서로 변환하고, 소스코드 프로젝트에 git submodule로 연결하여 에이전트가 제품 컨텍스트를 이해한 채로 작업할 수 있게 하는 스킬이다.

### 할 수 있는 것

| 모드 | 설명 | 예시 트리거 |
|------|------|------------|
| **CREATE** | 비정형 정보(RFP, 기획 메모, 구두 설명)를 받아 위키 워크스페이스를 새로 생성 | "백로그 만들어줘", "위키 만들어줘", "에픽 뽑아줘" |
| **CONNECT** | 원격 위키 리포지토리를 소스코드 프로젝트에 git submodule로 연결 | "/agent-wiki https://github.com/org/repo 서브모듈 추가" |
| **READ** | 기존 위키 내용을 읽어 현황(Epic/Story 통계, MVP 범위, 진행 상태)을 요약 보고 | "위키 내용 파악해줘", "백로그 분석해줘" |
| **UPDATE** | 기존 위키에 Story 추가, 수정, 취소, Epic 추가 등 변경 작업 수행 | "스토리 추가해줘", "버그 이슈 정리해줘", "백로그 업데이트" |
| **GUIDE** | 이 스킬의 기능과 사용법 안내 | "이 스킬 뭐야?", "help", "어떤걸 할 수 있어" |

### 생성되는 문서

- `product-brief.md` — 제품 컨텍스트 (플랫폼, 대상 사용자, 기술 제약)
- `product-backlog.md` — 전체 Epic/Story 인덱스
- `epics/ep-NNN-*.md` — Epic 상세
- `user-stories/us-NNN-*.md` — User Story + Given-When-Then 인수 조건
- `definition-of-done.md` — 공통 완료 기준
- `sitemap.md` — 화면 목록 (UI 정보 있을 때)
- `data-model.md` — 엔티티 정의 (MVP 확정 후)

### Story 상태 (7단계)

`pending` → `ready` → `in-progress` → `review-needed` → `done`
`in-progress` ↔ `blocked`, Story 폐기 시 `cancelled`

### 지원 입력 형식

`.pdf`, `.txt`, `.md`, 구두 설명. 그 외는 변환 요청.

---

질문이 더 있으면 이어서 답한다. 위키 작업을 시작하려면 모드를 말해주거나 기획 정보를 제공하면 된다.
