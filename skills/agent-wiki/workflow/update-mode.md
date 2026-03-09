# UPDATE 모드 — 기존 문서 변경

이미 `product-backlog.md`가 있는 위키를 변경하는 전체 흐름이다.

---

## 부트스트랩 — 백로그 없는 프로젝트에서 변경 요청이 들어온 경우

`product-backlog.md`가 없는 기존 프로젝트에서 이슈/변경 요청이 들어오면:

1. 사용자에게 프로젝트 기본 정보 확인 (최소: 제품명, 플랫폼 유형)
2. 최소 Product Brief 생성 (`references/product-brief-guide.md` 참고, 파악 불가 항목은 `(미정)`)
3. 빈 Product Backlog 생성 (Epic/Story 목록 없이 개요만)
4. 이후 UPDATE-step2부터 진행하여 이슈를 Story로 추가

부트스트랩은 한 번만 수행한다.

---

## UPDATE-step1 — READ 먼저 실행

변경 전 항상 READ 모드 절차(`workflow/read-mode.md`)로 현황을 파악한다.

현재 마지막 EP ID, 마지막 US ID, Epic 수, Story 수를 파악해둔다.

---

## UPDATE-step2 — 변경 내용 파악 및 입력 처리

- **새 문서가 있는 경우**: 입력 확인 → 텍스트 추출 → 기존 현황과 비교
  파일 처리 방법은 `workflow/create-mode.md`의 CREATE-step2와 동일.
- **구두 지시만 있는 경우**: 사용자 설명에서 직접 변경사항 도출

변경 유형 분류:

```
[추가] 새 Epic, 새 Story, 새 인수 조건
[수정] Story명 변경, 우선순위 변경, 라벨 변경, AC 수정
[취소] Story 방향 변경으로 불필요 → cancelled 처리 (삭제 아님)
[삭제] Story 완전 제거 (드문 경우: 중복 ID, 테스트용 오생성 등)
[이동] Story의 Epic 소속 변경 (ID 유지)
[Product Brief] 제품 컨텍스트 수정
```

**Product Brief가 없는 기존 위키:** 기존 백로그와 Epic/Story를 분석하여 역생성을 제안한다.
사용자 동의 시 `references/product-brief-guide.md` 참고하여 생성.

애매한 부분은 작업 전에 사용자에게 확인한다.

---

## UPDATE-step3 — 선택적 수정

변경이 있는 파일만 수정한다.

| 변경 유형 | 수정 대상 |
|-----------|-----------|
| 새 Story 추가 | 새 Story `.md` + 소속 Epic `.md` + `product-backlog.md` |
| 새 Epic 추가 | 새 Epic `.md` + 하위 Story `.md` + `product-backlog.md` |
| Story 내용 수정 | 해당 Story `.md` + `product-backlog.md` (요약 변경 시) |
| Story 취소 | 해당 Story `.md`의 state → `cancelled`, agent-note에 취소 사유 기록 + 소속 Epic `.md` + `product-backlog.md`의 취소된 스토리 섹션으로 행 이동 |
| Story 완전 삭제 (드문 경우) | 해당 Story `.md` 삭제 + 소속 Epic `.md` + `product-backlog.md` |
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
- `agent-note`: 상태 전환 시 컨텍스트 기록 (review-needed, blocked, cancelled 전환 시 필수)
- `story_count` (epic): 소속 Story 변경 시 갱신
- `epic_count`, `story_count`, `cancelled_count` (product-backlog): Epic/Story 변경 시 갱신

**레거시 상태 마이그레이션:**
기존 위키의 구 상태값(Todo/In Progress/Done)은 일괄 변환하지 않는다. 해당 파일을 다음에 편집할 때 개별 전환한다.
- `Todo` → `pending`
- `In Progress` → `in-progress`
- `Done` → `done`

---

## UPDATE-step4 — 커밋 및 원격 반영

### 위키 워크스페이스 (Mode A)

```bash
git add -A
git commit -m "docs: {변경 요약}"
git push
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

### 서브모듈 환경 (Mode B)

**C-Step 1 — 서브모듈 경로 확인**

```bash
git config --file .gitmodules --get-regexp path | grep wiki
# 예: submodule.bteam-wiki.path = bteam-wiki
```

비어 있다면: `git submodule update --init`

**C-Step 2 — 브랜치 생성 및 변경**

```bash
cd $WIKI_PATH
git checkout -b contrib/{프로젝트슬러그}-{변경설명}
# 파일 수정 (UPDATE-step3 내용)
git add -A
git commit -m "[{프로젝트슬러그}] 변경 요약"
git push origin contrib/{프로젝트슬러그}-{변경설명}
```

push 인증 오류 시 → 사용자에게 git 인증 설정 안내 (SSH 키 또는 git credential manager).

**C-Step 3 — 부모 프로젝트 서브모듈 ref 갱신**

```bash
cd <소스프로젝트-루트>
git add {WIKI_PATH}
git commit -m "chore: update {프로젝트슬러그} wiki ref"
```

**C-Step 4 — 결과 안내**

```
✅ 변경사항이 push되었습니다.

브랜치: contrib/{프로젝트슬러그}-{설명}

PR/MR 생성:
  GitHub: https://github.com/{repo}/compare/contrib/{브랜치명}?expand=1
  GitLab: {url}/{project}/-/merge_requests/new?merge_request[source_branch]=contrib/{브랜치명}

Merge 후 서브모듈을 최신화하려면:
  git submodule update --remote {WIKI_PATH}
  git add {WIKI_PATH} && git commit -m "chore: update wiki ref"
```

**무조건 원격 리포지토리에 내용이 반영되어야 한다.** 로컬 커밋만으로 종료하지 않는다.
