# Credentials 가이드

에이전트가 원격 위키 리포지토리에 MR/PR을 생성하려면 인증 정보가 필요하다.

---

## 파일 경로

| 환경 | 경로 |
|------|------|
| Linux / macOS | `~/.config/agent-wiki/credentials` |
| Windows (Git Bash / MSYS) | `~/.config/agent-wiki/credentials` |
| Windows (네이티브) | `%USERPROFILE%\.config\agent-wiki\credentials` |

---

## 파일 형식 (TOML)

```toml
[github.todo-app-wiki]
url      = https://github.com
repo     = myorg/todo-app-wiki
token    = ghp_xxxxxxxxxxxxxxxxxxxx
username = my-github-username

[gitlab.bteam-wiki]
url      = https://gitlab.example.com
project  = company/group/bteam-wiki
token    = glpat-xxxxxxxxxxxxxxxxxxxx
username = my-gitlab-username
```

### 섹션 헤더 규칙

`[플랫폼.스킬이름]` 형식:
- **플랫폼**: `github` | `gitlab` (소문자)
- **스킬이름**: 위키의 SKILL.md `name` 필드와 정확히 일치해야 한다

### 필드 설명

| 필드 | 설명 |
|------|------|
| `url` | 플랫폼 베이스 URL |
| `repo` / `project` | 리포지토리 경로 (GitHub: `owner/repo`, GitLab: `group/subgroup/project`) |
| `token` | Personal Access Token |
| `username` | 사용자명 |

GitHub은 `repo`, GitLab은 `project` 키를 사용한다.

---

## 토큰 발급 방법

### GitHub Personal Access Token

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. **Generate new token**
   - Repository access: 해당 위키 리포만 선택
   - Permissions: Contents (Read and write), Pull requests (Read and write)
3. 토큰 복사 → credentials 파일의 `token`에 붙여넣기

### GitLab Personal Access Token

1. GitLab → 프로필 → Edit profile → Access Tokens
2. **Add new token**
   - Scopes: `api` 체크
3. 토큰 복사 → credentials 파일의 `token`에 붙여넣기

---

## 보안 주의사항

- credentials 파일은 절대 Git에 커밋하지 않는다
- 토큰 권한은 필요한 리포지토리와 최소 권한만 부여한다
- 토큰 만료일을 설정하고 주기적으로 갱신한다
