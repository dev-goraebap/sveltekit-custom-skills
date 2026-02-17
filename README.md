# SvelteKit Custom Skills

SvelteKit 프로젝트의 서버 아키텍처와 코드 작성 규칙. [Agent Skills (SKILL.md)](https://agentskills.io) 표준을 따르며, 모든 AI 코딩 에이전트에서 사용할 수 있다.

## 내용

| 레퍼런스 | 설명 |
|----------|------|
| `server-architecture` | 서버 레이어 아키텍처: Active Record, Query Service, REST API 패턴 |
| `base-rules` | 컴포넌트 재사용 정책, 코드 작성 가이드 |

## 설치

```bash
npx skills add dev-goraebap/sveltekit-skills
```

## 구조

```
SKILL.md                            ← 스킬 진입점 (요약 + 레퍼런스 링크)
references/
  server-architecture.md            ← 서버 레이어 아키텍처 상세
  base-rules.md                     ← 재사용 정책 + 코드 작성 가이드
```
