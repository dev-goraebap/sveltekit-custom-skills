# agent-wiki

위키(Wiki)는 누구나 읽고 편집할 수 있는 지식 저장소다. **agent-wiki**는 그 독자를 사람뿐 아니라 AI 에이전트로 넓힌다. 비정형 정보를 구조화된 애자일 문서로 변환하고, 소스코드 프로젝트에 git submodule로 연결하여 에이전트가 프로젝트 컨텍스트를 이해한 채로 작업할 수 있게 한다.

## 왜 만들었나

프로젝트를 진행하다 보면 기획 단계의 정보가 여기저기 흩어지기 쉽다. 회의록, 메모, RFP, 슬랙 메시지 등 다양한 곳에 요구사항이 나뉘어 있으면, 나중에 개발할 때 전체 그림을 다시 맞추는 데 시간이 든다.

CMMI의 추적성·ID 체계와 애자일의 가벼운 문서 단위(Epic / User Story / DoD)를 조합해, 기획 메모나 RFP 어떤 형태의 입력이든 받아서 Product Brief → Product Backlog → Epic → User Story → DoD로 정리한다. Product Brief는 플랫폼 유형, 대상 사용자, 기술 제약 같은 제품 컨텍스트를 캡처해서 에이전트가 "웹인지 앱인지" 같은 기본 맥락을 알고 작업할 수 있게 한다.

## 어떻게 동작하나

```
[기획서 / RFP / 메모]
        ↓
  agent-wiki 스킬
        ↓
[project]-wiki/          ← 독립 git 리포 (AGENTS.md + 애자일 문서)
        ↓
  git submodule add
        ↓
[source-project]/
└── [project]-wiki/      ← 서브모듈로 연결
```

위키 워크스페이스는 독립 git 리포로 만들어진다. 소스코드 프로젝트에 서브모듈로 연결하면, 에이전트가 작업 시작 전에 `[project]-wiki/AGENTS.md`를 읽어 제품 컨텍스트를 파악한다.

## 사용법

```
# 위키 워크스페이스 생성
/agent-wiki

# 기획서나 문서로 위키 내용 채우기
이 RFP 읽고 백로그 만들어줘
에픽 뽑아줘
유저스토리 정리해줘

# 소스코드 프로젝트에 서브모듈로 연결
/agent-wiki https://github.com/myorg/bteam-wiki 서브모듈 추가해줘

# 위키 내용 파악
/agent-wiki 내용 파악해줘

# 이슈 추가 / 문서 업데이트
스토리 추가해줘
버그 이슈 정리해줘
```

자세한 실행 절차는 [SKILL.md](SKILL.md)를 참고.

## 생성되는 위키 구조

```
[project]-wiki/
├── AGENTS.md               ← 에이전트 지시사항
├── README.md
├── CONTRIBUTING.md         ← 서브모듈 기반 업데이트 절차
├── .gitignore
├── product-brief.md        ← 제품 컨텍스트 (플랫폼, 사용자, 기술 제약)
├── product-backlog.md      ← 전체 인덱스 (진입점)
├── definition-of-done.md
├── epics/                  ← Epic별 상세
├── user-stories/           ← Story별 상세 (인수 조건 포함)
├── scripts/                ← PDF 추출 유틸
└── .sources/               ← 입력 원본 버전별 보관
```

## 기존 프로젝트에도 쓸 수 있다

백로그 없이 이슈(버그, 개선, 기술 부채)가 생기면 최소 위키를 자동 생성한 뒤 해당 이슈를 Story로 정리한다. 백로그는 이슈가 쌓이면서 자연스럽게 성장한다.

Story 타입: `feature` / `bug` / `enhancement` / `tech-debt` — 타입별 본문 형식이 다르다.

## 라이선스

MIT
