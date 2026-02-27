---
name: mvp-preview
description: "빠른 MVP·프로토타입 제작과 링크 공유. Actions: MVP 만들기, 프로토타입, 빠르게 구현, 데모 페이지, 기능 시연, prototype, demo, quick build, 아이디어 구체화, 클라이언트 공유, 팀 공유, 링크 공유, 기획 검토. Phases: 토론, 발견, 범위 확정, discovery, 핵심 가치, 핵심 기능, 스택 선택. Share: vercel, surge, cloudflared, tunnel, 배포, deploy, 공유 링크."
metadata:
  author: dev-goraebap
---

# MVP Preview

AI와 함께 핵심 기능을 빠르게 만들고 링크로 공유하는 워크플로우.

아이디어가 구체적이지 않아도 괜찮다. 토론하면서 범위를 좁히고, 최소한의 코드로 가치를 보여준 뒤, 링크 하나로 팀이나 클라이언트에게 전달한다.

## 언제 적용하나

- 아이디어나 기능을 빠르게 눈으로 확인하고 싶을 때
- 클라이언트·팀원에게 기획을 링크로 공유하고 싶을 때
- 완성도보다 방향성 검증이 목적일 때
- "이런 거 만들면 어떨까요?" 를 말 대신 코드로 보여주고 싶을 때

## 카테고리

| 카테고리 | 적용 상황 | 참조 파일 |
|----------|-----------|-----------|
| **제품 맥락** | 세션 간 맥락 유지, 요구사항·정책·도메인 정보 축적 | [brief.md](references/brief.md) |
| **토론** | 아이디어가 막연할 때, 범위를 좁히고 싶을 때, 무엇을 만들지 결정할 때 | [discovery.md](references/discovery.md) |
| **구현** | 스택 선택, MVP 빌드 원칙, 목업 데이터, 빠른 프로토타입 | [build.md](references/build.md) |
| **공유** | 로컬 서버 링크 공유, 빌드 배포, 브라우저 플레이그라운드 | [share.md](references/share.md) |

## 핵심 원칙

- **하나만**: 핵심 기능 하나를 완벽하게. 여러 기능을 어설프게 X
- **목업 데이터**: 실제 API 연결 불필요. 하드코딩된 데이터로 충분
- **해피 패스만**: 에러 처리·예외·엣지 케이스는 나중에
- **링크로 공유**: 노트북을 들고 가지 않아도 된다
- **매 작업 후 커밋**: 작업이 끝나면 바로 커밋 + `mvp-vN` 태그. 언제든 되돌릴 수 있어야 한다

## 실행 방법

### Step 0: 환경 확인

두 가지를 확인한다.

1. **git 설치 여부**: `git --version` 실행. 없으면 설치를 제안하고 진행한다
   - macOS: `brew install git` / Ubuntu: `sudo apt install git`
2. **brief.md 확인**: 내용이 있으면 이전 맥락을 이어간다. 없으면 Step 1부터 시작한다

### Step 1: 토론

막연한 아이디어도 괜찮다. `discovery.md`의 질문 흐름으로 범위를 확정한다.

> "어떤 제품을 만들고 있나요? 이 MVP로 무엇을 보여주고 싶으세요?"

범위가 확정되면 `brief.md`를 업데이트하고 구현으로 넘어간다.

### Step 2: 스택 확인 → 구현

구현에 들어가기 전 **반드시** 스택을 먼저 확인한다.

1. 현재 디렉토리에 `package.json`이 있으면 어떤 프레임워크인지 파악한다
2. 없으면 사용자에게 묻는다:
   > "어떤 방식으로 만들까요? (1) 단일 HTML 파일 — 빌드 없이 바로 공유 가능, (2) 사용 중인 프레임워크가 있으면 알려주세요"

스택이 확정되면 `build.md`의 방식에 따라 구현한다.

- **화면이 2개 이상이면** 단일 파일에 몰아넣지 않는다. HTML 파일을 화면별로 분리하고 `<a href>`로 연결한다
- **단일 HTML 방식이면** Tailwind CDN + Alpine.js를 사용한다. Vanilla JS로 DOM을 직접 조작하지 않는다

구현이 끝나면 **즉시 커밋 + 태그**를 단다:

```bash
git add .
git commit -m "feat: MVP [한 줄 요약]"
git tag mvp-v1   # 다음 이터레이션은 mvp-v2, mvp-v3 ...
```

### Step 3: 공유

`share.md`의 상황별 옵션을 골라 링크를 만든다.

| 상황 | 방법 |
|------|------|
| 지금 바로 링크 필요 (로컬 서버) | `cloudflared tunnel --url localhost:PORT` |
| 안정적인 URL 필요 (빌드 완료) | `surge ./dist my-name.surge.sh` |
| 프레임워크 프로젝트 자동 빌드 배포 | `npx vercel` |
| 단일 HTML 파일 | CodePen에 붙여넣기 |
