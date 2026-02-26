# SvelteKit Custom Skills

SvelteKit 프로젝트의 서버 아키텍처와 코드 작성 규칙. [Agent Skills (SKILL.md)](https://agentskills.io) 표준을 따르며, 모든 AI 코딩 에이전트에서 사용할 수 있다.

## 내용

| 레퍼런스 | 설명 |
|----------|------|
| `server-architecture` | 서버 레이어 아키텍처: Active Record, Query Service, REST API 패턴 |
| `base-rules` | 컴포넌트 재사용 정책, 코드 작성 가이드 |
| `file-handling` | 파일 업로드, Active Storage 패턴, Cloudflare R2 연동 |
| `shadcn-svelte` | shadcn-svelte UI 컴포넌트 사용 규칙 및 설치 가이드 |

## 설치

```bash
npx skills add dev-goraebap/sveltekit-custom-skills
```

## 구조

```
SKILL.md                            ← 스킬 진입점 (요약 + 레퍼런스 링크)
references/
  server-architecture.md            ← 서버 레이어 아키텍처 상세
  base-rules.md                     ← 재사용 정책 + 코드 작성 가이드
  file-handling.md                  ← 파일 업로드 / R2 / 색상 추출 패턴
  shadcn-svelte.md                  ← shadcn-svelte 컴포넌트 사용 가이드
```
