# dev-goraebap/skills

> **Agent Skills**란 AI 에이전트에게 절차적 지식을 제공하는 재사용 가능한 역량 모음입니다. Claude Code, Cursor, GitHub Copilot, Gemini, Windsurf, Cline 등 **24개 이상의 에이전트**에서 동일한 스킬을 사용할 수 있습니다. 자세한 내용은 [agentskills.io](http://agentskills.io)를 참고하세요.

## 스킬 목록

| 스킬 | 설명 |
|------|------|
| [agent-wiki](./skills/agent-wiki/) | 여러 프로젝트의 AI 에이전트가 하나의 지식 저장소를 공유하도록 심볼릭 링크로 연결 |
| [agent-wiki-erd](./skills/agent-wiki-erd/) | PRD·도메인 설명·테이블 목록에서 Mermaid ERD(개념·논리·물리) 생성 → `.wiki/design/`에 저장 |
| [agent-wiki-sitemap](./skills/agent-wiki-sitemap/) | PRD·기획서에서 사이트맵(화면 구조도)을 Mermaid flowchart로 생성 → `.wiki/design/`에 저장 |
| [agent-wiki-tasks](./skills/agent-wiki-tasks/) | 작업 지시서 생성 + Git 브랜치 전략에 따른 작업 라이프사이클 관리 |
| [claude-hook-notify-setup](./skills/claude-hook-notify-setup/) | Claude Code hook에 OS 네이티브 토스트 알림 연결 세팅 — Windows/macOS/Linux 지원 |
| [pdf-parser](./skills/pdf-parser/) | PDF 파일에서 텍스트를 추출하여 .txt로 변환 |

## 레퍼런스 문서 (`ref/`)

스킬로 관리하기엔 애매한 문서들. 특정 프로젝트에서 아키텍처 방법론이나 개인 지침을 참고할 때 직접 제공하는 자료 모음.

| 폴더 | 문서 | 설명 |
|------|------|------|
| [sveltekit](./ref/sveltekit/) | base-rules.md | SvelteKit 컴포넌트·타입·파일 구조 규칙 |
| | server-architecture.md | 서버 레이어 분리, Active Record, Query Service 패턴 |
| | shadcn-svelte.md | shadcn-svelte 컴포넌트 선택·설치·활용 가이드 |
| [media-storage](./ref/media-storage/) | schema.md | Active Storage 패턴 DB 스키마 (blobs, attachments) |
| | storage.md | Cloudflare R2 연동, 파일 업로드·삭제 |
| | upload.md | 업로드 서비스, 중복 감지, 색상 추출 |
| | query.md | 썸네일 서브쿼리, 뷰모델 변환, CDN URL |

## 설치하기

[skills.sh](https://skills.sh)에서 스킬을 검색하고, 아래 명령으로 설치할 수 있습니다:

```bash
npx skills add dev-goraebap/skills
```

실행하면 단계별로 설치 옵션을 선택할 수 있습니다.

**1. 스킬 선택** — 설치할 스킬을 고릅니다 (스페이스로 토글)

```
◆  Select skills to install (space to toggle)
│  ◻ media-storage
│  ◻ mvp-preview
│  ◻ sveltekit-progressive-architecture
```

**2. 에이전트 선택** — 어떤 에이전트에 설치할지 선택합니다

```
◆  Which agents do you want to install to?
│  Amp, Codex, Gemini CLI, GitHub Copilot, Claude Code, ...
```

Claude Code, Cursor, Gemini CLI, GitHub Copilot 등 24개 이상의 에이전트를 지원합니다.

**3. 설치 범위** — 프로젝트 단위 또는 전역 설치를 선택합니다

```
◆  Installation scope
│  ● Project  (현재 프로젝트에만 설치, git에 포함)
│  ○ Global   (모든 프로젝트에서 사용)
```

**4. 설치 방식** — 심링크(권장) 또는 복사를 선택합니다

```
◆  Installation method
│  ● Symlink  (단일 소스, 업데이트 용이 — 권장)
│  ○ Copy     (각 에이전트 디렉토리에 복사)
```
