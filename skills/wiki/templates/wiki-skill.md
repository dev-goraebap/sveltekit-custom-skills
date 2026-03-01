---
name: <project-name>-wiki
description: "<Project-name> 프로젝트의 도메인 지식베이스. 다음 상황에서 자동으로 활성화된다: <project-name> 관련 코드를 작성하거나 수정할 때, 도메인 용어·API·데이터 모델에 대해 질문할 때, 비즈니스 로직이나 규칙을 파악하고 싶을 때. 도메인: <comma-separated domain list>. 최종 업데이트: <date>."
metadata:
  source-repos:
    - <frontend-repo-url>
    - <backend-repo-url>
    - <app-repo-url>
  version: "1.0"
  last-updated: <YYYY-MM-DD>
---

# <Project-name> 도메인 지식베이스

## 핵심 도메인 요약

<!-- 주요 도메인 2-3줄 요약 -->
- **<Domain1>**: <한 줄 설명>
- **<Domain2>**: <한 줄 설명>
- **<Domain3>**: <한 줄 설명>

## 주요 용어 (Quick Reference)

<!-- glossary.md에서 가장 중요한 5-10개 -->
| 용어 | 설명 |
|------|------|
| <Term> | <Definition> |

## 도메인 목록

| 도메인 | 설명 | 문서 |
|--------|------|------|
| [<domain1>](domains/<domain1>/README.md) | <설명> | - |

## 주요 API

<!-- apis/overview.md에서 핵심 항목 -->
| 서비스 | Base URL | 문서 |
|--------|----------|------|
| <Service> | `/api/v1/<resource>` | [apis/<service>.md](apis/<service>.md) |

---

*전체 도메인 문서는 각 파일을 참조하세요. 이 위키를 업데이트하려면 [README.md](README.md)의 기여 방법을 따르세요.*
