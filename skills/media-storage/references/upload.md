# 업로드 — 서비스 로직·색상 추출·썸네일 첨부

---

## 업로드 핵심 로직

프레임워크와 무관한 비즈니스 로직 함수로 분리한다. HTTP 핸들러에서 `formData.get('file')`로 `File` 객체를 얻어 이 함수에 전달한다.

```typescript
// service/media-upload.ts
import { createId } from '@paralleldrive/cuid2';
import crypto from 'crypto';
import { db } from '../db';
import { blobs } from '../db/media-schema';
import { eq } from 'drizzle-orm';
import { uploadToR2, toPublicUrl } from '../infra/r2';

export async function uploadMedia(file: File) {
  if (!file || file.size === 0) {
    throw new Error('파일이 없습니다.');
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
    return { blobId: existing.id, url: toPublicUrl(existing.key) };
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

  return { blobId: blob.id, url: toPublicUrl(key) };
}
```

HTTP 핸들러에서 호출하는 방식은 프레임워크마다 다르다.

```typescript
// Express / Fastify 예시
app.post('/api/media', async (req, res) => {
  const file = req.file as File; // multer 등 미들웨어로 파싱
  const result = await uploadMedia(file);
  res.json(result);
});

// Next.js App Router 예시
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const result = await uploadMedia(file);
  return Response.json(result);
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

## 썸네일 첨부 (Blob ↔ 엔티티 연결)

```typescript
import { db } from '../db';
import { attachments } from '../db/media-schema';
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
