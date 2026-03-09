---
name: agent-wiki
description: >
  비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP 등)를 받아
  [project]-wiki 워크스페이스를 생성하고 Product Brief, Product Backlog,
  Epic, User Story, DoD 문서를 관리한다.
  소스코드 프로젝트에서는 기존 위키를 git submodule로 연결하여 에이전트 컨텍스트를 제공하고,
  업데이트는 서브모듈에서 직접 commit·push → PR 사이클로 수행한다.
  트리거: "백로그 만들어줘", "유저스토리 정리", "에픽 뽑아줘", "위키 만들어줘",
  "agent-wiki", "에이전트 위키", "요구사항을 스토리로", "백로그 업데이트",
  "스토리 추가해줘", "이슈 정리해줘", "버그 추가해줘",
  "서브모듈 추가", "위키 내용 파악", "위키 업데이트"
allowed-tools: Bash Read Write
metadata:
  author: dev-goraebap
  version: "2.0"
---

# agent-wiki

비정형 정보를 받아 **Product Brief, Product Backlog, Epic, User Story, DoD** 문서를 생성·관리한다.
소스코드 프로젝트에서는 위키를 git submodule로 연결하여 에이전트 컨텍스트를 제공한다.

## 위키 워크스페이스 구조

```
[project]-wiki/
├── AGENTS.md               ← 위키 메타 + 에이전트 지시사항
├── README.md
├── CONTRIBUTING.md
├── .gitignore
├── product-brief.md        ← 제품 컨텍스트
├── product-backlog.md      ← 전체 인덱스 (진입점)
├── definition-of-done.md
├── epics/ep-NNN-[슬러그].md
├── user-stories/us-NNN-[슬러그].md
├── scripts/                ← PDF 추출 유틸
└── .sources/               ← 입력 원본 보관
```

지원 입력: `.pdf`, `.txt`, `.md`, 구두 설명. 그 외는 변환 요청.

---

## Step 0 — 컨텍스트 파악

아래 순서로 현재 상황을 판단한다:

| 조건 | 이동 |
|------|------|
| 사용자 입력에 URL + "서브모듈 추가" 포함 | → 서브모듈 추가 |
| CWD에 `product-backlog.md` 있고 CWD가 git 리포 | → Mode A |
| `.gitmodules`에 `*-wiki` 항목 있거나 `*-wiki/AGENTS.md` 존재 | → Mode B |
| 위 조건 없음 | → 신규 wiki workspace 생성 |

---

## 서브모듈 추가

기존 위키 리포를 소스코드 프로젝트에 서브모듈로 연결한다.

```bash
git submodule add <remote-url> [project]-wiki
git submodule update --init
```

완료 후 Mode B로 전환하여 내용 파악.

---

## Mode A — Wiki Workspace 직접 작업

CWD가 위키 리포 자체인 경우. 로컬에서 직접 문서를 생성·수정한다.

### Step A-0 — 작업 유형 판단

- `product-backlog.md` 없음 + 기획서/문서 입력 → **신규 생성** (Step A-1~5)
- `product-backlog.md` 없음 + 이슈/변경 요청 → **부트스트랩** (최소 Brief + 빈 Backlog) 후 업데이트
- `product-backlog.md` 있음 → **업데이트** (`references/update-guide.md` 참고)

### Step A-1 — 입력 확인 및 소스 보관

파일: 확장자 확인 (`.pdf` / `.txt` / `.md`만 허용). 구두 설명: 그대로 사용.

모든 입력을 `.sources/v{N}_[슬러그].[확장자]`로 보관.
- `.sources/`가 비어 있으면 v1, 기존 파일이 있으면 마지막 +1
- PDF → 스크립트로 텍스트 추출 후 저장, 원본도 이동
- TXT/MD → Read 후 `.sources/`로 이동
- 구두 설명 → `.sources/v{N}_verbal-input.txt`에 저장

```bash
WIKI_ROOT=$(git rev-parse --show-toplevel)
cd "$WIKI_ROOT/scripts" && npm install --silent
node "$WIKI_ROOT/scripts/extract_pdf_text.js" \
  <입력.pdf> -o "$WIKI_ROOT/.sources/v{N}_<슬러그>.txt"
```

**워크스페이스 루트에는 산출물만 존재한다.** 워크스페이스 내 입력 파일은 반드시 `.sources/`로 이동. 외부 경로 파일은 이동하지 않는다.

### Step A-2 — Product Brief 생성·갱신

`references/product-brief-guide.md` 참고. **플랫폼 유형이 불명확하면 추측하지 않고 사용자에게 확인한다.**

### Step A-3 — 분석

`product-brief.md`의 컨텍스트를 반영한 뒤 도출:
1. Epic (기능 영역별, EP-001부터)
2. User Story ("~로서, ~하고 싶다", US-001부터 통합 번호)
3. 우선순위 (Must / Should / Could)
4. 타입 (feature / bug / enhancement / tech-debt)
5. 라벨 (frontend, backend, mobile, infra 등)
6. Story 간 의존성 (선행/후행)
7. 인수 조건 (체크리스트)

### Step A-4 — 문서 생성·갱신

| 산출물 | 가이드 | 출력 경로 |
|--------|--------|-----------|
| Product Brief | `references/product-brief-guide.md` | `product-brief.md` |
| Product Backlog | `references/product-backlog-guide.md` | `product-backlog.md` |
| Epic | `references/epic-guide.md` | `epics/ep-NNN-[슬러그].md` |
| User Story | `references/user-story-guide.md` | `user-stories/us-NNN-[슬러그].md` |
| DoD | `references/dod-guide.md` | `definition-of-done.md` |

모든 문서에 상호 링크 포함 (Backlog ↔ Epic ↔ Story).

### Step A-5 — Git 커밋 및 결과 보고

```bash
git add -A
git commit -m "docs: {변경 요약}"
```

생성/수정 파일 목록, EP/US 수, ID 범위, 우선순위 분포 보고.

---

## Mode B — 소스 프로젝트 (서브모듈)

CWD가 소스코드 프로젝트이고 위키가 서브모듈로 존재하는 경우.

### 내용 파악

서브모듈 경로 확인:

```bash
git config --file .gitmodules --get-regexp path | grep wiki
```

`[project]-wiki/AGENTS.md`와 주요 문서를 Read한다:
- `[project]-wiki/AGENTS.md`
- `[project]-wiki/product-brief.md`
- `[project]-wiki/product-backlog.md`

### 업데이트

`references/update-guide.md` 참고.

---

## 신규 Wiki Workspace 생성

CWD가 비어 있거나 위키 파일이 없는 경우.

### 워크스페이스 위치 결정

숨김 파일·폴더(`.git`, `.agents`, `.claude`)를 제외하고 실질적 파일이 없으면 CWD 사용.
파일이 있으면 사용자에게 대상 경로 요청:

> 위키 워크스페이스를 만들 경로를 알려주세요.
> 이름은 `*-wiki` 형태를 권장합니다. (예: `bteam-wiki`)

### 구조 생성

```bash
mkdir -p "$TARGET"/{epics,user-stories,.sources,scripts}
touch "$TARGET"/{epics,user-stories,.sources}/.gitkeep
```

생성 파일 목록과 템플릿은 `references/wiki-agents-guide.md` 참고.

```bash
cd "$TARGET" && git init
```

기획서가 있으면 Step A-1~5 진행. 없으면 빈 구조만 생성 후 커밋.

### 원격 리포 확인

> 이 위키를 원격 리포지토리에서 관리할 예정인가요?
> URL이 있으면 알려주세요.

있으면 `git remote add origin <url>`.

### 완료 보고

```
✓ 위키 워크스페이스 생성 완료

  경로: {TARGET}
  git : 초기화 + 첫 커밋

다음 단계 — 소스코드 프로젝트에 연결하려면:
  cd <소스프로젝트>
  /agent-wiki {remote-url} 서브모듈 추가해줘
```

---

## 참고 파일

| 파일 | 역할 |
|------|------|
| `references/product-brief-guide.md` | Product Brief 템플릿 + 작성 규칙 |
| `references/product-backlog-guide.md` | Backlog 템플릿 + 소스 이력 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + ID/파일명 규칙 |
| `references/user-story-guide.md` | Story 템플릿 + AC + 타입/상태/라벨/의존성 |
| `references/dod-guide.md` | DoD 체크리스트 템플릿 |
| `references/update-guide.md` | Mode A/B 업데이트 절차 |
| `references/wiki-agents-guide.md` | AGENTS.md/README/CONTRIBUTING/.gitignore 템플릿 + 이름 규칙 |
