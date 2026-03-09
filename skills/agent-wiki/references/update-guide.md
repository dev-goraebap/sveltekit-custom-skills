# 업데이트 모드 가이드

워크스페이스에 이미 `product-backlog.md`가 있을 때 사용하는 플로우다.
`product-backlog.md`가 없는 기존 프로젝트에서 이슈/변경 요청이 들어오면, 먼저 부트스트랩을 수행한 뒤 이 플로우를 따른다.

---

## 부트스트랩 — 백로그 없는 프로젝트 초기화

`product-backlog.md`가 없지만 전체 기획서가 아닌 이슈/변경 요청이 들어온 경우:

1. 사용자에게 프로젝트 기본 정보를 확인한다 (최소: 제품명, 플랫폼 유형)
2. 최소 Product Brief 생성 (`references/product-brief-guide.md` 참고, 파악 불가 항목은 `(미정)`)
3. 빈 Product Backlog 생성 (Epic/Story 목록 없이 개요만)
4. 위키 스킬 파일 생성 (SKILL.md, README.md, CONTRIBUTING.md, .gitignore — `references/wiki-skill-guide.md` 참고)
5. 이후 아래 U-Step 1부터 진행하여 이슈를 Story로 추가

부트스트랩은 한 번만 수행한다. 이후부터는 일반 업데이트 모드.

---

## U-Step 0 — 워크스페이스 판단

위키가 어디에 있는지에 따라 수정 방식이 달라진다:

### 케이스 A: 위키 워크스페이스에서 직접 작업

CWD가 위키 리포 자체인 경우 (예: `todo-app-wiki/` 디렉토리에서 작업).
`product-backlog.md`가 CWD 루트에 있고, CWD 자체가 git 리포다.

→ **로컬 git으로 수정**: 브랜치 생성 → 파일 수정 → push → PR 생성
→ credentials 불필요 (이미 git remote가 설정되어 있음)

### 케이스 B: 프로젝트에 설치된 스킬로 호출

CWD가 소스코드 프로젝트인 경우 (예: `todo-app/`).
위키가 `.agents/skills/todo-app-wiki/`에 설치되어 있다.

→ **설치된 스킬의 로컬 파일을 직접 수정하지 않는다** (읽기 전용 복사본)
→ `references/remote-contrib-guide.md` 참고하여 원격 모드: credentials 읽기 → 원격 리포 clone → 브랜치 → 변경 → MR/PR

### 판단 기준

1. `product-backlog.md`가 CWD 루트에 있으면 → 케이스 A
2. 위키가 `.agents/skills/` 또는 `~/.claude/skills/` 하위에 있으면 → 케이스 B
3. 사용자가 원격 위키를 명시적으로 언급하면 → 케이스 B

---

## U-Step 1 — 현황 파악

기존 파일을 모두 읽어 현재 상태를 파악한다:
- `product-brief.md` — 제품 컨텍스트 (없을 수 있음)
- `product-backlog.md` — Epic/Story 목록, 의존성 맵
- `definition-of-done.md` — 현재 DoD
- `epics/ep-*.md` — 각 Epic 문서
- `user-stories/us-*.md` — 각 Story 문서

현재 마지막 EP ID, 마지막 US ID, Epic 수, Story 수를 파악해둔다.

## U-Step 2 — 변경 내용 파악

- **새 문서가 있는 경우**: 입력 확인 → 텍스트 추출 → 분석한 뒤 기존 현황과 비교
- **구두 지시만 있는 경우**: 사용자 설명에서 직접 변경사항 도출

변경 유형 분류:
```
[추가] 새 Epic, 새 Story, 새 인수 조건
[수정] Story명 변경, 우선순위 변경, 라벨 변경, AC 수정
[삭제] Story 제거, Epic 통합
[이동] Story의 Epic 소속 변경 (ID는 유지)
[Product Brief] 제품 컨텍스트 수정 (플랫폼, 사용자, 기술 제약 등)
```

**Product Brief가 없는 기존 위키:** `product-brief.md`가 없으면 기존 백로그와 Epic/Story를 분석하여 Product Brief 역생성을 제안한다. 사용자가 동의하면 `references/product-brief-guide.md`를 참고하여 생성한다.

애매한 부분이 있으면 작업 전에 사용자에게 확인한다.

## U-Step 3 — 선택적 수정

변경이 있는 파일만 수정한다.

| 변경 유형 | 수정 대상 파일 |
|-----------|----------------|
| 새 Story 추가 | 새 Story `.md` 생성 + 소속 Epic `.md` + `product-backlog.md` |
| 새 Epic 추가 | 새 Epic `.md` 생성 + 하위 Story `.md` + `product-backlog.md` |
| Story 내용 수정 | 해당 Story `.md` + `product-backlog.md` (요약 변경 시) |
| Story 삭제 | 해당 Story `.md` 삭제 + 소속 Epic `.md` + `product-backlog.md` |
| Epic 삭제 | Epic `.md` 삭제 + 하위 Story 처리 + `product-backlog.md` |
| DoD 수정 | `definition-of-done.md` |
| Product Brief 수정 | `product-brief.md` |
| Product Brief 신규 | `product-brief.md` 생성 (`references/product-brief-guide.md` 참고) |

**ID 처리:**
- 기존 ID는 절대 변경하지 않는다 (추적 이력 보존)
- 새 Epic은 마지막 EP 번호 다음을 이어서 부여한다
- 새 Story는 마지막 US 번호 다음을 이어서 부여한다
- 삭제된 ID는 재사용하지 않는다
- Story를 다른 Epic으로 옮겨도 US ID는 유지한다

## U-Step 4 — 변경 요약 보고

### 로컬 모드

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

### 원격 모드

MR/PR URL을 포함한다:

```
✅ 위키 업데이트 MR/PR 생성 완료

PR: https://github.com/{repo}/pull/42

[변경 내용]
- user-stories/us-014-fix-login-bug.md 추가 (bug 타입)
- epics/ep-002-user-mgmt.md 갱신
- product-backlog.md 갱신
```
