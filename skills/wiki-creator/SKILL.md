---
name: wiki-creator
description: "도메인 지식베이스(위키)를 git 레포로 만들고 팀 스킬로 배포하는 워크플로우. 사용자가 '/wiki-creator', '위키 만들어줘', '지식베이스 만들어줘', '도메인 정보 정리해줘', '위키 초기화', '도메인 문서화해줘', '위키 업데이트', '프로젝트 정보 추출해서 위키에 저장', '위키 동기화' 등을 언급하면 반드시 이 스킬을 사용한다. 개발 레포(프론트엔드/백엔드/앱)에서 도메인 정보를 추출하거나, 빈 폴더를 위키 레포로 초기화하거나, 팀이 공유하는 도메인 지식베이스를 스킬로 패키징할 때 항상 이 스킬을 사용한다. 참고: 이 스킬은 위키를 만드는 도구다. 이미 설치된 도메인 위키 스킬(예: pokitwork-wiki)과는 다르다."
allowed-tools: Bash Read Write Edit Glob Grep
metadata:
  author: dev-goraebap
---

# Wiki Creator

팀의 도메인 지식을 **git 레포로 만들고** 그 내용을 **에이전트 스킬로 패키징**하는 워크플로우 도구.

이 스킬이 하는 일 → 위키 레포 생성/관리. 그 결과물인 `<project>-wiki` 스킬이 하는 일 → 도메인 지식 조회/변경 제안.

## 두 가지 스킬의 역할 구분

| 스킬 | 역할 | 호출 시점 |
|------|------|-----------|
| **wiki-creator** (이 스킬) | 위키 레포 생성, 도메인 추출, 동기화 | 위키를 만들거나 업데이트할 때 |
| **`<project>-wiki`** (생성물) | 도메인 지식 조회, 변경 제안 | 해당 프로젝트에서 코딩할 때 |

## 전체 흐름

```
개발 레포 (frontend/backend/app)
    ↓  wiki-creator: Extract
위키 레포 (DDD 구조 마크다운 + SKILL.md)
    ↓  git push → GitHub
원격 위키 레포
    ↓  npx skills add <org>/<wiki-repo>
각 팀원의 에이전트에 설치
    ↓  코딩 시 자동 활성화
최신 도메인 지식 활용 + 변경 제안
```

## 모드 요약

| 모드 | 상황 | 참조 |
|------|------|------|
| **Init** | 빈 폴더 → 위키 레포 초기화 | [references/ddd-structure.md](references/ddd-structure.md) |
| **Extract** | 개발 레포 → 도메인 정보 추출 → 위키 작성 | [references/extraction.md](references/extraction.md) |
| **Update** | 코드 변경 후 위키 동기화 | [references/extraction.md](references/extraction.md) |

---

## Step 0: 환경 및 컨텍스트 확인

### 0-1. 도구 권한 확인

git 명령어(init, commit, push)를 쓴다. Bash 도구가 막혀 있으면 파일 생성까지만 하고 git 작업은 건너뛴다.

에이전트가 매번 허락을 묻는 게 번거롭다면 프로젝트 루트에 설정을 만들 수 있다:

```bash
# Claude Code
echo '{ "defaultMode": "bypassPermissions" }' > .claude/settings.json
```

원하면 설정을 도와드릴 수 있다.

### 0-2. 현재 상황 파악

| 감지 결과 | 기본 모드 |
|-----------|----------|
| 코드 없는 빈/새 폴더 | **Init** — 이 폴더를 위키 레포로 만든다 |
| 개발 레포 + `.wiki-config.json` 없음 | **Extract** — 도메인 정보 추출 후 새 위키 생성 |
| 개발 레포 + `.wiki-config.json` 있음 | **Update** — 기존 위키에 변경사항 반영 |

감지:
1. `package.json`, `pom.xml`, `pubspec.yaml`, `go.mod` 등 → 개발 레포
2. `.wiki-config.json` → 이미 위키와 연결된 레포
3. `SKILL.md` + `domains/` 동시 존재 → 이미 위키 레포 자체

모호하면 간단히 확인: "위키를 새로 만들까요, 아니면 기존 위키를 업데이트할까요?"

---

## Mode A: Init — 위키 레포 초기화

**언제**: 빈 폴더 또는 위키를 처음 만들 때

1. **경로 확인** — 현재 폴더인지, 별도 경로인지 확인 (기본값: `./wiki/`)

2. **git 초기화**
   ```bash
   git init && git branch -M main
   ```

3. **DDD 디렉토리 구조 생성** (상세 구조: [references/ddd-structure.md](references/ddd-structure.md))
   ```
   wiki/
   ├── SKILL.md          ← 도메인 위키를 스킬로 배포하는 핵심 파일
   ├── README.md          ← 위키 소개 + 팀 설치/기여 방법
   ├── glossary.md        ← 도메인 용어집
   ├── architecture.md    ← 전체 시스템 구조
   ├── domains/           ← 도메인별 상세 문서
   ├── apis/              ← API 명세
   └── adr/               ← Architecture Decision Records
   ```

4. **`SKILL.md` 생성** — [templates/wiki-skill.md](templates/wiki-skill.md) 템플릿 사용. 이 파일이 도메인 위키를 에이전트 스킬로 만드는 핵심이다.

5. **원격 레포 연결** (선택)
   ```bash
   git remote add origin <url>
   git add -A
   git commit -m "chore: initialize wiki repository"
   git push -u origin main
   ```

---

## Mode B: Extract — 도메인 정보 추출

**언제**: 개발 레포에서 처음으로 위키를 만들 때

1. **프로젝트 타입 감지** (상세 방법: [references/extraction.md](references/extraction.md))

   | 신호 | 타입 |
   |------|------|
   | `package.json` + react/next/vue/svelte | Frontend |
   | `package.json` + express/nestjs/fastify | Backend (Node) |
   | `pom.xml` or `build.gradle` | Backend (Java) |
   | `pubspec.yaml` | App (Flutter) |
   | `android/` + `ios/` | App (React Native) |

2. **위키 경로 결정**
   - "위키 레포 경로나 GitHub URL을 알려주세요. (없으면 새로 만들게요)"
   - 로컬 경로 → Mode A로 먼저 초기화
   - URL → `git clone <url>` 후 진행

3. **도메인 정보 추출 & 위키 작성** — `references/extraction.md` 참조
   - 수동 편집 내용 보존 (덮어쓰지 않는다)
   - 출처 표기: `<!-- extracted from: src/user/user.entity.ts -->`
   - 불명확한 부분: `<!-- TODO: 팀 확인 필요 -->`

4. **`SKILL.md` 갱신** — 도메인 목록과 요약 업데이트

5. **커밋 & 푸시**
   ```bash
   git add -A
   git commit -m "docs: extract domain knowledge from <repo-name>"
   git push
   ```

6. **개발 레포에 `.wiki-config.json` 생성**
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
- 커밋 메시지: `docs: sync wiki with <repo-name> changes`

---

## `SKILL.md` 생성 원칙 (배포용)

위키를 초기화하거나 업데이트할 때마다 위키 루트의 `SKILL.md`를 항상 갱신한다.
이 파일이 위키를 `npx skills add`로 배포 가능하게 하고, 팀원들이 도메인 지식을 자동으로 쓸 수 있게 한다.

[templates/wiki-skill.md](templates/wiki-skill.md) 템플릿 참조.

---

## 운영 팁

- **용어집 우선**: `glossary.md`가 가장 가치 있다. 팀 공통 언어를 먼저 정의
- **코드 PR = 위키 업데이트**: PR 병합 시 wiki-creator 동기화를 팀 컨벤션으로
- **ADR 활용**: 중요한 기술 결정은 `adr/`에 기록해두면 "왜 이렇게 했지?" 해결
