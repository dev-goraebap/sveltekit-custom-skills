---
name: <project-name>-wiki
description: "<Project-name> 프로젝트의 도메인 지식베이스. 다음 상황에서 자동으로 활성화된다: <project-name> 관련 코드를 작성하거나 수정할 때, 도메인 용어·API·데이터 모델에 대해 질문할 때, 비즈니스 로직이나 규칙을 파악하고 싶을 때, 위키 내용이 틀렸거나 업데이트가 필요할 때. 도메인: <comma-separated domain list>. 최종 업데이트: <date>."
metadata:
  wiki-remote: <https://github.com/org/wiki-repo>
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
| [<domain1>](domains/<domain1>/README.md) | <설명> | [모델](domains/<domain1>/models.md) · [규칙](domains/<domain1>/rules.md) |

## 주요 API

<!-- apis/overview.md에서 핵심 항목 -->
| 서비스 | Base URL | 문서 |
|--------|----------|------|
| <Service> | `/api/v1/<resource>` | [apis/<service>.md](apis/<service>.md) |

---

## 이 위키 활용 방법

### 도메인 정보 조회

"<도메인> 알려줘", "<용어>가 뭐야", "<API> 어떻게 돼?" 등을 물어보면:
- 이 SKILL.md의 Quick Reference와 도메인 목록을 먼저 확인
- 상세 내용이 필요하면 해당 `domains/` 또는 `apis/` 파일을 읽어서 답변
- 위키에 없는 내용은 솔직히 "위키에 아직 이 내용이 없어요"라고 안내하고 추가를 제안

### 위키 내용 변경 제안

사용자가 "이 내용이 틀렸어", "새로 추가된 게 있어", "이 부분 업데이트해줘" 같은 말을 하면:

1. **변경 내용을 마크다운으로 제안**한다. 어떤 파일의 어느 부분을 어떻게 바꿔야 하는지 명확하게 보여준다.

   예시:
   ```
   변경 파일: domains/payment/rules.md
   
   추가 내용:
   ### 환불 정책
   - 결제 후 7일 이내 환불 가능
   - 디지털 상품은 다운로드 전에만 환불 가능
   ```

2. **적용 방법을 안내**한다:

   **방법 1 — 직접 편집 (간단한 변경):**
   ```bash
   git clone <wiki-remote>
   # 해당 파일 수정 후:
   git commit -m "docs: <변경 내용 한 줄 설명>"
   git push
   # 팀원들 재설치:
   npx skills add <org>/<wiki-repo>
   ```

   **방법 2 — wiki-creator 스킬 사용 (코드 변경이 있을 때):**
   wiki-creator 스킬이 설치되어 있다면 개발 레포에서 실행하면 자동으로 동기화된다.

### 위키 구조 보여줘

"위키에 뭐가 있어?", "위키 구조 알려줘" 같은 요청이 오면:
- 이 SKILL.md의 도메인 목록과 API 목록을 보여준다
- 필요하면 `domains/`, `apis/` 디렉토리 목록을 읽어서 전체 파일 구조를 안내한다

---

*이 위키는 wiki-creator 스킬로 생성/관리됩니다.*
*전체 문서: [<wiki-remote>](<wiki-remote>)*
