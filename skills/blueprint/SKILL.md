---
name: blueprint
description: 요구사항 분석(PRD), Lo-fi 설계, MVP 태스크 분해, 티케팅까지 지원하는 프로젝트 청사진 스킬. 초기부터 완벽한 구현보다 러프한 결과물을 빠르게 만들고 점진적으로 개선한다. 트리거: "PRD 만들어줘", "요구사항 분석", "태스크 만들어줘", "blueprint", "청사진", "MVP 정의", "티켓 등록"
metadata:
  author: dev-goraebap
  version: "1.0"
  inspired-by: https://github.com/snarktank/ai-dev-tasks (Apache-2.0)
---

# Blueprint

프로젝트의 요구사항 분석 → 설계 → 구현 → 개선을 `blueprint/` 폴더의 문서들로 관리하는 스킬.
처음부터 완벽한 구현보다 핵심 기능을 빠르게 검증하고, 점진적으로 쌓아가는 방식을 지향한다.

## 핵심 원칙

- **Lo-fi 우선**: 초기 MVP 단계에서는 UI/UX보다 기능 동작 검증에 집중한다
- **점진적 개선**: 핵심 기능을 최소 범위로 시작하고, 티케팅을 통해 개선해 나간다
- **추적 가능성**: 사용자 스토리(US), 기능 요구사항(FR) ID를 태스크까지 연결하여 추적한다
- **설계 확장성**: 스킬이 설계 방법을 강제하지 않는다. 사용자가 필요에 따라 설계 문서를 추가한다

## 출력 구조

모든 문서는 프로젝트 루트의 `blueprint/` 폴더에 생성된다.

```
blueprint/
├── prd-[프로젝트명].md       # PRD 문서
├── design/                   # 설계 문서 폴더
│   └── lo-fi-design-system.md  # 초기 Lo-fi 디자인 지침 (스킬이 생성)
├── work-items.md             # 작업 항목 목록 (PRD + design 참조)
└── issues.md                 # 이슈 추적 (버그·개선·변경·결정)
```

---

## 워크플로우

사용자의 요청에 따라 적절한 워크플로우를 실행한다.

### 1. 요구사항 분석 (PRD 생성)

사용자가 프로젝트나 기능에 대해 설명하면 PRD를 생성한다.

- [요구사항 분석 워크플로우](workflow/requirements-analysis.md) 참고

### 2. 설계 (Design)

이 스킬은 상세한 소프트웨어 설계 가이드를 제공하지 않는다. 대신:

- `blueprint/design/lo-fi-design-system.md`를 초기 생성하여 Lo-fi 디자인 지침을 제공한다
- 사용자는 PRD를 기준으로 별도의 프롬프트, 전문 스킬 등을 활용해 설계 문서를 `blueprint/design/` 폴더에 추가할 수 있다
- 추가된 설계 문서는 태스크 생성 시 PRD와 함께 참조된다

Lo-fi 디자인 지침은 [references/lo-fi-design-system.md](references/lo-fi-design-system.md)를 참고한다.

### 3. 구현 (Construction)

PRD와 설계 문서를 기반으로 작업 항목(Work Item)을 생성하고 MVP 범위를 확정한다.

- [구현 워크플로우](workflow/construction.md) 참고

### 4. 이슈 추적 (Issue Tracking)

구현 중 발생하는 버그, 개선 요청, 의사결정을 기록한다.

- [이슈 추적 워크플로우](workflow/issue-tracking.md) 참고
