# DB 스키마 — Active Storage 패턴

파일을 엔티티 테이블에 직접 붙이지 않고, `blobs`(파일 원본)와 `attachments`(관계 매핑) 두 테이블로 분리하는 방식. Rails의 Active Storage에서 유래했으나 어떤 스택에서도 동일하게 적용할 수 있다.

---

## 테이블 구조

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

---

## Drizzle ORM으로 표현하기

```typescript
// db/media-schema.ts
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

---

## 이 구조가 유용한 경우

- 동일 파일을 여러 엔티티에 첨부해도 blob은 하나만 저장된다 (체크섬 중복 감지).
- `record_type` + `record_id` + `name` 조합으로 다형적 첨부를 표현한다. 별도 FK 없이 새로운 엔티티 타입을 추가할 수 있다.
- 파일 저장소(R2, S3 등)와 DB 레코드가 분리되어 있어 저장소를 교체해도 스키마 변경이 없다.
