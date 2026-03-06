# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Plan: html-prototype 공통 컴포넌트 패턴 추가

## 배경

`html-prototype` 스킬은 순수 HTML/CSS/JS 프로토타입을 생성한다 (빌드 단계 없음, 컨셉 유지).
여러 화면을 만들면 공통 네비게이션/사이드바가 파일마다 미묘하게 달라지는 문제가 있어,
`components.js` 공유 파일 패턴을 `build.md`에 명시적으로 추가한다.

## 변경 내용

### `references/build.md`에 추가할 섹션

**공통 컴포넌트 패턴** — `preview/components.js` 파일 하나에 공통 UI 정의:

```js
// components.js
function renderNavbar(title, backHref) {
  return `<nav style="...">
    ${backHref ? `<a href="${backHref}">←</a>` : ''}
    <...

### Prompt 2

Tool loaded.

### Prompt 3

Tool loaded.

### Prompt 4

차라리 웹컴포넌트 방식으로 하는건 더 깔끔하지 않나?

### Prompt 5

응 잘 바꿔줘. 페이지 이제 만들려고 할 때 어차피 필요한 페이지들 잘 파악하고 있을거니까 공통 컴포넌트는 미리 그렇게 웹 컴포넌트로 만들어서 가져다 쓰게끔 하도록 하자.

### Prompt 6

Tool loaded.

### Prompt 7

[Request interrupted by user for tool use]

