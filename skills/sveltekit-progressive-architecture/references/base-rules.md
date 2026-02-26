# Base Rules

## 컴포넌트·기능의 재사용 가이드

### 원칙: 라우트 내부 우선, `$lib`는 신중하게

반복되는 UI나 함수가 보여도 **바로 `$lib/`로 추출하지 않는다**. 해당 라우트 안에서만 쓰인다면 라우트 디렉토리 내부에 파일을 만들어 해결한다.

`$lib/components/`에 올리는 기준:
- **3개 이상의 서로 다른 페이지**에서 사용되는 범용 UI일 때
- 프로젝트 전반에 걸쳐 일관된 UX를 제공해야 하는 공통 패턴일 때

### 라우트 내부 파일 조직 예시

```
routes/admin/approvals/
  +page.server.ts          ← load 함수
  +page.svelte             ← 메인 페이지
  status-tab.svelte        ← 이 페이지 전용 탭 컴포넌트
  chain-tab.svelte         ← 이 페이지 전용 탭 컴포넌트
  detail-dialog.svelte     ← 이 페이지 전용 다이얼로그
  approval-chain.svelte    ← 이 페이지 전용 서브 컴포넌트

routes/admin/leaves/
  +page.server.ts
  +page.svelte
  leave-tab.svelte         ← 연차 탭
  leave-type-tab.svelte    ← 휴가유형 탭
  granted-leave-tab.svelte ← 부여형 휴가 탭
  adjust-dialog.svelte     ← 조정 다이얼로그
  grant-dialog.svelte      ← 부여 다이얼로그
  history-dialog.svelte    ← 이력 다이얼로그
```

탭, 다이얼로그, 폼 등 페이지 전용 UI는 전부 해당 라우트 디렉토리에 둔다. 다른 페이지에서 import할 일이 생기면 그때 `$lib/`로 승격한다.

### `$lib/components/`에 적합한 예시

| 컴포넌트 | 이유 |
|----------|------|
| `empty-state.svelte` | 모든 목록 페이지에서 "데이터 없음" 상태를 표시 |
| `sortable-list.svelte` | 부서, 직책, 결재선 등 여러 관리 페이지에서 드래그 정렬 사용 |
| `ui/button`, `ui/dialog` 등 | 디자인 시스템 기본 요소 |

## 코드 작성 가이드

### 인라인 타입 금지 — 반드시 분리 정의

구조 분해 할당에 인라인으로 타입을 작성하지 않는다. **`interface`나 `type`을 별도로 정의**하여 사용한다. 이 규칙은 `$props()`, 함수 매개변수, 일반 변수 등 모든 구조 분해에 동일하게 적용된다.

**안티패턴:**

```typescript
// 구조 분해에 인라인 타입 — 금지
let { todo, onupdate, ondelete }: {
  todo: TodoView;
  onupdate: (updated: TodoView) => void;
  ondelete: (id: string) => void;
} = $props();

// 함수 매개변수에 인라인 타입 — 금지
function process({ id, name }: { id: string; name: string }) { ... }
```

**올바른 패턴:**

```typescript
// 별도 interface/type 정의 후 사용
interface Props {
  todo: TodoView;
  onupdate: (updated: TodoView) => void;
  ondelete: (id: string) => void;
}

let { todo, onupdate, ondelete }: Props = $props();

// 함수 매개변수도 동일
interface ProcessParams {
  id: string;
  name: string;
}

function process({ id, name }: ProcessParams) { ... }
```

프로퍼티가 적더라도 `interface`로 분리하는 것을 기본으로 한다. 타입의 의미가 명확히 드러나고, 이후 프로퍼티 추가 시에도 깔끔하다.

### 스크립트 섹션 주석

Svelte 파일의 `<script>` 영역이 길어지면 역할별로 섹션을 구분하는 주석을 단다.

```svelte
<script lang="ts">
  // --- 상수 ---
  const usageTypes = [ ... ];

  // --- 상태 ---
  let selectedPool = $state('annual');
  let loading = $state(false);

  // --- 파생 상태 ---
  const canSubmit = $derived(!validationMessage);

  // --- 유틸리티 ---
  /** ISO 날짜 문자열로 변환 */
  function toISODate(date: DateValue): string { ... }

  // --- 이벤트 핸들러 ---
  /** 휴가 신청 제출 */
  async function handleSubmit() { ... }
</script>
```

### 함수 주석

함수에는 **무엇을 하는지** 한 줄로 설명한다. 구현을 보면 알 수 있는 "어떻게"가 아니라 "왜/무엇을"에 초점을 맞춘다.

```typescript
/** 파일 목록에서 중복을 제거하고 새 파일을 추가한다 */
function handleFileSelect(e: Event) { ... }

/** 시작일~종료일 기반 사용 일수 계산 */
const days = $derived.by(() => { ... });

/** 반차/반반차 모드에서 API 전송용 leaveType 값으로 변환 */
function apiLeaveType(): string { ... }
```
