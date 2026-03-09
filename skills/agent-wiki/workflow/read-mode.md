# READ 모드 — 위키 내용 파악

현재 환경에서 위키 문서를 읽고 프로젝트 현황을 파악한다.

---

## READ-step1 — 환경 감지

| 조건 | 동작 |
|------|------|
| CWD에 `product-backlog.md` 있음 | 위키 워크스페이스 → CWD 루트에서 직접 읽기 |
| `.gitmodules`에 `*-wiki` 항목 있음 | 서브모듈 → 해당 경로 안의 문서 읽기 |
| 위 둘 다 해당 없음 | 중단 — 위키를 찾을 수 없다고 피드백 |

서브모듈 경로 확인:

```bash
git config --file .gitmodules --get-regexp path | grep wiki
```

---

## READ-step2 — 문서 읽기

아래 순서로 읽는다. 존재하지 않는 파일은 건너뛴다.

| 순서 | 파일 | 파악 목적 |
|------|------|-----------|
| 1 | `product-backlog.md` | 전체 Epic/Story 현황, ID 범위 |
| 2 | `product-brief.md` | 제품 컨텍스트 (제품명, 플랫폼, 대상 사용자) |
| 3 | `sitemap.md` | 화면 구성 및 MVP 범위 |
| 4 | `data-model.md` | 엔티티 구조 |
| 5 | 개별 `epics/ep-*.md` | 필요 시 Epic 상세 확인 |
| 6 | 개별 `user-stories/us-*.md` | 필요 시 Story 상세 확인 |

---

## READ-step3 — 요약 보고

읽은 내용을 바탕으로 아래 항목을 보고한다:

**프로젝트 개요**
- 제품명, 플랫폼, 대상 사용자 (product-brief.md 기준)

**Epic/Story 현황**
- Epic 수, Story 수
- 상태 분포 (pending / in-progress / blocked / review-needed / done / cancelled)
- 우선순위 분포 (Must / Should / Could)

**MVP 범위**
- sitemap.md 기준으로 MVP 포함 화면 목록
- sitemap.md가 없으면 Must 스토리 기준

**주목할 항목**
- 현재 `in-progress` 또는 `blocked` 상태인 Story
- `review-needed` 상태로 검토 대기 중인 Story
- `agent-note`에 인계 메시지가 있는 Story
