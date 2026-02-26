---
name: sveltekit-progressive-architecture
description: "SvelteKit 프로젝트 아키텍처·코드 규칙. Actions: 작성, 구현, 리뷰, 리팩터, 검토, 추가, 설계, 수정, write, implement, review, refactor, fix. Base Rules: 컴포넌트 재사용, $lib, 라우트 배치, 인라인 타입 금지, interface, type, script 섹션, 주석, 가독성, code style, TypeScript. Server Architecture: 서버 아키텍처, Active Record, Query Service, REST API, Drizzle, +server.ts, +page.server.ts, server/domain, server/infra, 뷰모델, view-model, form actions, ORM, schema, 레이어 분리, CUD, load. UI Components: shadcn-svelte, shadcn, button, dialog, modal, table, form, input, calendar, popover, badge, card, select, tabs, switch, textarea, $lib/components/ui, npx shadcn-svelte."
---

# SvelteKit Progressive Architecture

SvelteKit 프로젝트에 적용하는 아키텍처와 코드 작성 규칙.

## 언제 적용하나

- SvelteKit 코드를 작성하거나 리뷰할 때
- 서버 레이어 설계 또는 API 엔드포인트를 구현할 때
- UI 컴포넌트를 추가하거나 shadcn-svelte를 사용할 때
- 코드 스타일·타입 정의·파일 구조를 결정할 때

## 카테고리

| 카테고리 | 적용 상황 | 참조 파일 |
|----------|-----------|-----------|
| **Base Rules** | `.svelte` 파일 작성, 타입 정의, `$lib` 구조, 주석 | [base-rules.md](references/base-rules.md) |
| **Server Architecture** | `+server.ts`, `+page.server.ts`, domain/infra 레이어, Drizzle, REST API | [server-architecture.md](references/server-architecture.md) |
| **UI Components** | shadcn-svelte 컴포넌트 추가·사용, `$lib/components/ui` | [shadcn-svelte.md](references/shadcn-svelte.md) |

## 핵심 규칙 요약

### Base Rules

- **라우트 우선 배치**: 반복 패턴이 보여도 `$lib`로 바로 빼지 않는다
- **`$lib/components`는 신중하게**: 3개 이상 페이지에서 쓰이는 범용 UI만
- **인라인 타입 금지**: 반드시 `interface`나 `type`으로 분리 정의
- **스크립트 섹션 주석**: `<script>` 영역은 역할별로 섹션 주석

### Server Architecture

- **레이어 분리**: `server/domain/` (Active Record CUD) + `server/infra/` (Query Service 조회)
- **직접 ORM 조작 금지**: `+server.ts` → Domain Model, `+page.server.ts` → Query Service
- **R/CUD 분리**: load는 `+page.server.ts`, 쓰기는 `routes/api/` REST 엔드포인트
- **form actions 미사용**: REST API로 분리하여 백엔드 이식성 확보
- **서버 타입이 원천**: 조회 뷰모델은 `infra/view-models/`에 정의

### UI Components

- **설치 우선**: UI 요소 구현 전 설치된 컴포넌트 목록 확인
- **커스텀 금지**: shadcn 컴포넌트를 직접 수정하지 않는다. `class` prop으로 스타일만 오버라이드
- **임포트 경로**: `$lib/components/ui/<component>` 에서 named import

설치된 컴포넌트: `alert-dialog` `badge` `button` `calendar` `card` `checkbox` `dialog` `dropdown-menu` `input` `input-otp` `label` `popover` `select` `separator` `sonner` `switch` `table` `tabs` `textarea`

## 실행 방법

### Step 1: 작업 분류

요청 내용을 보고 해당하는 카테고리를 파악한다. 여러 카테고리에 걸치는 경우 모두 포함한다.

| 요청 예시 | 카테고리 |
|-----------|----------|
| `.svelte` 파일 작성, 타입 정의, `$lib` 구조 | Base Rules |
| `+server.ts`, `+page.server.ts`, DB 쿼리, REST API | Server Architecture |
| button, dialog, form 등 UI 추가 | UI Components |
| 전체 코드 리뷰 | 모두 |

### Step 2: 참조 파일 로드

카테고리 테이블에서 해당 참조 파일을 읽는다. 상세 규칙과 코드 예시가 포함되어 있다.

### Step 3: 규칙 적용

참조 파일의 규칙에 따라 코드를 작성하거나 리뷰한다. 규칙에 어긋나는 부분이 있으면 지적하고 수정 방향을 제안한다.
