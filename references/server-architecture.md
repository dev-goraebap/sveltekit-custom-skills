# Server Architecture

## 추천 기술 스택

| 영역 | 추천 | 이유 |
|------|------|------|
| ORM | Drizzle ORM | 경량, 타입 안전, SQL-like API로 직관적 |
| 인증 | better-auth | 세션 관리, OTP, 소셜 로그인 등 내장 |

> 프로젝트 상황에 따라 다른 도구를 선택할 수 있다. 아래 아키텍처 패턴은 ORM에 무관하게 적용된다.

## 왜 Active Record인가

SvelteKit은 DI 컨테이너를 제공하지 않는다. Active Record 패턴으로 도메인 로직을 모델에 캡슐화하면:

- 모델이 자체적으로 ORM을 import하므로 DI 없이도 응집도 높은 코드가 된다.
- `+server.ts`에서는 도메인 모델의 메서드만 호출한다. SQL/ORM 코드가 라우트 파일에 노출되지 않는다.
- 테이블 단위로 책임이 분리되어 변경 영향 범위가 명확하다.

## 서버 레이어 구조

```
$lib/server/
  db/                        ← ORM 설정 + 서브도메인별 스키마
    index.ts                 ← DB 연결 인스턴스
    {subdomain}-schema.ts    ← 서브도메인별 테이블 정의
  domain/                    ← Active Record 모델 (서브도메인별 폴더)
    {subdomain}/
      {model}.ts
  infra/
    service/                 ← Query Service (조회 전용 뷰모델)
      {name}-query.service.ts

$lib/entities/               ← 도메인 타입 + 순수 헬퍼 (서버/클라이언트 공유)
```

## 스키마 조직: 서브도메인 분류

- 함께 변경되는 테이블을 하나의 서브도메인으로 묶는다.
- 서브도메인 간 FK는 허용하되, 스키마 파일은 분리한다.
- 파일명은 `{서브도메인}-schema.ts` 형식을 따른다.

## Domain Model (Active Record)

- 자기 테이블 대상 **CUD + 단순 조회**만 담당한다.
- `create()`는 내부에서 파생값(sortOrder, createdAt 등)을 자동 계산한다. 호출측에 세부사항을 노출하지 않는다.
- 도메인 정책 로직도 여기에 위치한다 (예: 연차 일수 계산).
- 복잡한 조회(크로스 도메인 조인, 집계 등)는 Query Service로 위임한다.
- ORM을 직접 import한다. DI가 필요하지 않다.

```typescript
// $lib/server/domain/organization/department.ts
import { db } from '$lib/server/db';
import { departments } from '$lib/server/db/organization-schema';
import { eq, max } from 'drizzle-orm';

export class Department {
  static async create(data: { name: string }) {
    // sortOrder 자동 계산 — 호출측은 이를 알 필요 없다
    const [last] = await db
      .select({ maxSort: max(departments.sortOrder) })
      .from(departments);
    const sortOrder = (last?.maxSort ?? 0) + 1;

    const [created] = await db
      .insert(departments)
      .values({ name: data.name, sortOrder })
      .returning();
    return created;
  }

  static async update(id: string, data: { name: string }) {
    const [updated] = await db
      .update(departments)
      .set({ name: data.name })
      .where(eq(departments.id, id))
      .returning();
    return updated;
  }

  static async delete(id: string) {
    await db.delete(departments).where(eq(departments.id, id));
  }
}
```

## Query Service (조회 전용)

- **크로스 도메인 조인 허용** — 조회는 SQL 조인이므로 도메인 경계를 강제하지 않는다.
- 뷰모델 타입은 **같은 파일에 정의**한다. 프론트에서 `import type`으로 사용한다.
- 메서드명은 용도를 드러낸다: `listPage()`, `listOptions()`, `getDetail()` 등.

```typescript
// $lib/server/infra/service/member-query.service.ts
import { db } from '$lib/server/db';
import { members, departments, positions } from '$lib/server/db/organization-schema';

export interface MemberView {
  id: string;
  name: string;
  departmentName: string | null;
  positionName: string | null;
}

export interface MemberPage {
  items: MemberView[];
  total: number;
}

export class MemberQueryService {
  static async listPage(params: {
    page: number;
    size: number;
    search?: string;
  }): Promise<MemberPage> {
    // 크로스 도메인 조인 — 조회 전용이므로 허용
    const query = db
      .select({
        id: members.id,
        name: members.name,
        departmentName: departments.name,
        positionName: positions.name,
      })
      .from(members)
      .leftJoin(departments, eq(members.departmentId, departments.id))
      .leftJoin(positions, eq(members.positionId, positions.id));
    // ... 필터링, 페이징, 총 건수 계산
  }
}
```

### 타입 관리

- ORM 스키마에서 타입을 추출한다 (Drizzle: `InferSelectModel`, Prisma: generated types 등).
- `$lib/entities/`에서 `import type`으로 re-export한다.
- `import type`은 SvelteKit의 `$lib/server/` 보호 제한에 걸리지 않는다.

## 데이터 흐름 규칙

| 역할 | 위치 | 호출 대상 |
|------|------|-----------|
| 읽기 (R) | `+page.server.ts` load / `+layout.server.ts` load | Query Service |
| 쓰기 (CUD) | `routes/api/**/+server.ts` REST 엔드포인트 | Domain Model |

- **`routes/api/**/+server.ts`에서 직접 ORM 조작 금지** → 반드시 Domain Model을 통해.
- **`+page.server.ts` load에서 직접 ORM 조작 금지** → 반드시 Query Service를 통해.
- `+page.server.ts`에는 **load만** 둔다. **form actions는 사용하지 않는다.**
- **Layout load** → 경량 옵션 데이터 (셀렉트, 드롭다운 등 공유 참조 데이터)
- **Page load** → 페이지 전용 뷰모델 (목록, 상세, 페이징 등)

## REST 엔드포인트

- **검증 → 도메인 모델 호출 → JSON 응답** 패턴을 따른다.
- 각 `+server.ts`는 **독립적**이다. 다른 엔드포인트를 호출하지 않는다.
- 요청 검증 라이브러리는 자유롭게 선택한다 (Zod, Valibot, ArkType 등). 스키마는 `+server.ts` 파일 상단에 정의한다.

```typescript
// routes/api/admin/departments/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { Department } from '$lib/server/domain/organization/department';

const createSchema = z.object({ name: z.string().min(1) });

export const POST = async ({ request }) => {
  const data = await request.json();
  const result = createSchema.safeParse(data);
  if (!result.success) {
    return json({ error: '부서명을 입력해주세요.' }, { status: 400 });
  }

  const department = await Department.create(result.data);
  return json(department);
};
```

## 왜 form actions를 쓰지 않는가?

form actions는 SvelteKit에 강하게 결합된다. REST API로 분리하면:
- 추후 백엔드를 별도 서버(NestJS, Go, Spring 등)로 분리할 때 **API 엔드포인트를 그대로 마이그레이션**할 수 있다.
- Flutter, React Native 등 외부 클라이언트에서도 **동일 엔드포인트를 재사용**할 수 있다.
- 프론트엔드와 백엔드의 관심사가 명확히 분리된다.
