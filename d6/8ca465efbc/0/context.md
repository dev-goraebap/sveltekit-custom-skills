# Session Context

## User Prompts

### Prompt 1

Base directory for this skill: /home/devgo/.claude/skills/skill-creator

# Skill Creator

A skill for creating new skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

- Decide what you want the skill to do and roughly how it should do it
- Write a draft of the skill
- Create a few test prompts and run claude-with-access-to-the-skill on them
- Help the user evaluate the results both qualitatively and quantitatively
  - While the runs happen...

### Prompt 2

일단 커밋 해줘

### Prompt 3

Unknown skill: wiki

### Prompt 4

"/wiki" 변경 제안하려면 어떻게 해?
Read SKILL.md
위키 파일은 .claude/skills/wiki/ 디렉토리에 마크다운 파일로 관리됩니다. 직접 편집하면 됩니다.

파일 구조

.claude/skills/wiki/
├── SKILL.md                        ← 위키 진입점 (도메인 목록 요약)
├── glossary.md                     ← 용어집
├── architecture.md                 ← 아키텍처
├── apis/overview.md                ← API 목록
└── domains/
    ├── organization/
    │   ├── models.md               ← 데이터 모델
    │   └── rules.md                ← 비즈니스 규칙
    ├── leave/
    ├── approval/
    ├── notice/
    └...

### Prompt 5

Base directory for this skill: /home/devgo/.claude/skills/skill-creator

# Skill Creator

A skill for creating new skills and iteratively improving them.

At a high level, the process of creating a skill goes like this:

- Decide what you want the skill to do and roughly how it should do it
- Write a draft of the skill
- Create a few test prompts and run claude-with-access-to-the-skill on them
- Help the user evaluate the results both qualitatively and quantitatively
  - While the runs happen...

