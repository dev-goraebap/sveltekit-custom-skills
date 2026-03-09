# 업데이트 모드 가이드

워크스페이스에 이미 `product-backlog.md`가 있을 때 사용하는 플로우.
`product-backlog.md`가 없는 기존 프로젝트에서 이슈/변경 요청이 들어오면, 먼저 부트스트랩을 수행한 뒤 이 플로우를 따른다.

---

## 부트스트랩 — 백로그 없는 프로젝트 초기화

`product-backlog.md`가 없지만 이슈/변경 요청이 들어온 경우:

1. 사용자에게 프로젝트 기본 정보 확인 (최소: 제품명, 플랫폼 유형)
2. 최소 Product Brief 생성 (`references/product-brief-guide.md` 참고, 파악 불가 항목은 `(미정)`)
3. 빈 Product Backlog 생성 (Epic/Story 목록 없이 개요만)
4. 이후 아래 U-Step 1부터 진행하여 이슈를 Story로 추가

부트스트랩은 한 번만 수행한다.

---

## U-Step 0 — 워크스페이스 판단

| 조건 | 모드 |
|------|------|
| `product-backlog.md`가 CWD 루트에 있고 CWD가 git 리포 | **Mode A** — 로컬 직접 수정 |
| 위키가 `*-wiki/` 서브모듈로 존재 | **Mode B** — 서브모듈 경로에서 수정 |

**Mode A**: 직접 파일을 수정하고 `git add -A && git commit`으로 마무리.

**Mode B**: `CONTRIBUTING.md`의 C-Step 1~4 절차를 따른다.
서브모듈 경로(`WIKI_PATH`)에서 파일을 수정하고 위키 remote에 push.
부모 프로젝트의 서브모듈 ref도 함께 갱신.

---

## U-Step 1 — 현황 파악

기존 파일을 읽어 현재 상태를 파악한다:
- `product-brief.md` — 제품 컨텍스트 (없을 수 있음)
- `product-backlog.md` — Epic/Story 목록, 의존성 맵
- `definition-of-done.md`
- `epics/ep-*.md`
- `user-stories/us-*.md`

현재 마지막 EP ID, 마지막 US ID, Epic 수, Story 수를 파악해둔다.

---

## U-Step 2 — 변경 내용 파악

- **새 문서가 있는 경우**: 입력 확인 → 텍스트 추출 → 기존 현황과 비교
- **구두 지시만 있는 경우**: 사용자 설명에서 직접 변경사항 도출

변경 유형 분류:
```
[추가] 새 Epic, 새 Story, 새 인수 조건
[수정] Story명 변경, 우선순위 변경, 라벨 변경, AC 수정
[삭제] Story 제거, Epic 통합
[이동] Story의 Epic 소속 변경 (ID 유지)
[Product Brief] 제품 컨텍스트 수정
```

**Product Brief가 없는 기존 위키:** 기존 백로그와 Epic/Story를 분석하여 역생성을 제안한다.
사용자 동의 시 `references/product-brief-guide.md` 참고하여 생성.

애매한 부분은 작업 전에 사용자에게 확인한다.

---

## U-Step 3 — 선택적 수정

변경이 있는 파일만 수정한다.

| 변경 유형 | 수정 대상 |
|-----------|-----------|
| 새 Story 추가 | 새 Story `.md` + 소속 Epic `.md` + `product-backlog.md` |
| 새 Epic 추가 | 새 Epic `.md` + 하위 Story `.md` + `product-backlog.md` |
| Story 내용 수정 | 해당 Story `.md` + `product-backlog.md` (요약 변경 시) |
| Story 삭제 | 해당 Story `.md` 삭제 + 소속 Epic `.md` + `product-backlog.md` |
| Epic 삭제 | Epic `.md` 삭제 + 하위 Story 처리 + `product-backlog.md` |
| DoD 수정 | `definition-of-done.md` |
| Product Brief 수정 | `product-brief.md` |

**ID 처리:**
- 기존 ID는 절대 변경하지 않는다
- 새 Epic은 마지막 EP 번호 다음을 이어서 부여
- 새 Story는 마지막 US 번호 다음을 이어서 부여
- 삭제된 ID는 재사용하지 않는다
- Story를 다른 Epic으로 옮겨도 US ID 유지

**프론트매터 갱신:**
- `updated`: 파일 수정 시마다 오늘 날짜로 갱신
- `state`, `priority`: 본문 테이블과 프론트매터 모두 갱신
- `story_count` (epic): 소속 Story 변경 시 갱신
- `epic_count`, `story_count` (product-backlog): Epic/Story 변경 시 갱신

---

## U-Step 4 — 변경 요약 보고

### Mode A

```bash
git add -A
git commit -m "docs: {변경 요약}"
```

```
✅ agent-wiki 업데이트 완료

[수정된 파일]
- user-stories/us-003-profile.md: 인수 조건 2개 추가
- epics/ep-001-user-mgmt.md: US-013 추가 반영
- product-backlog.md: Story 목록 갱신

[추가된 파일]
- user-stories/us-013-password-reset.md (US-013, EP-001 소속)
```

### Mode B

`CONTRIBUTING.md`의 C-Step 2~4 절차에 따라 push하고 PR/MR URL을 안내한다.
