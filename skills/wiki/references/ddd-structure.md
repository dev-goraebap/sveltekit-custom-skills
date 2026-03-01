# DDD 위키 디렉토리 구조

위키는 도메인 주도 설계(DDD) 원칙에 따라 구성한다.
코드 구조가 아닌 **비즈니스 도메인** 중심으로 정리한다.

## 기본 구조

```
wiki/
├── SKILL.md               ← 에이전트 스킬 배포용 (자동 생성/갱신)
├── README.md              ← 위키 소개, 팀 설치 방법
├── glossary.md            ← 전체 도메인 용어집
├── architecture.md        ← 시스템 전체 구조 (서비스 관계도, 레이어)
│
├── domains/               ← 핵심 도메인별 상세 문서
│   ├── <domain-name>/
│   │   ├── README.md      ← 도메인 개요, 바운디드 컨텍스트
│   │   ├── models.md      ← 엔티티, 값 객체, 집계
│   │   ├── rules.md       ← 비즈니스 규칙, 정책, 불변식
│   │   └── events.md      ← 도메인 이벤트 (선택)
│   └── ...
│
├── apis/                  ← API 명세
│   ├── overview.md        ← API 전체 목록, 인증 방식
│   └── <service-name>.md  ← 서비스별 엔드포인트 상세
│
└── adr/                   ← Architecture Decision Records
    ├── template.md        ← ADR 작성 템플릿
    └── 001-<title>.md     ← 각 결정 사항 (순번 포함)
```

## 핵심 파일 설명

### glossary.md

팀 공통 언어를 정의하는 가장 중요한 파일.
기술 용어보다 **비즈니스 용어**를 우선한다.

```markdown
# 도메인 용어집

## A

### 계정 (Account)
사용자가 서비스에 접근하기 위한 인증 단위.
이메일 1개 = 계정 1개. `User`와 다름: User는 서비스 내 활동 주체.

### 결제 (Payment)
...
```

### domains/<name>/models.md

```markdown
# <도메인명> 모델

## <EntityName>

**정의**: (한 줄 설명)
**바운디드 컨텍스트**: <어떤 컨텍스트에 속하는지>

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 식별자 |
| ... | ... | ... |

**비즈니스 규칙**:
- ...

<!-- extracted from: backend/src/<domain>/<entity>.entity.ts -->
```

### apis/<service>.md

```markdown
# <서비스명> API

**Base URL**: `/api/v1/<service>`
**인증**: Bearer Token

## Endpoints

### GET /<resource>
**설명**: ...
**권한**: ...
**응답**:
\`\`\`json
{ ... }
\`\`\`

<!-- extracted from: backend/src/<controller>.ts -->
```

### adr/001-<title>.md

```markdown
# ADR-001: <결정 제목>

**날짜**: YYYY-MM-DD
**상태**: 채택됨 | 제안됨 | 폐기됨

## 맥락
왜 이 결정이 필요했는가?

## 결정
무엇을 결정했는가?

## 결과
이 결정으로 어떤 일이 일어나는가?
```

## 도메인 이름 규칙

- 영문 소문자 + 하이픈: `user-auth`, `payment`, `product-catalog`
- 코드의 모듈명이 아닌 **비즈니스 개념** 기준
- 팀에서 자주 쓰는 한국어 이름 → 영문 변환 후 사용

## 문서 작성 원칙

1. **코드 구현보다 비즈니스 의미**: "어떻게 구현했는가"가 아니라 "무엇인가"
2. **출처 표기**: `<!-- extracted from: ... -->` 로 원본 코드 위치 명시
3. **TODO 표시**: 불명확한 내용은 `<!-- TODO: 팀에 확인 필요 -->` 남기기
4. **한국어 우선**: 팀이 한국어로 소통한다면 문서도 한국어로
