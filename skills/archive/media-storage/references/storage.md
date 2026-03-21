# 파일 저장소 — Cloudflare R2

Cloudflare R2는 AWS S3 API를 호환하므로 `@aws-sdk/client-s3`를 그대로 사용할 수 있다.

---

## 환경 변수

```
R2_BUCKET_NAME=
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

---

## 클라이언트 초기화

```typescript
// infra/r2.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  region: 'auto', // Cloudflare R2 전용 값
});
```

---

## 파일 경로 분산

UUID key를 그대로 단일 디렉토리에 저장하면 파일이 몰릴 수 있다. 처음 4글자로 2-level 디렉토리를 만들어 분산하는 방법이 있다.

```typescript
// "abcd1234ef..." → "ab/cd/abcd1234ef..."
function toFilePath(key: string): string {
  return `${key.slice(0, 2)}/${key.slice(2, 4)}/${key}`;
}

export function toPublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${toFilePath(key)}`;
}
```

---

## 업로드 / 삭제

```typescript
export async function uploadToR2(key: string, data: Buffer, contentType: string) {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key:    toFilePath(key),
    Body:   data,
    ContentType: contentType,
  }));
}

export async function deleteFromR2(key: string) {
  await r2.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key:    toFilePath(key),
  }));
}
```
