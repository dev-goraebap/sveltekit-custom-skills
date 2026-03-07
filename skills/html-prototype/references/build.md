# HTML/CSS/JS 프리뷰 빌드 패턴

순수 HTML/CSS/JS만 사용한다. 프레임워크, 외부 CDN, 라이브러리 없음.

---

## 기본 원칙

- **인라인**: CSS는 `<style>`, JS는 `<script>`를 각 HTML 파일에 포함. 외부 파일 분리 안 함
- **목업 데이터**: API 연결 없이 JS 변수에 하드코딩
- **해피 패스만**: 에러 처리, 빈 상태, 예외 케이스 없음
- **Form 유효성 없음**: 입력 없이도 다음 화면으로 이동 가능

---

## 플랫폼별 기본 템플릿

### 모바일 웹 (기본)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>화면명</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f5f5f5; color: #111; min-height: 100vh; }
    .container { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
    /* 화면별 스타일 */
  </style>
</head>
<body>
  <div class="container">
    <!-- UI -->
  </div>
  <script>
    // 목업 데이터 및 화면 전환 로직
  </script>
</body>
</html>
```

### 웹 데스크톱

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>화면명</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f5f5f5; color: #111; min-height: 100vh; }
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #fff; border-right: 1px solid #eee;
               padding: 16px; flex-shrink: 0; }
    .main { flex: 1; max-width: 960px; padding: 32px; }
    /* 화면별 스타일 */
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <!-- 사이드바 네비게이션 -->
    </aside>
    <main class="main">
      <!-- UI -->
    </main>
  </div>
  <script>
    // 목업 데이터 및 화면 전환 로직
  </script>
</body>
</html>
```

### 반응형

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>화면명</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f5f5f5; color: #111; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
    @media (max-width: 768px) {
      .container { padding: 16px 12px; }
      .hide-mobile { display: none; }
    }
    @media (min-width: 769px) {
      .hide-desktop { display: none; }
    }
    /* 화면별 스타일 */
  </style>
</head>
<body>
  <div class="container">
    <!-- UI -->
  </div>
  <script>
    // 목업 데이터 및 화면 전환 로직
  </script>
</body>
</html>
```

---

## 화면 간 이동

```html
<!-- 링크로 이동 -->
<a href="02-list.html">목록 보기</a>

<!-- 버튼으로 이동 -->
<button onclick="location.href='03-detail.html'">상세 보기</button>

<!-- 파라미터 전달 -->
<button onclick="location.href='03-detail.html?id=1'">항목 1 상세</button>

<!-- 뒤로 가기 -->
<button onclick="history.back()">← 뒤로</button>

<!-- index로 돌아가기 -->
<button onclick="location.href='index.html'">홈으로</button>
```

**파라미터 읽기:**
```javascript
const params = new URLSearchParams(location.search);
const id = params.get('id'); // '1'
```

---

## Form 처리 (유효성 검사 없음)

입력 내용에 관계없이 버튼 클릭 시 즉시 다음 화면으로 이동한다.

```html
<form onsubmit="return false;">
  <div class="field">
    <label>이메일</label>
    <input type="email" placeholder="example@email.com">
  </div>
  <div class="field">
    <label>비밀번호</label>
    <input type="password" placeholder="비밀번호 입력">
  </div>
  <button type="button" onclick="location.href='02-dashboard.html'">
    로그인
  </button>
</form>
```

---

## 목업 데이터 패턴

```javascript
// 목록 데이터
const items = [
  { id: 1, title: '항목 A', status: '진행중', date: '2025-03-01' },
  { id: 2, title: '항목 B', status: '완료', date: '2025-03-02' },
  { id: 3, title: '항목 C', status: '대기', date: '2025-03-03' },
];

// 상세 데이터
const detail = {
  id: 1, title: '항목 A', description: '상세 설명 텍스트',
  author: '홍길동', createdAt: '2025-03-01'
};
```

---

## 목록 동적 렌더링

```html
<ul id="list"></ul>
<script>
  const items = [
    { id: 1, title: '항목 A' },
    { id: 2, title: '항목 B' },
  ];

  document.getElementById('list').innerHTML = items.map(item => `
    <li onclick="location.href='03-detail.html?id=${item.id}'"
        style="padding:12px; border-bottom:1px solid #eee; cursor:pointer;">
      ${item.title}
    </li>
  `).join('');
</script>
```

---

## index.html — 화면 목록 허브

모든 화면으로 가는 진입점. 첫 화면이 명확하면 그 화면을 보여주고, 명확하지 않으면 허브로 사용한다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>프리뷰</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 40px auto; padding: 0 16px; }
    h1 { font-size: 18px; margin-bottom: 24px; color: #333; }
    a { display: block; padding: 12px 16px; margin: 8px 0;
        background: #fff; border: 1px solid #ddd; border-radius: 8px;
        text-decoration: none; color: #111; }
    a:hover { background: #f0f0f0; }
    .badge { font-size: 11px; color: #888; margin-left: 8px; }
  </style>
</head>
<body>
  <h1>화면 목록</h1>
  <a href="01-login.html">로그인 <span class="badge">SC-01-01</span></a>
  <a href="02-dashboard.html">대시보드 <span class="badge">SC-02-01</span></a>
  <a href="03-list.html">목록 <span class="badge">SC-02-02</span></a>
  <a href="04-detail.html">상세 <span class="badge">SC-02-03</span></a>
</body>
</html>
```

---

## 파일 구조

### 단일 사이트

```
preview/
├── index.html          ← 허브 (화면 목록)
├── components.js       ← 공통 컴포넌트 (선택)
├── 01-login.html
├── 02-dashboard.html
├── 03-list.html
├── 04-detail.html
└── extracted/          ← PDF 입력 시만
    └── source.txt
```

### 멀티 사이트

```
preview/
├── index.html          ← 사이트 선택 허브
├── admin/
│   ├── index.html      ← 관리자 사이트 화면 허브
│   ├── components.js   ← 관리자용 공통 컴포넌트 (사이드바 등)
│   ├── 01-login.html
│   ├── 02-dashboard.html
│   └── 03-member-list.html
├── user/
│   ├── index.html      ← 사용자 사이트 화면 허브
│   ├── components.js   ← 사용자용 공통 컴포넌트 (하단탭 등)
│   ├── 01-onboarding.html
│   ├── 02-home.html
│   └── 03-mypage.html
└── extracted/          ← PDF 입력 시만
    └── source.txt
```

파일명: `[전체순번]-[영문화면명].html` (2자리 zero-padding)

---

## 공통 컴포넌트 패턴

네비게이션 바, 사이드바 등이 여러 화면에 반복되면 `preview/components.js` 한 파일에 Web Components로 모아 관리한다.
`<script src>` 방식이라 `file://` 프로토콜에서도 동작한다.

**`preview/components.js`:**

```js
class AppNavbar extends HTMLElement {
  connectedCallback() {
    const title    = this.getAttribute('title') || '';
    const backHref = this.getAttribute('back-href');
    this.innerHTML = `
      <nav style="background:#fff; border-bottom:1px solid #eee; padding:12px 16px;
                  display:flex; align-items:center; gap:12px;">
        ${backHref ? `<a href="${backHref}"
            style="background:none; border:none; font-size:18px;
                   cursor:pointer; text-decoration:none; color:#111;">←</a>` : ''}
        <span style="font-weight:600;">${title}</span>
      </nav>`;
  }
}
customElements.define('app-navbar', AppNavbar);

class AppSidebar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '';
    const menus = [
      { id: 'home',  label: '홈',  href: '02-dashboard.html' },
      { id: 'list',  label: '목록', href: '03-list.html' },
    ];
    this.innerHTML = `
      <aside style="width:200px; background:#fff; border-right:1px solid #eee;
                    padding:16px; min-height:100vh;">
        ${menus.map(m => `
          <a href="${m.href}" style="display:block; padding:10px 12px; border-radius:6px;
             text-decoration:none; margin-bottom:4px;
             ${m.id === active
               ? 'background:#111; color:#fff;'
               : 'color:#444;'}">
            ${m.label}
          </a>`).join('')}
      </aside>`;
  }
}
customElements.define('app-sidebar', AppSidebar);
```

**각 HTML에서 사용:**

```html
<script src="./components.js"></script>

<app-navbar title="목록" back-href="index.html"></app-navbar>

<!-- 사이드바 + 본문 레이아웃 -->
<div style="display:flex;">
  <app-sidebar active="list"></app-sidebar>
  <div style="flex:1; padding:24px;">
    <!-- 본문 내용 -->
  </div>
</div>
```

> **사용 기준**: 공통 UI가 3개 이상 화면에 반복될 때만 `components.js`를 만든다.
> 그 미만이면 각 파일에 인라인으로 두는 게 더 단순하다.

> **멀티 사이트**: 플랫폼/레이아웃이 사이트마다 다르므로 `components.js`는 사이트별로 분리한다.
> 사이드바 레이아웃(admin)과 하단탭 레이아웃(user)은 서로 다른 컴포넌트가 필요하다.

---

## 하단 탭 바 컴포넌트 (모바일 웹용)

```js
class AppBottomTab extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '';
    const tabs = [
      { id: 'home',   label: '홈',       href: '02-home.html' },
      { id: 'search', label: '검색',     href: '03-search.html' },
      { id: 'mypage', label: '마이페이지', href: '04-mypage.html' },
    ];
    this.innerHTML = `
      <nav style="position:fixed; bottom:0; left:0; right:0; background:#fff;
                  border-top:1px solid #eee; display:flex; max-width:480px; margin:0 auto;">
        ${tabs.map(t => `
          <a href="${t.href}" style="flex:1; text-align:center; padding:10px 0;
             text-decoration:none; font-size:12px;
             ${t.id === active ? 'color:#111; font-weight:600;' : 'color:#999;'}">
            ${t.label}
          </a>`).join('')}
      </nav>`;
  }
}
customElements.define('app-bottom-tab', AppBottomTab);
```

각 HTML에서: `<app-bottom-tab active="home"></app-bottom-tab>`

---

## 사이트 선택 허브 (멀티 사이트용 index.html)

멀티 사이트일 때 최상위 `preview/index.html`은 각 사이트로 진입하는 허브다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>프리뷰 — 사이트 선택</title>
  <style>
    body { font-family: sans-serif; max-width: 480px; margin: 60px auto; padding: 0 16px; }
    h1 { font-size: 20px; margin-bottom: 8px; color: #111; }
    p { font-size: 14px; color: #666; margin-bottom: 32px; }
    .site-card { display: block; padding: 20px; margin: 12px 0;
                 background: #fff; border: 1px solid #ddd; border-radius: 12px;
                 text-decoration: none; color: #111; }
    .site-card:hover { background: #f8f8f8; border-color: #bbb; }
    .site-name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .site-meta { font-size: 13px; color: #888; }
  </style>
</head>
<body>
  <h1>프로젝트명</h1>
  <p>사이트를 선택하세요</p>
  <a class="site-card" href="admin/index.html">
    <div class="site-name">관리자 사이트</div>
    <div class="site-meta">웹 데스크톱 · 사이드바 레이아웃</div>
  </a>
  <a class="site-card" href="user/index.html">
    <div class="site-name">사용자 사이트</div>
    <div class="site-meta">모바일 웹 · 하단탭 레이아웃</div>
  </a>
</body>
</html>
```

---

## 자주 쓰는 UI 컴포넌트 패턴

### 상단 네비게이션 바

```html
<nav style="background:#fff; border-bottom:1px solid #eee; padding:12px 16px;
            display:flex; align-items:center; gap:12px;">
  <button onclick="history.back()"
          style="background:none; border:none; font-size:18px; cursor:pointer;">←</button>
  <span style="font-weight:600;">화면 제목</span>
</nav>
```

### 카드

```html
<div style="background:#fff; border-radius:12px; padding:16px;
            box-shadow:0 1px 4px rgba(0,0,0,0.08); margin-bottom:12px;">
  <h3 style="font-size:15px; margin-bottom:6px;">카드 제목</h3>
  <p style="color:#666; font-size:13px;">카드 내용</p>
</div>
```

### 주요 버튼

```html
<button onclick="location.href='next.html'"
        style="width:100%; padding:14px; background:#111; color:#fff;
               border:none; border-radius:8px; font-size:15px; cursor:pointer;">
  다음으로
</button>
```

### 탭

```html
<div style="display:flex; border-bottom:1px solid #eee; margin-bottom:16px;">
  <button onclick="showTab('a')"
          style="flex:1; padding:10px; border:none; background:none;
                 border-bottom:2px solid #111; font-weight:600; cursor:pointer;">
    탭 A
  </button>
  <button onclick="showTab('b')"
          style="flex:1; padding:10px; border:none; background:none; cursor:pointer;">
    탭 B
  </button>
</div>
<script>
  function showTab(name) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById('tab-' + name).style.display = 'block';
  }
</script>
```
