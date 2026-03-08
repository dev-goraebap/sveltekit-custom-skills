---
name: agent-wiki
description: >
  비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP 등)를 받아
  애자일 문서(Product Backlog, Epic, User Story, Definition of Done)를 자동 생성.
  생성된 문서는 위키 스킬로 활용 가능하며, 에이전트가 프로젝트 수행 시 참고 자료가 된다.
  트리거: "백로그 만들어줘", "유저스토리 정리", "에픽 뽑아줘", "애자일 문서",
  "agent-wiki", "에이전트 위키", "요구사항을 스토리로", "백로그 업데이트", "스토리 추가해줘" 등
allowed-tools: Bash Read Write
metadata:
  author: dev-goraebap
  version: "1.0"
---

# agent-wiki

비정형 정보를 받아 **Product Backlog, Epic, User Story, DoD** 문서를 워크스페이스 루트에 생성한다.

## 산출물 구조

```
<워크스페이스>/
├── product-backlog.md          ← 진입점
├── definition-of-done.md
├── epics/ep-NNN-[슬러그].md
├── user-stories/us-NNN-[슬러그].md
└── .sources/v{N}_[슬러그].*   ← 입력 원본 보관
```

지원 입력: `.pdf`, `.txt`, `.md`, 구두 설명(채팅). 그 외는 변환 요청.

---

## 실행 절차

### Step 0 — 모드 감지

- `product-backlog.md` 없음 → **신규 모드** (Step 1~6)
- `product-backlog.md` 있음 → **업데이트 모드** (`references/update-guide.md` 참고)

### Step 1 — 입력 확인

파일 경로 → 확장자 확인(`.pdf/.txt/.md`만 허용). 구두 설명 → 그대로 사용.

### Step 2 — 텍스트 추출 및 소스 보관

모든 입력은 `.sources/`에 버전별 보관한다. 파일명: `v{N}_[슬러그].[확장자]`

- `.sources/`가 없거나 비어있으면 v1, 기존 파일이 있으면 마지막 +1
- PDF → 스크립트로 텍스트 추출 후 `.sources/`에 저장, 원본 PDF도 `.sources/`로 이동
- TXT/MD → Read 후 원본을 `.sources/`로 이동
- 구두 설명 → `.sources/v{N}_verbal-input.txt`에 저장

```bash
cd ~/.claude/skills/agent-wiki/scripts && npm install --silent
node ~/.claude/skills/agent-wiki/scripts/extract_pdf_text.js \
  <입력.pdf> -o <워크스페이스>/.sources/v{N}_<슬러그>.txt
```

**원칙:** 워크스페이스 루트에는 산출물만 존재. 워크스페이스 내 입력 파일은 반드시 `.sources/`로 이동. 외부 경로 파일은 이동하지 않는다.

### Step 3 — 분석

가이드 파일들을 읽어 템플릿/규칙을 확인한 뒤, 입력에서 다음을 도출한다:

1. Epic 도출 (기능 영역별, EP-001부터)
2. User Story 도출 ("~로서, ~하고 싶다" 형식, US-001부터 통합 번호)
3. 우선순위 (Must / Should / Could)
4. 라벨 (frontend, backend, mobile, infra 등)
5. Story 간 의존성 (선행/후행)
6. 인수 조건 (체크리스트)

### Step 4 — Product Backlog 생성

`references/product-backlog-guide.md` 참고. 소스 이력 테이블 포함.

### Step 5 — Epic / User Story / DoD 생성

| 산출물 | 가이드 | 출력 경로 |
|--------|--------|-----------|
| Epic | `references/epic-guide.md` | `epics/ep-NNN-[슬러그].md` |
| User Story | `references/user-story-guide.md` | `user-stories/us-NNN-[슬러그].md` |
| DoD | `references/dod-guide.md` | `definition-of-done.md` |

모든 문서에 상호 링크 포함 (Backlog ↔ Epic ↔ Story).

### Step 6 — 결과 보고

생성 파일 목록, EP/US 수, ID 범위, 우선순위 분포를 보고.

---

## 참고 파일

| 파일 | 역할 |
|------|------|
| `references/product-backlog-guide.md` | Backlog 템플릿 + 소스 이력 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + ID/파일명 규칙 |
| `references/user-story-guide.md` | Story 템플릿 + AC + 상태/라벨/의존성 |
| `references/dod-guide.md` | DoD 체크리스트 템플릿 |
| `references/update-guide.md` | 업데이트 모드 상세 절차 |
