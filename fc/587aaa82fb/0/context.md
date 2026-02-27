# Session Context

## User Prompts

### Prompt 1

이 스킬을 보면 sveltekit, drizzle 등에 관련된 주석등이 보이는데 이 스킬은 범용적으로 어떤 프레임워크에서든지 사용하는 목적으로 분리한거야. 그 의도에 맞게 개선해줘

### Prompt 2

그리고 해당 md 파일의 내용은 분류가 가능해보이는데 references 폴더에 분리된 내용의 md 파일들로 위치하고 SKILL은 

/home/devgo/workspace/agent-skills/skills/sveltekit-progressive-architecture/SKILL.md

이 스킬을 참고하여 적용될 수 있게 해줘

### Prompt 3

커밋해줘

### Prompt 4

철학:
이 스킬은 AI가 주도하는 프로그래밍 세계에서 이제 고객이나 팀간의 소통 도구에 필요한 발빠른 방식을 위해 작성하는 스킬이야.

리서치:
일단 내 철학에 맞게 리서치를 좀 해서 스킬을 만들어야하는데

내가 원하는건 특정 기능을 빠르게 만들어보는걸 목표로 생각을 해. 먼저 AI에게 프로젝트의 개요와 빠르게 만들어보려는 핵심가치를 이야기하며 토론을 유도해야해. 이야기하면서 사용자는 구체적이지 않았던 부분을 구체화 할 수 있어서 좋고 AI는 사용자가 뭘 만들었는지 판단하며 좋은 방향을 제안해야함

사용하는 프레임워크를 강제하지는 않지만, 프론트엔드 측의 프레임워크를 가지고 주로 다루게 될거고 최종적으로 만든 페이지를 팀간에 공유하는 방법이 필요해. 직접 노트북을 들고가서 보여줄 수도 있지만, 링크를 던진다거나 하면 더 좋지 않을까?

### Prompt 5

내 모든 스킬들에 작성자 등록해줄래?

### Prompt 6

응 부탁해

### Prompt 7

README 도 업데이트해줘

### Prompt 8

devgo@goraebap-window:~/workspace/agent-skills$ npx skills add dev-goraebap/skills

███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝

┌   skills 
│
◇  Source: https://github.com/dev-goraebap/skills.git
│
◇  Repository cloned
│
◇  Found 3 skills
│
◆  Select skills to install (space ...

### Prompt 9

│  ── Other agents ──────────────────────────────────
│  Search:  
│  ↑↓ move, space select, enter confirm
│
│ ❯ ○ Antigravity (.agent/skills)
│   ○ Augment (.augment/skills)
│   ● Claude Code (.claude/skills)
│   ○ OpenClaw (skills)
│   ○ Cline (.cline/skills)
│   ○ CodeBuddy (.codebuddy/skills)
│   ○ Command Code (.commandcode/skills)
│   ○ Continue (.continue/skills)
│  ↓ 24 more

  Which agents do you want to install to?
│  Amp, Codex, Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, ...

### Prompt 10

/home/devgo/workspace/agent-skills/skills/mvp-preview/references

여기에 빈 IDEA.md 같은 폴더 (이름 너가 더 적절한거 있으면 그거 사용) 

미리 만들어놓고 skills.md 와 연결하자. 

사용자와 이야기해서 만들어진 기능들이나 도메인 등의 정보를 에이전트가 이해할 수 있게 저장해놔야하잖아. 세션이 초기화 될 때마다 금붕어 방지하기 위해서. 

기존에는 빈 md 파일로 연결해놓고 사용자와 대화 후에 거기에 이해한 내용을 계속 정리해나가는거야. 사용자가 정리한 내용을 물어보거나 기능을 개선하고 싶으면 거기에 적는거지.

중요한건 구체적인 기능등은 당연히 포함하면 안되고 요구사항과 정책 등의 정보를 적어야해

### Prompt 11

mvp-preview 스킬을 적용해 진행하겠습니다. 먼저 brief.md를 확인해 기존 맥락이 있는지 보고, 있으면 이어서 범위를 확정하고 없으면 바로 디스커버리 질문으로 MVP 범위를 좁히겠습니다.

1개의 목록 탐색 마침
백그라운드 터미널이 echo --- 명령으로 완료됨


1개의 파일 탐색 마침
백그라운드 터미널이 echo ---DISCOVERY--- 명령으로 완료됨


1개의 파일 탐색 마침
백그라운드 터미널이 echo ---BUILD--- 명령으로 완료됨


1개의 파일 탐색 마침
백그라운드 터미널이 echo ---SHARE--- 명령으로 완료됨


1개의 파일 탐색 마침
brief.md에 이전 맥락이 이미 정리돼 있어서 Step 0은 충족됐습니다. 이제 해당 맥락을 기준으로 이번 턴에서 바꿀 내용이 있는지 확인하고, 없으면 바로 최소 범위로 구현에 들어가겠습니다.

2개의 목록 탐색 마침
현재 저장소에는 구현 코드가 없어서, 스킬 원칙대로 단일 index.html ...

### Prompt 12

[Request interrupted by user]

### Prompt 13

skill.md 가 중요한거 아니야?

