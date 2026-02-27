# 조회 — 썸네일 정보 포함하기

Query Service에서 서브쿼리로 blob 정보를 함께 가져온 뒤, 조회 결과를 뷰모델로 변환하는 패턴.

---

## 뷰모델 정의

```typescript
// view-models/post.ts
export interface PostView {
  id:    number;
  title: string;
  thumbnailUrl:           string | null;
  thumbnailDominantColor: string | null;
}
```

---

## 서브쿼리로 썸네일 함께 조회 (Drizzle ORM)

```typescript
// service/post-query.service.ts
import { db } from '../db';
import { posts } from '../db/post-schema';
import { attachments, blobs } from '../db/media-schema';
import { and, eq, sql } from 'drizzle-orm';
import { toPublicUrl } from '../infra/r2';
import type { PostView } from '../view-models/post';

export class PostQueryService {
  static async listPage(): Promise<PostView[]> {
    const thumbnailSub = db
      .select({
        recordId:          attachments.recordId,
        thumbnailKey:      blobs.key,
        thumbnailMetadata: blobs.metadata,
      })
      .from(attachments)
      .leftJoin(blobs, eq(blobs.id, attachments.blobId))
      .where(
        and(
          eq(attachments.recordType, 'post'),
          eq(attachments.name, 'thumbnail'),
        ),
      )
      .as('thumbnail');

    const rows = await db
      .select({
        id:                posts.id,
        title:             posts.title,
        thumbnailKey:      thumbnailSub.thumbnailKey,
        thumbnailMetadata: thumbnailSub.thumbnailMetadata,
      })
      .from(posts)
      .leftJoin(thumbnailSub, eq(thumbnailSub.recordId, sql`${posts.id}::text`));

    // key → CDN URL, metadata → 색상 값으로 변환
    return rows.map((row) => {
      const meta = JSON.parse(row.thumbnailMetadata ?? '{}');
      return {
        id:    row.id,
        title: row.title,
        thumbnailUrl:           row.thumbnailKey ? toPublicUrl(row.thumbnailKey) : null,
        thumbnailDominantColor: meta.dominantColor ?? null,
      };
    });
  }
}
```

---

## 핵심 패턴 요약

- `attachments`를 서브쿼리로 조인해 blob 정보를 한 번의 쿼리로 가져온다.
- `record_type`과 `name`으로 특정 첨부만 필터링한다 (`'post'`, `'thumbnail'`).
- `blobs.key` → `toPublicUrl(key)`로 CDN URL로 변환한다.
- `blobs.metadata` JSON을 파싱해 `dominantColor` 등 부가 정보를 꺼낸다.
- `record_id`는 `varchar`이므로 숫자 PK와 조인 시 캐스팅(`::text`)이 필요하다.
