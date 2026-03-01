# 구현 — MVP 빌드 원칙

범위가 확정됐으면 스택을 먼저 확인하고 가장 단순한 방법으로 빠르게 만든다.

---

## 1. 스택 확인 (구현 전 필수)

### 기존 프로젝트가 있는 경우

현재 디렉토리에서 `package.json`을 확인한다.

```bash
cat package.json | grep -E '"next"|"svelte"|"vue"|"react"'
```

프레임워크가 감지되면 그것을 사용한다. 새 스택을 도입하지 않는다.

### 빈 디렉토리인 경우

사용자에게 묻는다:

> "어떤 방식으로 만들까요?
> (1) 단일 HTML 파일 — 빌드 없이 바로 브라우저에서 열고 공유 가능
> (2) 선호하는 프레임워크가 있으면 알려주세요 (Next.js, SvelteKit, Vue 등)"

선택 없이 임의로 스택을 결정하지 않는다.

---

## 2. 단일 HTML 방식

빌드 단계 없이 브라우저에서 바로 열 수 있다. 빠른 공유가 최우선일 때 적합하다.

### 필수 CDN

단일 HTML 방식에서는 항상 Tailwind CSS + Alpine.js를 사용한다. Vanilla JS로 DOM을 직접 조작하지 않는다.

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 화면이 여러 개면 파일을 분리한다

단일 파일에 모든 화면을 몰아넣지 않는다. 화면 수만큼 HTML 파일을 만들고 `<a href>`로 연결한다.

```
mvp/
├── index.html      # 랜딩 / 역할 선택
├── list.html       # 목록 화면
└── detail.html     # 상세 화면
```

화면 간 데이터 전달은 URL 쿼리스트링을 사용한다:

```html
<!-- list.html로 이동하며 role 전달 -->
<a href="list.html?role=pm">PM으로 시작</a>

<!-- detail.html에서 파라미터 읽기 -->
<div x-data="{ version: new URLSearchParams(location.search).get('version') }">
  <span x-text="version"></span>
</div>
```

### 기본 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MVP</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen">
  <div x-data="app()" class="max-w-2xl mx-auto p-6">
    <!-- UI -->
  </div>
  <script>
    function app() {
      return {
        // 목업 데이터와 상태
      }
    }
  </script>
</body>
</html>
```

---

## 3. 프레임워크 방식

사용자가 선택하거나 기존 프로젝트에 이미 있는 프레임워크를 따른다. 별도 설정 없이 기존 구조에 새 페이지/컴포넌트를 추가한다.

목업 데이터는 동일하게 하드코딩으로 처리한다. API 연결은 하지 않는다.

---

## 4. 공통 빌드 원칙

### 목업 데이터를 쓴다

```javascript
// 실제 API 대신 하드코딩
const items = [
  { id: 1, title: '요구사항 A', status: 'approved' },
  { id: 2, title: '요구사항 B', status: 'pending' },
]
```

### 해피 패스만 구현한다

- 로그인 → 이미 로그인된 상태로 시작
- 빈 데이터 → 항상 데이터가 있다고 가정
- 에러 처리 → 없음

### 범위를 지킨다

구현 중 추가 아이디어가 생기면 메모만 해두고 현재 범위에 집중한다.

---

## 5. 작업 완료 후 — git 커밋 + 태그

작업이 끝날 때마다 반드시 커밋하고 태그를 단다. 나중에 "이전 버전으로 돌아가 주세요"가 가능해진다.

### git 설치 확인

```bash
git --version
```

없으면 설치 후 진행한다:
- macOS: `brew install git`
- Ubuntu/Debian: `sudo apt install git`
- Windows: https://git-scm.com/download/win

### 커밋 + 태그

```bash
git add .
git commit -m "feat: MVP [한 줄 요약]"
git tag v1
```

이터레이션마다 태그를 올린다: `v1` → `v2` → `v3`

### 이전 버전으로 되돌리기

```bash
# 태그 목록 확인
git tag

# 특정 버전으로 되돌리기
git checkout v1
```

---

## 완료 기준

- [ ] git 커밋과 `vN` 태그가 달려 있다 ← **이게 없으면 나머지는 의미 없다**
- [ ] 핵심 사용자 흐름을 처음부터 끝까지 클릭해볼 수 있다
- [ ] 목업 데이터가 화면에 보인다
- [ ] 브라우저에서 오류 없이 열린다
