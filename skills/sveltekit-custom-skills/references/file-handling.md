# File Handling

파일 업로드, 저장소 연동, 메타데이터 관리에 관한 패턴 모음.

---

## Active Storage 패턴

파일을 엔티티 테이블에 직접 붙이지 않고, `blobs`(파일 원본)와 `attachments`(관계 매핑) 두 테이블로 분리하는 방식. Rails의 Active Storage에서 유래했으나 어떤 스택에서도 동일하게 적용할 수 있다.

### 테이블 구조

**blobs** — 파일 자체 메타데이터

```sql
create table blobs (
  id           serial primary key,
  key          varchar(255) not null unique,   -- 저장소 경로 키 (UUID)
  filename     varchar(255) not null,           -- 원본 파일명
  content_type varchar(100) not null,           -- MIME 타입
  service_name varchar(50)  not null,           -- 저장소 식별자 ('r2', 's3' 등)
  byte_size    integer      not null,
  checksum     varchar(255) not null unique,    -- MD5 — 중복 파일 감지용
  metadata     text         not null default '{}', -- JSON (색상, 해상도 등 부가 정보)
  created_at   timestamp    not null default now()
);
```

**attachments** — 파일과 엔티티의 다형적 연결

```sql
create table attachments (
  id          serial primary key,
  name        varchar(100) not null,   -- 용도 ('thumbnail', 'avatar' 등)
  record_type varchar(100) not null,   -- 대상 엔티티 타입 ('post', 'series' 등)
  record_id   varchar(100) not null,   -- 대상 PK
  blob_id     integer      not null references blobs(id),
  created_at  timestamp    not null default now()
);
```

### Drizzle ORM으로 표현하기

```typescript
// $lib/server/db/media-schema.ts
import { pgTable, serial, varchar, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const blobs = pgTable('blobs', {
  id:          serial('id').primaryKey(),
  key:         varchar('key', { length: 255 }).notNull().unique(),
  filename:    varchar('filename', { length: 255 }).notNull(),
  contentType: varchar('content_type', { length: 100 }).notNull(),
  serviceName: varchar('service_name', { length: 50 }).notNull(),
  byteSize:    integer('byte_size').notNull(),
  checksum:    varchar('checksum', { length: 255 }).notNull().unique(),
  metadata:    text('metadata').notNull().default('{}'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
});

export const attachments = pgTable('attachments', {
  id:         serial('id').primaryKey(),
  name:       varchar('name', { length: 100 }).notNull(),
  recordType: varchar('record_type', { length: 100 }).notNull(),
  recordId:   varchar('record_id', { length: 100 }).notNull(),
  blobId:     integer('blob_id').notNull().references(() => blobs.id),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
});
```

### 이 구조가 유용한 경우

- 동일 파일을 여러 엔티티에 첨부해도 blob은 하나만 저장된다 (체크섬 중복 감지).
- `record_type` + `record_id` + `name` 조합으로 다형적 첨부를 표현한다. 별도 FK 없이 새로운 엔티티 타입을 추가할 수 있다.
- 파일 저장소(R2, S3 등)와 DB 레코드가 분리되어 있어 저장소를 교체해도 스키마 변경이 없다.

---

## 파일 저장소: Cloudflare R2

Cloudflare R2는 AWS S3 API를 호환하므로 `@aws-sdk/client-s3`를 그대로 사용할 수 있다.

### 환경 변수

```
R2_BUCKET_NAME=
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

### 클라이언트 초기화

```typescript
// $lib/server/infra/r2.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

const r2 = new S3Client({
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  region: 'auto', // Cloudflare R2 전용 값
});
```

### 파일 경로 분산

UUID key를 그대로 단일 디렉토리에 저장하면 파일이 몰릴 수 있다. 처음 4글자로 2-level 디렉토리를 만들어 분산하는 방법이 있다.

```typescript
// "abcd1234ef..." → "ab/cd/abcd1234ef..."
function toFilePath(key: string): string {
  return `${key.slice(0, 2)}/${key.slice(2, 4)}/${key}`;
}

function toPublicUrl(key: string): string {
  return `${env.R2_PUBLIC_URL}/${env.R2_BUCKET_NAME}/${toFilePath(key)}`;
}
```

### 업로드 / 삭제

```typescript
export async function uploadToR2(key: string, data: Buffer, contentType: string) {
  await r2.send(new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key:    toFilePath(key),
    Body:   data,
    ContentType: contentType,
  }));
}

export async function deleteFromR2(key: string) {
  await r2.send(new DeleteObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key:    toFilePath(key),
  }));
}
```

---

## 지배적 색상 추출

이미지 썸네일 카드에 어울리는 배경색이 필요할 때, AI API로 지배적 색상을 hex 코드로 추출하는 방법이 있다. 업로드 시점에 동기로 처리하거나, 별도 큐/잡으로 비동기 처리할 수 있다.

### Google Gemini API 활용

```typescript
async function extractDominantColor(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<string | null> {
  const base64 = imageBuffer.toString('base64');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType, data: base64 } },
            {
              text: `이 이미지를 대표하는 색상 1개를 hex 코드로만 응답해주세요.
조건:
- 흰색(#FFFFFF), 검은색(#000000), 회색 계열 제외
- 너무 밝은 색(명도 90% 이상)이나 너무 어두운 색(명도 20% 이하) 제외
- 채도가 있는 색상 우선
예시: #FF5733`,
            },
          ],
        }],
      }),
    },
  );

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
  const match = text.match(/#[0-9A-Fa-f]{6}/);
  return match ? match[0].toUpperCase() : null;
}
```

### metadata에 저장하기

색상 정보는 `blobs.metadata` JSON에 포함한다.

```typescript
const dominantColor = await extractDominantColor(buffer, file.type);

const metadata = JSON.stringify({
  type: 'image',
  ...(dominantColor && { dominantColor }), // "#FF5733"
});
```

조회 시:

```typescript
const meta = JSON.parse(blob.metadata ?? '{}');
const color = meta.dominantColor ?? null; // "#FF5733" | null
```

---

## 업로드 API 흐름 예시

```typescript
// routes/api/media/+server.ts
import { json } from '@sveltejs/kit';
import { createId } from '@paralleldrive/cuid2';
import crypto from 'crypto';
import { db } from '$lib/server/db';
import { blobs } from '$lib/server/db/media-schema';
import { eq } from 'drizzle-orm';
import { uploadToR2, toPublicUrl } from '$lib/server/infra/r2';

export const POST = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file || file.size === 0) {
    return json({ error: '파일이 없습니다.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = crypto.createHash('md5').update(buffer).digest('hex');

  // 동일 파일이 이미 있으면 재사용
  const [existing] = await db
    .select()
    .from(blobs)
    .where(eq(blobs.checksum, checksum))
    .limit(1);

  if (existing) {
    return json({ blobId: existing.id, url: toPublicUrl(existing.key) });
  }

  const key = createId();
  await uploadToR2(key, buffer, file.type);

  // 이미지인 경우 지배적 색상 추출
  let metadata = '{}';
  if (file.type.startsWith('image/')) {
    const dominantColor = await extractDominantColor(buffer, file.type);
    metadata = JSON.stringify({ type: 'image', ...(dominantColor && { dominantColor }) });
  }

  const [blob] = await db
    .insert(blobs)
    .values({
      key,
      filename:    file.name,
      contentType: file.type,
      serviceName: 'r2',
      byteSize:    file.size,
      checksum,
      metadata,
    })
    .returning();

  return json({ blobId: blob.id, url: toPublicUrl(key) });
};
```

---

## 썸네일 첨부 (Blob ↔ 엔티티 연결)

```typescript
import { db } from '$lib/server/db';
import { attachments } from '$lib/server/db/media-schema';
import { and, eq } from 'drizzle-orm';

async function attachThumbnail(recordType: string, recordId: string | number, blobId: number) {
  // 기존 첨부를 먼저 제거하고 새로 연결
  await db
    .delete(attachments)
    .where(
      and(
        eq(attachments.recordType, recordType),
        eq(attachments.recordId, String(recordId)),
        eq(attachments.name, 'thumbnail'),
      ),
    );

  await db.insert(attachments).values({
    name:       'thumbnail',
    recordType,
    recordId:   String(recordId),
    blobId,
  });
}
```

---

## 조회 시 썸네일 정보 포함하기

Query Service에서 서브쿼리로 blob 정보를 함께 가져온 뒤, 조회 결과를 변환하는 패턴.

```typescript
// $lib/server/infra/view-models/post.ts
export interface PostView {
  id:    number;
  title: string;
  thumbnailUrl:          string | null;
  thumbnailDominantColor: string | null;
}
```

```typescript
// $lib/server/infra/service/post-query.service.ts
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/post-schema';
import { attachments, blobs } from '$lib/server/db/media-schema';
import { and, eq, sql } from 'drizzle-orm';
import { toPublicUrl } from '$lib/server/infra/r2';
import type { PostView } from '$lib/server/infra/view-models/post';

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
