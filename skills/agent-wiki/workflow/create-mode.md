# CREATE 모드 — 신규 위키 생성

새 프로젝트의 위키를 처음 만드는 전체 흐름이다.

---

## CREATE-step1 — 환경 확인 및 정보 수집

**환경 체크:**

| 상황 | 처리 |
|------|------|
| CWD에 `product-backlog.md` 등 위키 파일이 있음 | → 중단. UPDATE 모드(`workflow/update-mode.md`) 안내 |
| CWD가 소스코드 프로젝트 (`.gitmodules`, `src/`, `package.json` 등 존재) | → 중단. 위키 전용 폴더에서 실행하도록 피드백 |
| CWD가 비어 있거나 위키 관리에 적합함 | → 진행 |

**정보 수집:**

사용자로부터 만들고 싶은 제품/서비스 정보를 수집한다.
파일로 제공되면 CREATE-step2로 이동하여 처리.
구두로만 설명하면 그 내용을 `.sources/v1_verbal-input.txt`에 저장 후 계속.

**워크스페이스 초기화:**

`templates/` 폴더의 양식 파일을 워크스페이스에 복사한다:

```bash
mkdir -p {epics,user-stories,.sources,scripts}
touch {epics,user-stories,.sources}/.gitkeep
```

생성할 파일 목록과 초기 AGENTS.md/README/CONTRIBUTING/.gitignore는 `references/wiki-agents-guide.md` 참고.

---

## CREATE-step2 — 입력 처리 및 소스 보관

모든 입력 원본을 `.sources/v{N}_[슬러그].[확장자]`로 보관한다.
- `.sources/`가 비어 있으면 v1, 기존 파일이 있으면 마지막 +1

| 파일 형식 | 처리 방법 |
|-----------|-----------|
| `.pdf` | `scripts/extract_pdf_text.js`로 텍스트 추출 후 `.sources/`에 저장. 원본도 `.sources/`로 이동 |
| `.txt` / `.md` | Read 후 `.sources/`로 이동 |
| 구두 설명 | `.sources/v{N}_verbal-input.txt`에 저장 |
| 그 외 형식 | 사용자에게 `.txt` 또는 `.md`로 변환 요청 |

```bash
WIKI_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
cd "$WIKI_ROOT/scripts" && npm install --silent
node "$WIKI_ROOT/scripts/extract_pdf_text.js" \
  <입력.pdf> -o "$WIKI_ROOT/.sources/v{N}_<슬러그>.txt"
```

**워크스페이스 루트에는 산출물만 존재한다.** 워크스페이스 내 입력 파일은 반드시 `.sources/`로 이동.

---

## CREATE-step3 — 문서 생성 및 사용자 리뷰

`product-brief.md`의 컨텍스트를 반영하여 아래 순서로 문서를 생성한다.
각 문서의 상세 작성 규칙은 `references/` 가이드 참고.

| 순서 | 산출물 | 가이드 |
|------|--------|--------|
| 1 | `product-brief.md` | `references/product-brief-guide.md` |
| 2 | `epics/ep-NNN-[슬러그].md` | `references/epic-guide.md` |
| 3 | `user-stories/us-NNN-[슬러그].md` | `references/user-story-guide.md` |
| 4 | `product-backlog.md` | `references/product-backlog-guide.md` |
| 5 | `definition-of-done.md` | `references/dod-guide.md` |
| 6 | `sitemap.md` (UI 정보 있을 때만) | `references/sitemap-guide.md` |

**플랫폼 유형이 불명확하면 추측하지 않고 사용자에게 확인한다.**

`sitemap.md` 생성 후 사용자에게 리뷰 요청:

> MVP 범위와 화면 구성을 검토해주세요. 수정할 내용이 있으면 말씀해주세요.

피드백을 반영하고 확정한다.

---

## CREATE-step4 — Git 초기화 및 커밋

아직 git 리포가 아닌 경우 초기화:

```bash
git init
```

커밋:

```bash
git add -A
git commit -m "docs: 초기 위키 생성"
```

완료 후 사용자에게 remote origin URL 요청:

> 이 위키를 원격 리포지토리에서 관리할 예정인가요?
> URL이 있으면 알려주세요.

없으면 로컬 커밋만 완료 후 종료.

---

## CREATE-step5 — 원격 연결 및 푸쉬

```bash
git remote add origin <url>
git push -u origin main
```

완료 보고:

```
✓ 위키 생성 및 배포 완료

  경로: {TARGET}
  원격: {url}
  커밋: 초기 위키 생성

다음 단계 — 소스코드 프로젝트에 연결하려면:
  cd <소스프로젝트>
  /agent-wiki <remote-url> 서브모듈 연결해줘
```
