# shadcn-svelte 사용 가이드

## 개요

- **라이브러리**: [shadcn-svelte](https://shadcn-svelte.com) (bits-ui 기반 Svelte 5 컴포넌트)
- **위치**: `src/lib/components/ui/`
- **설정 파일**: `components.json` (프로젝트 루트)

## 설치된 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `alert-dialog` | 확인/취소 모달 |
| `badge` | 상태 태그, 라벨 |
| `button` | 버튼 (variant: default, destructive, outline, secondary, ghost, link) |
| `calendar` | 날짜 선택 캘린더 |
| `card` | 콘텐츠 카드 컨테이너 |
| `checkbox` | 체크박스 |
| `dialog` | 일반 모달 |
| `dropdown-menu` | 드롭다운 메뉴 |
| `input` | 텍스트 입력 |
| `input-otp` | OTP 입력 |
| `label` | 폼 라벨 |
| `popover` | 팝오버 |
| `select` | 셀렉트 박스 |
| `separator` | 구분선 |
| `sonner` | 토스트 알림 |
| `switch` | 토글 스위치 |
| `table` | 테이블 |
| `tabs` | 탭 |
| `textarea` | 텍스트에리어 |

## 새 컴포넌트 설치

필요한 컴포넌트가 목록에 없으면 설치한다.

```bash
npx shadcn-svelte@latest add <component-name>
```

예시:
```bash
npx shadcn-svelte@latest add accordion
npx shadcn-svelte@latest add sheet
npx shadcn-svelte@latest add toast
```

설치 후 `SKILL.md`의 설치된 컴포넌트 목록을 업데이트한다.

## 임포트 패턴

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
</script>
```

- 단일 컴포넌트: named import
- 복합 컴포넌트(Card, Dialog, Tabs 등): `* as` namespace import

## 사용 예시

### Button

```svelte
<Button variant="default">저장</Button>
<Button variant="outline" size="sm">취소</Button>
<Button variant="destructive">삭제</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

variant: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
size: `default` | `sm` | `lg` | `icon` | `icon-sm` | `icon-lg`

### Card

```svelte
<Card.Root>
  <Card.Header>
    <Card.Title>제목</Card.Title>
    <Card.Description>설명</Card.Description>
  </Card.Header>
  <Card.Content>본문</Card.Content>
  <Card.Footer>푸터</Card.Footer>
</Card.Root>
```

### Dialog

```svelte
<Dialog.Root bind:open={isOpen}>
  <Dialog.Trigger>
    <Button>열기</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>제목</Dialog.Title>
    </Dialog.Header>
    <!-- 본문 -->
  </Dialog.Content>
</Dialog.Root>
```

### Tabs

```svelte
<Tabs.Root value="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">탭 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">탭 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">내용 1</Tabs.Content>
  <Tabs.Content value="tab2">내용 2</Tabs.Content>
</Tabs.Root>
```

### Sonner (토스트)

```svelte
<!-- +layout.svelte에 Toaster 배치 -->
<script lang="ts">
  import { Toaster } from "svelte-sonner";
</script>
<Toaster />

<!-- 사용처에서 toast 호출 -->
<script lang="ts">
  import { toast } from "svelte-sonner";
</script>
<Button onclick={() => toast.success("저장됐습니다")}>저장</Button>
```

```svelte
<!-- O: class prop으로 오버라이드 -->
<Button class="w-full mt-4">전체 너비 버튼</Button>
<Input class="h-12 text-lg" placeholder="큰 입력창" />

<!-- X: 컴포넌트 파일 직접 수정 금지 -->
```
