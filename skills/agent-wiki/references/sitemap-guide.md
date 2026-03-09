# Sitemap 가이드

Sitemap은 User Story의 UI/화면 정보를 집약하여 전체 화면 구조를 조감하는 문서다.

---

## 출력 경로

```
<워크스페이스>/sitemap.md
```

---

## 생성 시점

Step A-4에서 User Story 생성과 함께 자동 도출한다.
UI/화면 정보가 있는 Story가 하나 이상 존재할 때만 생성한다.

---

## 도출 규칙

1. 모든 User Story의 `UI/화면` 섹션을 스캔한다
2. 화면을 사용자 역할(페르소나)별로 그룹화한다. Product Brief의 대상 사용자 테이블을 기준으로 삼는다
3. MVP 포함 여부는 해당 화면을 요구하는 Story의 우선순위가 Must이면 `Y`, 그 외는 `N`
4. 관련 Story는 그 화면이 등장하는 US ID를 모두 열거한다 (복수 가능)
5. 화면 상태는 연결된 Story 중 가장 진행된 상태를 따른다

---

## 업데이트 시점

- Story가 추가·수정되고 UI/화면 정보가 변경될 때
- Story 상태가 변경될 때 (화면 상태 컬럼 동기화)
- Story가 cancelled될 때 해당 행의 상태를 `cancelled`로 갱신

---

## 템플릿

→ `templates/sitemap.md` 참고

---

## 상대 링크 규칙

| 대상 | 링크 패턴 |
|------|-----------|
| 관련 Story | `user-stories/us-NNN-[슬러그].md` |
| Product Backlog | `product-backlog.md` |
