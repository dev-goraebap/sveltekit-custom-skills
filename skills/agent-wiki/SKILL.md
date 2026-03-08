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

비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP, 회의록 등)를 받아 **Product Backlog, Epic, User Story, Definition of Done** 문서를 구조화된 마크다운으로 생성한다. 생성된 산출물은 위키 스킬로서 실제 프로젝트에 설치하여 에이전트의 프로젝트 이해도를 높이는 데 활용된다.

---

## 지원 입력 형식

| 형식 | 처리 방식 |
|------|-----------|
| `.pdf` | 내장 Node.js 스크립트로 텍스트 추출 후 분석 |
| `.txt` | 직접 읽어서 분석 |
| `.md`  | 직접 읽어서 분석 |
| 구두 설명 | 채팅으로 전달된 설명을 그대로 분석 |

`.pdf/.txt/.md/구두 설명` 외의 형식은 지원하지 않는다. 사용자에게 위 형식 중 하나로 변환해달라고 안내한다.

---

## 산출물 구조

```
agent-wiki/
├── product-backlog.md               ← 전체 인덱스 (진입점)
├── definition-of-done.md            ← 완료 기준
├── epics/
│   ├── ep-001-xxx.md
│   └── ep-002-xxx.md
├── user-stories/
│   ├── us-001-xxx.md
│   ├── us-002-xxx.md
│   └── us-003-xxx.md
└── extracted/                       ← PDF 입력 시만
    └── source.txt
```

---

## ID 규칙

| 대상 | 패턴 | 정규식 | 예시 |
|------|------|--------|------|
| Epic | EP-NNN | `EP-\d{3}` | EP-001, EP-010 |
| User Story | US-NNN | `US-\d{3}` | US-001, US-042 |

공통 규칙:
- 001부터 시작, 3자리 zero-padding
- 기존 ID는 절대 변경하지 않는다
- 삭제된 ID는 재사용하지 않는다
- Story는 Epic 구분 없이 통합 번호 (Story를 다른 Epic으로 옮겨도 ID 유지)

## 파일명 규칙

| 대상 | 패턴 | 예시 |
|------|------|------|
| Epic | `ep-NNN-[슬러그].md` | `ep-001-user-mgmt.md` |
| Story | `us-NNN-[슬러그].md` | `us-001-signup.md` |
| 고정 파일 | 번호 없이 고정명 | `product-backlog.md`, `definition-of-done.md` |

슬러그: 소문자 + 하이픈, 핵심 키워드만

---

## 실행 절차

### Step 0 — 모드 감지

워크스페이스 루트에 `agent-wiki/` 폴더가 이미 존재하는지 확인한다.

- **`agent-wiki/` 없음** → **신규 생성 모드**: Step 1부터 진행
- **`agent-wiki/` 있음** → **업데이트 모드**: 아래 [업데이트 모드 상세 절차](#업데이트-모드-상세-절차)로 건너뜀

### Step 1 — 입력 확인

사용자가 제공한 입력을 확인한다.

- **파일 경로 제공 시**: 확장자 확인 → `.pdf/.txt/.md` 이외면 오류 메시지와 함께 종료, 파일 미존재 시 경로 재확인 요청
- **구두 설명(채팅)**: 사용자가 텍스트로 직접 설명한 경우 그대로 사용

### Step 2 — 텍스트 추출

**PDF 입력일 때:**

```bash
# 의존성 설치 (최초 1회)
cd ~/.claude/skills/agent-wiki/scripts && npm install --silent

# 텍스트 추출 — 반드시 이 경로로 저장
node ~/.claude/skills/agent-wiki/scripts/extract_pdf_text.js \
  <입력.pdf> -o <워크스페이스_루트>/agent-wiki/extracted/source.txt
```

추출된 파일은 **반드시 `agent-wiki/extracted/source.txt`** 경로에 저장한다.

**TXT/MD 입력일 때:** Read 도구로 직접 읽는다.

**구두 설명일 때:** 사용자가 채팅으로 전달한 설명을 그대로 분석 입력으로 사용한다.

### Step 3 — 분석

`references/product-backlog-guide.md`, `references/epic-guide.md`, `references/user-story-guide.md`, `references/dod-guide.md`를 읽어 템플릿과 규칙을 확인한 뒤, 입력 텍스트에서 아래 항목을 도출한다:

1. **Epic 도출**: 기능 영역별로 Epic을 묶는다. EP-001부터 번호 부여
2. **User Story 도출**: 각 Epic 하위에 "~로서, ~하고 싶다" 형식의 스토리를 도출한다. US-001부터 Epic 구분 없이 통합 번호 부여
3. **우선순위 분류**: MoSCoW (Must / Should / Could) 기준으로 분류
4. **라벨 부여**: frontend, backend, mobile, infra 등 해당 영역 라벨
5. **의존성 파악**: Story 간 선행/후행 관계 식별
6. **인수 조건(AC) 작성**: 각 Story별 체크리스트 형태의 인수 조건

분석 결과를 정리한 뒤 다음 단계로 진입한다:

```
[EP-001: 사용자 관리]
  - US-001: 회원가입 (Must, frontend+backend)
  - US-002: 소셜 로그인 (Should, frontend+backend) ← US-001 선행
  - US-003: 프로필 관리 (Could, frontend+backend) ← US-001 선행

[EP-002: 대시보드]
  - US-004: 통계 대시보드 (Must, frontend+backend)
  - US-005: 알림 설정 (Should, frontend+backend)
```

### Step 4 — Product Backlog 생성

`references/product-backlog-guide.md`를 참고하여 `agent-wiki/product-backlog.md`를 생성한다. 모든 Epic과 Story를 인덱스 테이블로 정리하고, 각 문서로의 상대 링크를 포함한다.

### Step 5 — Epic / User Story / DoD 생성

각 가이드를 참고하여 개별 문서를 생성한다:

- **Epic 문서**: `references/epic-guide.md` 참고 → `agent-wiki/epics/ep-NNN-[슬러그].md`
- **User Story 문서**: `references/user-story-guide.md` 참고 → `agent-wiki/user-stories/us-NNN-[슬러그].md`
- **Definition of Done**: `references/dod-guide.md` 참고 → `agent-wiki/definition-of-done.md`

모든 문서에는 상호 링크를 포함한다:
- Product Backlog → Epic, Story 링크
- Epic → 소속 Story 링크, Product Backlog 역링크
- Story → 소속 Epic 링크, 선행/후행 Story 링크, Product Backlog 역링크

### Step 6 — 결과 보고

생성 완료 후 아래 내용을 사용자에게 보고한다:

```
✅ agent-wiki 문서 생성 완료

[생성 파일]
- product-backlog.md
- definition-of-done.md
- epics/ep-001-xxx.md ~ ep-003-xxx.md (3개)
- user-stories/us-001-xxx.md ~ us-012-xxx.md (12개)

[요약]
- Epic: 3개 (EP-001 ~ EP-003)
- User Story: 12개 (US-001 ~ US-012)
- 우선순위: Must 5, Should 4, Could 3
```

---

## 업데이트 모드 상세 절차

워크스페이스에 이미 `agent-wiki/` 폴더가 있을 때 사용하는 플로우다.

### U-Step 1 — 현황 파악

기존 파일을 모두 읽어 현재 상태를 파악한다:
- `agent-wiki/product-backlog.md` — Epic/Story 목록, 의존성 맵
- `agent-wiki/definition-of-done.md` — 현재 DoD
- `agent-wiki/epics/ep-*.md` — 각 Epic 문서
- `agent-wiki/user-stories/us-*.md` — 각 Story 문서

현재 마지막 EP ID, 마지막 US ID, Epic 수, Story 수를 파악해둔다.

### U-Step 2 — 변경 내용 파악

- **새 문서가 있는 경우**: Step 1~3을 수행한 뒤 기존 현황과 비교
- **구두 지시만 있는 경우**: 사용자 설명에서 직접 변경사항 도출

변경 유형 분류:
```
[추가] 새 Epic, 새 Story, 새 인수 조건
[수정] Story명 변경, 우선순위 변경, 라벨 변경, AC 수정
[삭제] Story 제거, Epic 통합
[이동] Story의 Epic 소속 변경 (ID는 유지)
```

애매한 부분이 있으면 작업 전에 사용자에게 확인한다.

### U-Step 3 — 선택적 수정

변경이 있는 파일만 수정한다.

| 변경 유형 | 수정 대상 파일 |
|-----------|----------------|
| 새 Story 추가 | 새 Story `.md` 생성 + 소속 Epic `.md` + `product-backlog.md` |
| 새 Epic 추가 | 새 Epic `.md` 생성 + 하위 Story `.md` + `product-backlog.md` |
| Story 내용 수정 | 해당 Story `.md` + `product-backlog.md` (요약 변경 시) |
| Story 삭제 | 해당 Story `.md` 삭제 + 소속 Epic `.md` + `product-backlog.md` |
| Epic 삭제 | Epic `.md` 삭제 + 하위 Story 처리 + `product-backlog.md` |
| DoD 수정 | `definition-of-done.md` |

**ID 처리:**
- 기존 ID는 절대 변경하지 않는다 (추적 이력 보존)
- 새 Epic은 마지막 EP 번호 다음을 이어서 부여한다
- 새 Story는 마지막 US 번호 다음을 이어서 부여한다
- 삭제된 ID는 재사용하지 않는다
- Story를 다른 Epic으로 옮겨도 US ID는 유지한다

### U-Step 4 — 변경 요약 보고

```
✅ agent-wiki 업데이트 완료

[수정된 파일]
- user-stories/us-003-profile.md: 인수 조건 2개 추가
- epics/ep-001-user-mgmt.md: US-013 추가 반영
- product-backlog.md: Story 목록 갱신

[추가된 파일]
- user-stories/us-013-password-reset.md (US-013, EP-001 소속)

[변경 없는 파일]
- definition-of-done.md, ep-002-dashboard.md 등 (변경 없음)
```

---

## 참고 파일

| 파일 | 역할 |
|------|------|
| `references/product-backlog-guide.md` | Product Backlog 템플릿 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + EP ID 규칙 |
| `references/user-story-guide.md` | User Story 템플릿 + AC + 상태/라벨/의존성 |
| `references/dod-guide.md` | Definition of Done 체크리스트 템플릿 |
