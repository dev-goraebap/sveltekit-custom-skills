---
name: agent-wiki
description: >
  비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP 등)를 받아
  [project]-wiki 워크스페이스를 생성하고 Product Brief, Product Backlog,
  Epic, User Story, DoD, Sitemap, Data Model 문서를 관리한다.
  인수 조건은 Given-When-Then 형식으로 작성하고, 7단계 상태로 Story 진행을 추적한다.
  소스코드 프로젝트에서는 기존 위키를 git submodule로 연결하여 에이전트 컨텍스트를 제공하고,
  업데이트는 서브모듈에서 직접 commit·push → PR 사이클로 수행한다.
  트리거: "백로그 만들어줘", "유저스토리 정리", "에픽 뽑아줘", "위키 만들어줘",
  "agent-wiki", "에이전트 위키", "요구사항을 스토리로", "백로그 업데이트",
  "스토리 추가해줘", "이슈 정리해줘", "버그 추가해줘",
  "서브모듈 추가", "위키 내용 파악", "위키 업데이트"
metadata:
  author: dev-goraebap
  version: "3.1"
---

# agent-wiki

비정형 정보를 받아 **Product Brief, Product Backlog, Epic, User Story, DoD, Sitemap, Data Model** 문서를 생성·관리한다.
소스코드 프로젝트에서는 위키를 git submodule로 연결하여 에이전트 컨텍스트를 제공한다.

## 모드 감지

실행 전 아래 순서로 모드를 결정하고, 해당 workflow 파일을 Read하여 절차를 따른다.

| 조건 | 모드 | workflow 파일 |
|------|------|--------------|
| "help"/"이 스킬 뭐야"/"어떤걸 할 수 있어"/"사용법" 등 스킬 자체에 대한 질문 | GUIDE | `workflow/guide-mode.md` |
| URL 인수 + "연결"/"서브모듈"/"connect" 키워드 | CONNECT | `workflow/connect-mode.md` |
| "read"/"내용 파악"/"분석해줘" 단독 요청 | READ | `workflow/read-mode.md` |
| "update"/"업데이트"/"수정" 요청 또는 CWD에 `product-backlog.md` 있음 | UPDATE | `workflow/update-mode.md` |
| "create"/"새 프로젝트"/"위키 만들어줘" 또는 그 외 기획 정보 제공 | CREATE | `workflow/create-mode.md` |

## 위키 워크스페이스 구조

```
[project]-wiki/
├── AGENTS.md               ← 위키 메타 + 에이전트 지시사항
├── README.md
├── .gitignore
├── product-brief.md        ← 제품 컨텍스트
├── product-backlog.md      ← 전체 인덱스 (진입점)
├── definition-of-done.md
├── sitemap.md              ← 화면 목록 (UI 정보 있을 때 자동 생성)
├── data-model.md           ← 엔티티 정의 (MVP 프론트 검토 후 생성)
├── epics/ep-NNN-[슬러그].md
├── user-stories/us-NNN-[슬러그].md
├── scripts/                ← PDF 추출 유틸
└── .sources/               ← 입력 원본 보관
```

지원 입력: `.pdf`, `.txt`, `.md`, 구두 설명. 그 외는 변환 요청.

## 참고 파일

### Workflow (모드별 실행 절차)

| 파일 | 역할 |
|------|------|
| `workflow/guide-mode.md` | 스킬 안내 (GUIDE) |
| `workflow/create-mode.md` | 신규 위키 생성 (CREATE-step1~5) |
| `workflow/connect-mode.md` | 서브모듈 연결 (CONNECT) |
| `workflow/read-mode.md` | 위키 내용 파악 (READ-step1~3) |
| `workflow/update-mode.md` | 기존 문서 변경 (UPDATE-step1~4) |

### References (문서별 작성 규칙)

| 파일 | 역할 |
|------|------|
| `references/product-brief-guide.md` | Product Brief 템플릿 + 작성 규칙 |
| `references/product-backlog-guide.md` | Backlog 템플릿 + 소스 이력 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + ID/파일명 규칙 |
| `references/user-story-guide.md` | Story 템플릿 + AC(GWT) + 7단계 상태 + agent-note |
| `references/dod-guide.md` | DoD 체크리스트 템플릿 |
| `references/wiki-agents-guide.md` | AGENTS.md/README/CONTRIBUTING/.gitignore 템플릿 + 이름 규칙 |
| `references/sitemap-guide.md` | Sitemap 생성 규칙 + 도출 기준 |
| `references/data-model-guide.md` | Data Model 생성 조건 + 도출 규칙 |
