# Contributing Guide

이 문서는 **에이전트(Claude 등)가 이 위키를 업데이트할 때 따르는 절차**를 정의한다.

> **Note:** 이 위키 워크스페이스에서 직접 작업하는 경우(Mode A)에는
> 파일을 직접 수정하고 `git commit && git push`하면 된다.
> 이 절차는 소스코드 프로젝트의 서브모듈로 연결된 상태에서 업데이트를 요청하는 경우(Mode B)에 해당한다.

---

## 업데이트 절차 (Mode B: 서브모듈에서 호출 시)

### C-Step 1 — 서브모듈 경로 확인

소스코드 프로젝트 내 서브모듈 경로를 확인한다:

```bash
git config --file .gitmodules --get-regexp path | grep wiki
# 예: submodule.bteam-wiki.path = bteam-wiki
```

이 경로(`WIKI_PATH`)가 이미 checkout된 상태라면 바로 작업 가능.
비어 있다면:

```bash
git submodule update --init
```

### C-Step 2 — 브랜치 생성 및 변경

```bash
cd $WIKI_PATH
git checkout -b contrib/{프로젝트슬러그}-{변경설명}
```

파일을 수정한다 (아래 ID·파일명 규칙 준수).

```bash
git add -A
git commit -m "[{프로젝트슬러그}] 변경 요약"
git push origin contrib/{프로젝트슬러그}-{변경설명}
```

push 인증 오류 시 → 사용자에게 git 인증 설정 안내 (SSH 키 또는 git credential manager).

### C-Step 3 — 부모 프로젝트 서브모듈 ref 갱신

```bash
cd <소스프로젝트-루트>
git add {WIKI_PATH}
git commit -m "chore: update {프로젝트슬러그} wiki ref"
```

### C-Step 4 — 결과 안내

```
✅ 변경사항이 push되었습니다.

브랜치: contrib/{프로젝트슬러그}-{설명}

PR/MR 생성:
  GitHub: https://github.com/{repo}/compare/contrib/{브랜치명}?expand=1
  GitLab: {url}/{project}/-/merge_requests/new?merge_request[source_branch]=contrib/{브랜치명}

[변경된 파일]
  - user-stories/us-NNN-xxx.md (추가)
  - epics/ep-NNN-xxx.md (갱신)
  - product-backlog.md (갱신)

Merge 후 서브모듈을 최신화하려면:
  git submodule update --remote {WIKI_PATH}
  git add {WIKI_PATH} && git commit -m "chore: update wiki ref"
```

---

## 문서 ID 규칙

| 대상 | 패턴 | 예시 |
|------|------|------|
| Epic | EP-NNN (3자리) | EP-001 |
| User Story | US-NNN (3자리) | US-001 |

- 001부터 시작, 3자리 zero-padding
- **기존 ID는 절대 변경하지 않는다** (추적 이력 보존)
- **삭제된 ID는 재사용하지 않는다**
- Story는 Epic 구분 없이 통합 번호 (다른 Epic으로 옮겨도 ID 유지)
- 새 Epic/Story는 마지막 번호 다음부터 부여

## 파일명 규칙

| 대상 | 패턴 | 예시 |
|------|------|------|
| Epic | `ep-NNN-[슬러그].md` | `ep-001-user-mgmt.md` |
| Story | `us-NNN-[슬러그].md` | `us-001-signup.md` |

슬러그: 소문자 영문 + 하이픈, 핵심 키워드만.

## 상호 링크 유지

문서 추가·수정·삭제 시 관련 링크를 반드시 갱신한다:

| 변경 유형 | 갱신 대상 |
|-----------|----------|
| Story 추가 | 새 Story 파일 + 소속 Epic 파일 + product-backlog.md |
| Story 삭제 | 소속 Epic 파일 + product-backlog.md |
| Epic 추가 | 새 Epic 파일 + 하위 Story 파일 + product-backlog.md |
| Story 이동 | 기존/새 Epic 파일 + product-backlog.md (Story ID 유지) |

## 상태 값

- 우선순위: `Must` / `Should` / `Could`
- 상태: `Todo` / `In Progress` / `Done`
