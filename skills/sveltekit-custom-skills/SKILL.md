---
name: sveltekit-custom-skills
description: "SvelteKit 프로젝트의 서버 아키텍처와 코드 작성 규칙. 서버 레이어(Active Record, Query Service, REST API), 컴포넌트 재사용 정책, 코드 가독성 가이드를 정의한다. SvelteKit 코드를 작성하거나 리뷰할 때 참고한다."
---

# SvelteKit Custom Skills

SvelteKit 프로젝트에 적용하는 아키텍처와 코드 작성 규칙을 정의한다.

## 기본 규칙 (Base Rules)

컴포넌트·함수 재사용 정책과 코드 작성 가이드.

핵심 규칙:
- **라우트 우선 배치**: 반복 패턴이 보여도 `$lib`로 바로 빼지 않는다. 해당 라우트 내부에서 먼저 해결한다
- **`$lib/components`는 신중하게**: 3개 이상 페이지에서 쓰이는 범용 UI만 배치한다
- **인라인 타입 금지**: 구조 분해 할당에 인라인 타입 금지. 반드시 `interface`나 `type`으로 분리 정의한다
- **스크립트 섹션 주석**: Svelte 파일의 `<script>` 영역은 역할별로 섹션 주석을 단다
- **함수 주석**: 함수에는 목적을 설명하는 간단한 주석을 단다

상세: [references/base-rules.md](references/base-rules.md)

## 서버 아키텍처 (Server Architecture)

Active Record 도메인 모델, Query Service 조회 패턴, REST API 엔드포인트 규칙, 서브도메인 기반 스키마 조직.

핵심 규칙:
- **레이어 분리**: `server/domain/` (Active Record CUD) + `server/infra/` (Query Service 조회)
- **직접 ORM 조작 금지**: `+server.ts` → Domain Model, `+page.server.ts` → Query Service
- **R/CUD 분리**: load는 `+page.server.ts`, 쓰기는 `routes/api/` REST 엔드포인트
- **form actions 미사용**: REST API로 분리하여 백엔드 이식성 확보
- **서버 타입이 원천**: CUD 타입은 Drizzle 스키마에서 추출, 조회 뷰모델은 `infra/view-models/`에 정의. `$lib/entities/` 같은 별도 공유 타입 레이어 금지

상세: [references/server-architecture.md](references/server-architecture.md)

## 파일 처리 (File Handling)

파일 업로드, 저장소 연동, 메타데이터 관리에 관한 패턴 모음. 특정 방식을 강제하지 않으며, 프로젝트 상황에 맞게 참고한다.

주요 내용:
- **Active Storage 패턴**: `blobs` + `attachments` 두 테이블로 파일 원본과 엔티티 관계를 분리. MD5 체크섬으로 중복 파일을 자동 감지한다
- **Cloudflare R2 연동**: AWS S3 SDK 호환. UUID key를 2-level 디렉토리로 분산 저장하는 방법 포함
- **지배적 색상 추출**: Gemini API로 이미지의 대표 색상(hex)을 추출해 `blobs.metadata` JSON에 저장하는 방법
- **조회 패턴**: 서브쿼리로 blob 정보를 함께 조회하고, CDN URL과 색상 값을 뷰모델에 포함하는 방법

상세: [references/file-handling.md](references/file-handling.md)

## UI 컴포넌트 (shadcn-svelte)

shadcn-svelte 기반 UI 컴포넌트 사용 규칙. 화면 구현 시 UI 요소가 필요하면 먼저 설치된 컴포넌트를 확인하고, 없으면 shadcn CLI로 설치한다.

설치된 컴포넌트 (`$lib/components/ui/`):
`alert-dialog` `badge` `button` `calendar` `card` `checkbox` `dialog` `dropdown-menu` `input` `input-otp` `label` `popover` `select` `separator` `sonner` `switch` `table` `tabs` `textarea`

핵심 규칙:
- **설치 우선**: UI 요소 구현 전 위 목록 확인 → 없으면 `npx shadcn-svelte@latest add <component>` 로 설치
- **커스텀 금지**: shadcn 컴포넌트를 직접 수정하지 않는다. `class` prop으로 스타일만 오버라이드
- **임포트 경로**: `$lib/components/ui/<component>` 에서 named import

상세: [references/shadcn-svelte.md](references/shadcn-svelte.md)