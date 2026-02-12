# SvelteKit Server Skill

SvelteKit 서버 레이어 아키텍처를 위한 Claude Code 플러그인.

Active Record 도메인 모델, Query Service 조회 패턴, REST API 엔드포인트 규칙, 서브도메인 기반 스키마 조직을 정의한다.

## 포함 플러그인

| 플러그인 | 설명 |
|----------|------|
| `sveltekit-conventions` | 서버 레이어 아키텍처: Active Record, Query Service, REST API 패턴 |

## 설치

```
/plugin marketplace add dev-goraebap/sveltekit-server-skill
/plugin install sveltekit-conventions@sveltekit-server-skill
```

## 팀 프로젝트에 적용

`.claude/settings.json`에 추가:

```json
{
  "extraKnownMarketplaces": {
    "sveltekit-server-skill": {
      "source": {
        "source": "github",
        "repo": "dev-goraebap/sveltekit-server-skill"
      }
    }
  },
  "enabledPlugins": {
    "sveltekit-conventions@sveltekit-server-skill": true
  }
}
```

## 핵심 규칙

- **레이어 분리**: `server/domain/` (Active Record) + `server/infra/service/` (Query Service). ORM에 무관하게 동일 패턴 적용.
- **직접 ORM 조작 금지**: `+server.ts`에서는 Domain Model, `+page.server.ts`에서는 Query Service를 통해서만 DB 접근.
- **R/CUD 분리**: load는 `+page.server.ts`, 쓰기는 `routes/api/` REST 엔드포인트. form actions 미사용.
- **서브도메인 스키마**: 테이블을 서브도메인별로 분류하여 스키마 파일 분리.
