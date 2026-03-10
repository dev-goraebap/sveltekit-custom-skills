---
name: pdf-parser
description: >
  PDF 파일에서 텍스트를 추출하여 다른 스킬이 처리할 수 있는 형식(.txt)으로 변환한다.
  Node.js와 pdf-parse 라이브러리를 사용하며, 출력 파일을 지정된 경로에 저장한다.
  트리거: ".pdf 파일", "PDF 텍스트 추출", "PDF 파싱", "pdf-parser",
  "PDF를 읽어줘", "PDF 내용 추출"
metadata:
  author: dev-goraebap
  version: "1.0"
---

# pdf-parser

PDF 파일에서 텍스트를 추출하여 `.txt` 파일로 저장한다.
다른 스킬(agile-doc-creator, ia-doc-creator 등)이 PDF를 처리해야 할 때 이 스킬을 통해 텍스트를 먼저 추출한다.

## 사전 확인

Node.js가 설치되어 있는지 확인:

```bash
node --version
```

없으면 사용자에게 Node.js 설치를 안내하고 중단한다.

## 절차

### Step 1 — 의존성 설치

```bash
SCRIPT_DIR="$(dirname "$(realpath "$0")")"
cd "{스킬경로}/scripts" && npm install --silent
```

설치 확인:

```bash
node "{스킬경로}/scripts/extract_pdf_text.js" --check
```

`OK: Node.js and pdf-parse are ready.` 가 출력되면 정상.
오류 발생 시 사용자에게 에러 메시지와 함께 중단.

### Step 2 — 텍스트 추출

```bash
node "{스킬경로}/scripts/extract_pdf_text.js" \
  "{입력.pdf}" \
  -o "{출력경로}/{슬러그}.txt"
```

**출력 경로 결정 규칙:**
- 호출 측에서 출력 경로를 지정하면 그것을 사용
- 지정이 없으면 입력 PDF와 같은 디렉토리에 저장 (`{파일명}.txt`)

### Step 3 — 결과 반환

추출 성공 시:

```
✓ PDF 텍스트 추출 완료

  입력: {입력.pdf}  ({N} 페이지)
  출력: {출력경로}/{슬러그}.txt
```

추출 실패 시 (암호화된 PDF, 이미지만 있는 PDF 등):

```
⚠️  PDF 텍스트 추출 실패

  원인: {에러 메시지}

  대안:
  - 암호화된 PDF: 비밀번호 해제 후 재시도
  - 스캔본(이미지 PDF): OCR 도구가 필요합니다 (예: Adobe Acrobat, tesseract)
  - 텍스트 레이어가 없는 경우: PDF 원본 파일을 텍스트로 직접 제공해주세요
```

## 스크립트 위치

`scripts/extract_pdf_text.js` — Node.js 기반 PDF 텍스트 추출 스크립트
`scripts/package.json` — 의존성 정의 (pdf-parse)
