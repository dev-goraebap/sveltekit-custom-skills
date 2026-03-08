# User Story 가이드

User Story는 사용자 관점에서 기능 요구사항을 기술하는 단위다. "~로서, ~하고 싶다. 왜냐하면 ~이기 때문이다." 형식으로 작성한다.

---

## 출력 경로

```
wikicraft/user-stories/us-NNN-[슬러그].md
```

---

## ID 규칙

- 패턴: `US-NNN` (3자리 zero-padding)
- 시작: US-001
- **Epic 구분 없이 통합 번호** — Story를 다른 Epic으로 옮겨도 ID 유지
- 기존 ID 변경 금지
- 삭제된 ID 재사용 금지

---

## 파일명 규칙

- 패턴: `us-NNN-[슬러그].md`
- 슬러그: 소문자 영문 + 하이픈, 핵심 키워드만
- 예시: `us-001-signup.md`, `us-002-social-login.md`

---

## 템플릿

```markdown
# [US-NNN] Story명

## 기본 정보

| 항목 | 내용 |
|------|------|
| Story ID | US-NNN |
| Epic | [EP-NNN Epic명](../epics/ep-NNN-xxx.md) |
| 우선순위 | Must / Should / Could |
| 상태 | Todo / In Progress / Done |
| 라벨 | frontend, backend |

## User Story

(역할)로서, (행동)하고 싶다. 왜냐하면 (가치/이유)이기 때문이다.

## 인수 조건 (Acceptance Criteria)

- [ ] 조건 1
- [ ] 조건 2
- [ ] 조건 3

## 의존성

| 방향 | Story |
|------|-------|
| 선행 | — |
| 후행 | [US-NNN Story명](./us-NNN-xxx.md) |

## 메모 / 의사결정 기록

| 날짜 | 내용 | 결정 |
|------|------|------|
| | | |
```

---

## 상대 링크 규칙

Story 문서에서 다른 문서로의 링크:

| 대상 | 링크 패턴 |
|------|-----------|
| 소속 Epic | `../epics/ep-NNN-[슬러그].md` |
| 다른 Story | `./us-NNN-[슬러그].md` |
| Product Backlog | `../product-backlog.md` |

---

## 우선순위 (MoSCoW)

| 값 | 설명 |
|----|------|
| Must | 반드시 구현해야 하는 핵심 기능 |
| Should | 중요하지만 없어도 서비스 운영 가능 |
| Could | 있으면 좋지만 우선순위 낮음 |

---

## 상태

| 값 | 설명 |
|----|------|
| Todo | 아직 착수하지 않음 |
| In Progress | 작업 중 |
| Done | 완료 |

---

## 라벨

해당 Story가 영향을 미치는 기술 영역을 라벨로 표기한다. 쉼표로 구분.

| 라벨 | 설명 |
|------|------|
| frontend | 프론트엔드 (웹, 앱 UI) |
| backend | 백엔드 (API, 서버 로직) |
| mobile | 모바일 네이티브 |
| infra | 인프라, CI/CD, 배포 |
| design | 디자인, UX |
| data | 데이터, 분석, ML |

---

## 작성 규칙

1. User Story 본문은 반드시 "~로서, ~하고 싶다. 왜냐하면 ~이기 때문이다." 형식
2. 인수 조건은 체크리스트(`- [ ]`) 형태로 작성, 검증 가능한 구체적 조건
3. 의존성에서 선행이 없으면 `—`으로 표기
4. 메모 / 의사결정 기록은 빈 테이블로 생성 (사용자가 추후 기록)
