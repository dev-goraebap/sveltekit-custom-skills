# dev-goraebap/skills

## 스킬 목록

| 스킬 | 설명 |
|------|------|
| [sveltekit-progressive-architecture](./skills/sveltekit-progressive-architecture/) | SvelteKit 개발 가이드라인 |
| [media-storage](./skills/media-storage/) | 파일 업로드·저장소·첨부 관리 패턴 (R2, blob, 색상 추출) |

## 설치하기

[skills.sh](https://skills.sh)에서 스킬을 검색하고, 아래 명령으로 설치할 수 있습니다:

```bash
npx skillsadd dev-goraeba/agent-skills
```

## Agent Skills

> **Agent Skills**란 AI 에이전트에게 절차적 지식을 제공하는 재사용 가능한 역량 모음입니다. Claude Code, Cursor, GitHub Copilot, Gemini, Windsurf, Cline 등 **24개 이상의 에이전트**에서 동일한 스킬을 사용할 수 있습니다. 자세한 내용은 [agentskills.io](http://agentskills.io)를 참고하세요.

## 스킬 만들기

### 구조

```
skill-name/
├── SKILL.md          # 필수: 메타데이터 + 지시사항
├── scripts/          # 선택: 실행 가능한 스크립트
├── references/       # 선택: 참조 문서
└── assets/           # 선택: 템플릿, 리소스
```

### SKILL.md 포맷

```markdown
---
name: my-skill-name
description: 이 스킬이 무엇을 하는지, 언제 사용하는지 명확하게 설명
---

# 스킬 이름

[에이전트가 따를 지시사항을 여기에 작성]
```

- `name` — 스킬 고유 식별자 (소문자, 하이픈 사용, 폴더명과 일치)
- `description` — 스킬 용도와 사용 시점을 구체적으로 기술 (에이전트가 태스크 매칭에 활용)

상세 레퍼런스나 템플릿은 `references/`, `assets/` 하위 폴더로 분리하고 `SKILL.md`는 500줄 이하로 유지하는 것을 권장합니다.
