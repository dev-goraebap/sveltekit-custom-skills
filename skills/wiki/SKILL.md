---
name: wiki
description: "프로젝트의 도메인 지식을 git 레포로 관리하고 팀 스킬로 배포하는 위키 워크플로우. 사용자가 '/wiki', '위키 만들어줘', '지식베이스 만들어줘', '도메인 정보 정리해줘', '위키 초기화', '도메인 문서화해줘', '위키 업데이트', '프로젝트 정보 추출해서 위키에 저장' 등을 언급하면 반드시 이 스킬을 사용한다. 개발 레포(프론트엔드/백엔드/앱)에서 도메인 정보를 추출하거나, 빈 폴더를 위키 레포로 초기화하거나, 팀이 공유하는 도메인 지식베이스를 스킬로 패키징할 때 항상 이 스킬을 사용한다."
allowed-tools: Bash Read Write Edit Glob Grep
metadata:
  author: dev-goraebap
---

# Wiki Skill

팀의 도메인 지식을 **git 레포로 관리**하고, 그 내용을 **에이전트 스킬로 패키징**해서 공유하는 워크플로우.

개발 레포(프론트엔드/백엔드/앱)에서 도메인 정보를 추출하고, DDD(도메인 주도 설계) 구조로 정리한 뒤, 팀원들이 `npx skills add`로 설치해서 언제든 최신 도메인 지식을 활용할 수 있게 한다.

## 카테고리

| 모드 | 상황 | 참조 파일 |
|------|------|-----------|
| **Init** | 빈 폴더 → 위키 레포 초기화 | [references/ddd-structure.md](references/ddd-structure.md) |
| **Extract** | 개발 레포 → 도메인 정보 추출 → 위키 작성 | [references/extraction.md](references/extraction.md) |
| **Update** | 코드 변경 후 위키 동기화 | [references/extraction.md](references/extraction.md) |
| **Query** | 임베드된 위키에서 도메인 정보 검색 | (위키 내용 직접 참조) |

## 전체 배포 플로우

```
개발 레포 (frontend/backend/app)
    ↓ /wiki extract
위키 레포 (DDD 구조 마크다운)
    ↓ git push → GitHub
원격 위키 레포
    ↓ npx skills add <org>/<wiki-repo>
각 팀원의 에이전트 스킬
    ↓ 코딩 시 자동 활성화
최신 도메인 지식 활용
```

---

## Step 0: 환경 및 컨텍스트 확인

가장 먼저 두 가지를 순서대로 체크한다.

### 0-1. 도구 권한 확인

git 명령어가 필요하다. Bash 도구가 허용되어 있지 않으면 파일 생성까지만 가능하고 git 초기화/커밋/푸시는 건너뛴다.

에이전트가 매번 허락을 묻는 게 번거롭다면 프로젝트 루트에 아래 설정을 만들 수 있다:

```bash
# Claude Code
echo '{ "defaultMode": "bypassPermissions" }' > .claude/settings.json
```

원하면 설정을 도와드릴 수 있다. 아니면 그냥 계속 진행해도 된다 — git 부분만 건너뛰고 파일은 모두 만든다.

### 0-2. 현재 상황 파악

아래 순서로 체크한다:

1. **코드가 있는 개발 레포인가?** → `package.json`, `pom.xml`, `pubspec.yaml`, `go.mod` 등 존재 여부
2. **위키 설정 파일이 있는가?** → `.wiki-config.json` 확인
3. **이미 위키 레포인가?** → `SKILL.md` + `domains/` 폴더 동시 존재 여부

| 감지 결과 | 기본 모드 |
|-----------|----------|
| 코드 없는 빈/새 폴더 | **Init** — 이 폴더를 위키로 만든다 |
| 개발 레포 + 위키 설정 없음 | **Extract** — 도메인 정보 추출 후 새 위키 생성 |
| 개발 레포 + 위키 설정 있음 | **Update** — 기존 위키에 변경사항 반영 |
| 위키 레포 자체 | **Query/Edit** — 위키 내용 조회 또는 직접 편집 |

모호하면 사용자에게 간단히 확인한다: "어떤 작업을 원하시나요? (초기화/추출/업데이트/조회)"

---

## Mode A: Init — 위키 레포 초기화

**언제**: 빈 폴더 또는 위키를 처음 만들 때

### 절차

1. **경로 확인**
   - 현재 폴더가 비어있으면: "이 폴더를 위키 레포로 만들까요?"
   - 아니면: 위키를 만들 경로를 묻는다 (기본값: `./wiki/`)

2. **git 초기화**
   ```bash
   git init
   git branch -M main
   ```

3. **DDD 디렉토리 구조 생성** (상세 구조는 `references/ddd-structure.md` 참조)
   ```
   wiki/
   ├── SKILL.md          ← 이 위키를 스킬로 배포하는 핵심 파일
   ├── README.md          ← 위키 소개 + 팀 설치 방법
   ├── glossary.md        ← 도메인 용어집
   ├── architecture.md    ← 전체 시스템 구조 개요
   ├── domains/           ← 도메인별 상세 문서
   │   └── .gitkeep
   ├── apis/              ← API 명세
   │   └── .gitkeep
   └── adr/               ← Architecture Decision Records
       └── .gitkeep
   ```

4. **초기 SKILL.md 생성** — [templates/wiki-skill.md](templates/wiki-skill.md) 템플릿 사용

5. **원격 레포 연결** (선택)
   - 원격 URL을 묻는다
   - 제공되면:
     ```bash
     git remote add origin <url>
     git add -A
     git commit -m "chore: initialize wiki repository"
     git push -u origin main
     ```

6. **README에 팀 설치 방법 추가** — 아래 섹션 참조

---

## Mode B: Extract — 도메인 정보 추출

**언제**: 개발 레포에서 처음으로 위키를 만들 때

### 절차

1. **프로젝트 타입 감지**

   | 신호 | 타입 |
   |------|------|
   | `package.json` + react/next/vue/svelte | Frontend |
   | `package.json` + express/nestjs/fastify | Backend (Node) |
   | `pom.xml` or `build.gradle` | Backend (Java) |
   | `pubspec.yaml` | App (Flutter) |
   | `android/` + `ios/` | App (React Native) |
   | 여러 `package.json` (workspace) | Monorepo |

2. **위키 경로 결정**
   - "위키 레포 경로나 GitHub URL을 알려주세요. (없으면 새로 만들게요)"
   - 로컬 경로면 Mode A로 먼저 초기화
   - URL이면 `git clone <url>` 후 진행

3. **도메인 정보 추출** — `references/extraction.md`의 프로젝트 타입별 방법 참조
   - 데이터 모델 / 엔티티
   - API 엔드포인트
   - 비즈니스 용어 및 규칙
   - 시스템 구조

4. **위키에 작성**
   - 새 파일이면: 해당 위치에 마크다운 파일 생성
   - 기존 파일이면: 수동 편집 내용 보존하며 업데이트 (덮어쓰지 않는다)
   - 항상 출처 표기: `<!-- extracted from: src/user/user.entity.ts -->`

5. **SKILL.md 자동 업데이트** — 주요 도메인 요약을 SKILL.md description에 반영

6. **커밋 & 푸시**
   ```bash
   git add -A
   git commit -m "docs: extract domain knowledge from <repo-name>"
   git push
   ```

7. **`.wiki-config.json` 생성** — 개발 레포 루트에 위키 참조 정보 저장
   ```json
   {
     "wikiRemote": "https://github.com/<org>/<wiki-repo>",
     "lastSync": "<ISO date>"
   }
   ```

---

## Mode C: Update — 위키 동기화

**언제**: 코드가 변경되어 위키를 최신화할 때

Mode B와 동일하되:
- 기존 위키 내용과 현재 코드 비교 → **변경된 부분만** 업데이트
- 변경된 파일 상단에 `<!-- Last updated: <date> -->` 추가
- 커밋 메시지: `docs: sync wiki with <repo-name> changes (<date>)`

---

## Mode D: Query — 도메인 정보 조회

**언제**: 위키 스킬이 이미 임베드되어 있고 도메인 정보를 찾을 때

위키 내용이 스킬 컨텍스트에 있다. 사용자가 도메인 개념을 물으면:
1. 관련 섹션을 찾아서 답변
2. 없으면: "위키에 아직 이 내용이 없어요. 추출해서 추가할까요?"

---

## 위키 SKILL.md 생성 (배포용)

위키를 초기화하거나 업데이트할 때마다 위키 루트의 `SKILL.md`를 항상 갱신한다.
이 파일이 위키를 `npx skills add`로 배포 가능하게 만드는 핵심이다.

[templates/wiki-skill.md](templates/wiki-skill.md) 템플릿 참조.

---

## README 팀 설치 안내 (항상 포함)

위키 `README.md`에 아래 섹션을 항상 포함한다:

```markdown
## 팀원 설치 방법

이 위키는 에이전트 스킬로 배포됩니다. 아래 명령어로 설치하세요:

\`\`\`bash
npx skills add <org>/<wiki-repo-name>
\`\`\`

설치 후 Claude Code, Cursor 등에서 이 프로젝트 작업 시 도메인 지식이 자동으로 활성화됩니다.

## 위키 업데이트 기여 방법

1. 이 레포 클론: `git clone <url>`
2. 내용 수정 (마크다운 편집)
3. 커밋 & 푸시
4. 팀원들이 스킬 재설치: `npx skills add <org>/<wiki-repo-name>`
\`\`\`

---

## 운영 팁

- **작은 것부터 시작**: 핵심 도메인 2-3개부터. 완벽한 위키보다 있는 위키가 낫다
- **용어집 우선**: `glossary.md`가 가장 가치 있다. 팀 공통 언어를 먼저 정의
- **코드 PR = 위키 업데이트**: PR 병합 시 위키 동기화를 팀 컨벤션으로
- **ADR 활용**: 중요한 기술 결정은 `adr/`에 기록해두면 나중에 "왜 이렇게 했지?" 를 해결
