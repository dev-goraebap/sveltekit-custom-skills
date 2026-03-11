---
name: agile-doc-creator
description: >
  비정형 정보(기획 메모, 클라이언트 요청, 아이디어, RFP 등) 또는 기존 소스코드·문서를 분석하여
  에자일 문서(Product Brief, Product Backlog, Epic, User Story, DoD)를 생성·관리한다.
  인수 조건은 Given-When-Then 형식으로 작성하고, 7단계 상태로 Story 진행을 추적한다.
  생성 후 다른 에이전트가 이 문서들을 유지·보수하는 방법을 가이드라인으로 함께 준비한다.
  트리거: "백로그 만들어줘", "유저스토리 정리", "에픽 뽑아줘", "Product Brief 작성",
  "인수 조건 작성", "agile-doc-creator", "에자일 문서", "요구사항을 스토리로",
  "백로그 업데이트", "스토리 추가해줘", "이슈 정리해줘", "버그 추가해줘", "DoD 만들어줘"
metadata:
  author: dev-goraebap
  version: "1.0"
---

# agile-doc-creator

비정형 입력 또는 기존 코드·문서에서 **에자일 산출물**을 생성·관리한다.

## 동작 환경

CWD에 직접 문서를 생성한다.

## 산출물 목록

| 문서 | 생성 조건 | 가이드 |
|------|-----------|--------|
| `product-brief.md` | 항상 | `references/product-brief-guide.md` |
| `epics/ep-NNN-[슬러그].md` | 항상 | `references/epic-guide.md` |
| `user-stories/us-NNN-[슬러그].md` | 항상 | `references/user-story-guide.md` |
| `product-backlog.md` | 항상 | `references/product-backlog-guide.md` |
| `definition-of-done.md` | 항상 | `references/dod-guide.md` |
| `CONTRIBUTING.md` | 신규 워크스페이스 | 아래 가이드라인 섹션 참고 |

## 절차

### Step 1 — 입력 검증 및 처리

**수용 가능한 입력:**

| 입력 유형 | 처리 방법 |
|-----------|-----------|
| 직접 구문 (구두 설명, 인라인 텍스트) | `.sources/v{N}_verbal-input.txt`에 저장 |
| 소스코드 경로 | Read하여 도메인·기능·엔드포인트 분석 |
| `.md` 파일 | Read 후 `.sources/`로 이동 |
| `.txt` 파일 | Read 후 `.sources/`로 이동 |

**그 외 파일 형식 처리 규칙:**

| 형식 | 처리 |
|------|------|
| `.pdf` | `/pdf-parser` 스킬로 텍스트 추출 → 추출된 `.txt`를 입력으로 재처리 |
| AI가 직접 읽을 수 있는 형식 (JSON, YAML, CSV 등) | 내용을 읽고 텍스트로 변환 후 처리 |
| 그 외 모든 형식 | **중단** — 아래 피드백 메시지 출력 |

**지원하지 않는 형식 피드백:**

```
⚠️  처리할 수 없는 파일 형식입니다: {파일명}

지원 형식: 직접 구문, 소스코드 경로, .md, .txt

대안:
  - PDF: /pdf-parser로 텍스트를 먼저 추출한 뒤 다시 요청해주세요
  - Word/Excel/PPT: .txt 또는 .md로 변환 후 제공해주세요
  - 이미지: 내용을 텍스트로 직접 입력해주세요
```

**입력 원본 보관:**
수용된 입력은 `.sources/v{N}_[슬러그].[확장자]`로 보관한다 (N은 기존 파일 수 + 1).

기존 에자일 문서가 있으면 먼저 읽어 현황 파악 (기존 ID 범위, Epic/Story 수).

### Step 2 — 문서 생성 (신규)

`product-brief.md`의 컨텍스트를 반영하여 아래 순서로 문서를 생성한다.
각 문서의 상세 작성 규칙은 `references/` 가이드 참고.

1. `product-brief.md`
2. `epics/ep-NNN-[슬러그].md` (Epic별 파일)
3. `user-stories/us-NNN-[슬러그].md` (Story별 파일)
4. `product-backlog.md` (인덱스)
5. `definition-of-done.md`

플랫폼 유형이 불명확하면 추측하지 않고 사용자에게 확인한다.

`product-backlog.md` 생성 후 사용자에게 리뷰 요청:
> Epic 범위와 Story 우선순위를 검토해주세요. 수정할 내용이 있으면 말씀해주세요.

### Step 3 — 문서 변경 (기존)

기존 에자일 문서가 있는 경우 변경 유형을 분류한다:

```
[추가] 새 Epic, 새 Story, 새 인수 조건
[수정] Story명 변경, 우선순위 변경, AC 수정
[취소] Story 방향 변경 → state: cancelled (삭제 아님)
[삭제] 완전 제거 (중복·오생성에만 사용)
[이동] Story의 Epic 소속 변경 (ID 유지)
```

**ID 처리:**
- 기존 ID는 절대 변경하지 않는다
- 새 Epic은 마지막 EP 번호 다음을 이어서 부여
- 새 Story는 마지막 US 번호 다음을 이어서 부여
- 삭제된 ID는 재사용하지 않는다

**프론트매터 갱신:**
- `updated`: 수정 시마다 오늘 날짜
- `state`, `priority`: 본문과 프론트매터 모두 갱신
- `agent-note`: 상태 전환 시 컨텍스트 기록 (review-needed, blocked, cancelled 전환 시 필수)

### Step 4 — 가이드라인 문서 생성

신규 워크스페이스에서 처음 에자일 문서를 생성하는 경우 `CONTRIBUTING.md`를 함께 생성한다.
이 파일은 **다른 에이전트(또는 사람)가 에자일 문서를 유지·보수하는 방법**을 정의한다:

```markdown
# Contributing to [프로젝트명] Wiki

## 문서 추가 방법
- Epic 추가: references/epic-guide.md 참고
- Story 추가: references/user-story-guide.md 참고
- ID 규칙: EP-NNN, US-NNN (마지막 번호에서 이어서)

## 상태 관리
- 7단계 상태: pending → ready → in-progress → review-needed → blocked → done → cancelled
- 상태 전환 시 agent-note에 컨텍스트 기록 필수

## 수정 원칙
- 기존 ID 변경 금지
- 삭제 대신 cancelled 처리
- product-backlog.md는 항상 최신 상태 유지
```

## 참고 파일

### References

| 파일 | 역할 |
|------|------|
| `references/product-brief-guide.md` | Product Brief 템플릿 + 작성 규칙 |
| `references/product-backlog-guide.md` | Backlog 템플릿 + 소스 이력 + 링크 패턴 |
| `references/epic-guide.md` | Epic 템플릿 + ID/파일명 규칙 |
| `references/user-story-guide.md` | Story 템플릿 + AC(GWT) + 7단계 상태 + agent-note |
| `references/dod-guide.md` | DoD 체크리스트 템플릿 |

### Templates

| 파일 | 역할 |
|------|------|
| `templates/product-brief.md` | Product Brief 양식 |
| `templates/product-backlog.md` | Backlog 양식 |
| `templates/epic.md` | Epic 양식 |
| `templates/user-story.md` | User Story 양식 |
| `templates/definition-of-done.md` | DoD 양식 |
