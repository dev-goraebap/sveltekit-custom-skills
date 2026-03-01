# 도메인 정보 추출 가이드

프로젝트 타입별로 어디서 무엇을 추출할지 정리한다.
추출 목표: 코드의 **비즈니스 의미**를 파악하는 것. 구현 세부사항은 불필요.

---

## Frontend (React / Next.js / Vue / SvelteKit)

### 추출 대상

| 찾을 것 | 찾는 위치 | 추출 정보 |
|---------|-----------|-----------|
| 도메인 타입/인터페이스 | `src/types/`, `src/models/`, `src/interfaces/` | 엔티티 구조, 필드 의미 |
| API 호출 패턴 | `src/api/`, `src/services/`, `src/hooks/use*.ts` | 엔드포인트 목록, 요청/응답 형태 |
| 상태 구조 | `src/store/`, `src/context/`, Zustand/Pinia store | 앱 상태 모델 |
| 라우트 | `src/app/`, `src/pages/`, `src/router/` | 화면 구조, 페이지 역할 |
| 비즈니스 로직 | `src/utils/`, `src/lib/`, custom hooks | 도메인 규칙, 계산 로직 |

### 추출 명령어 예시

```bash
# TypeScript 타입 정의 찾기
grep -r "^export (interface|type|enum)" src/ --include="*.ts" -l

# API 엔드포인트 패턴 찾기
grep -r "fetch\|axios\|useSWR\|useQuery" src/ --include="*.ts" -l

# 라우트 구조 확인 (Next.js App Router)
find src/app -name "page.tsx" | sort
```

---

## Backend (Node.js / NestJS / Express)

### 추출 대상

| 찾을 것 | 찾는 위치 | 추출 정보 |
|---------|-----------|-----------|
| 엔티티/모델 | `*.entity.ts`, `*.model.ts`, `schema.prisma` | 도메인 모델 구조 |
| 컨트롤러 | `*.controller.ts`, `routes/*.ts` | API 엔드포인트 목록 |
| 서비스 비즈니스 로직 | `*.service.ts` | 핵심 비즈니스 규칙 |
| DTO | `*.dto.ts` | 요청/응답 데이터 형태 |
| 이벤트 | `*.event.ts`, `*.event-handler.ts` | 도메인 이벤트 |

### 추출 명령어 예시

```bash
# NestJS 엔티티 찾기
find src -name "*.entity.ts" | sort

# Prisma 스키마 읽기
cat prisma/schema.prisma

# 컨트롤러 엔드포인트 추출
grep -r "@(Get|Post|Put|Patch|Delete)" src/ --include="*.ts" -B2
```

---

## Backend (Java / Spring Boot)

### 추출 대상

| 찾을 것 | 찾는 위치 | 추출 정보 |
|---------|-----------|-----------|
| 도메인 엔티티 | `domain/`, `entity/`, `@Entity` 클래스 | 도메인 모델 |
| REST 컨트롤러 | `@RestController`, `@Controller` | API 엔드포인트 |
| 서비스 | `@Service` | 비즈니스 로직 |
| 레포지토리 | `@Repository`, `JpaRepository` | 데이터 접근 패턴 |

### 추출 명령어 예시

```bash
# Entity 클래스 찾기
find src -name "*.java" | xargs grep -l "@Entity" | sort

# Controller 엔드포인트 찾기
grep -r "@(GetMapping|PostMapping|PutMapping|DeleteMapping)" src/ --include="*.java" -B3
```

---

## App (Flutter / React Native)

### 추출 대상

| 찾을 것 | 찾는 위치 | 추출 정보 |
|---------|-----------|-----------|
| 데이터 모델 | `lib/models/` (Flutter), `src/types/` (RN) | 앱 도메인 모델 |
| 화면 구조 | `lib/screens/`, `lib/pages/` (Flutter), `src/screens/` (RN) | 사용자 흐름 |
| API 서비스 | `lib/services/`, `lib/api/` | 백엔드 연동 방식 |
| 상태 관리 | `lib/providers/`, `lib/blocs/` (Flutter), store (RN) | 앱 상태 모델 |

---

## 추출 후 처리 원칙

### 1. 비즈니스 언어로 번역
```
❌ "UserEntity has userId: UUID, createdAt: Timestamp"
✅ "사용자(User): 서비스 가입 주체. 이메일로 식별, 가입일 기록"
```

### 2. 관계 표현
```
❌ "Order has List<OrderItem>"
✅ "주문(Order)은 1개 이상의 주문 항목(OrderItem)을 포함한다"
```

### 3. 모르는 부분은 TODO로 남기기
```markdown
### 환불 정책
환불은 구매 후 7일 이내 가능.
<!-- TODO: 디지털 상품 환불 정책 확인 필요 -->
```

### 4. 출처 항상 표기
```markdown
<!-- extracted from: backend/src/order/order.entity.ts, 2024-01-15 -->
```

---

## 추출 깊이 기준

**항상 추출**:
- 주요 엔티티/모델 목록과 핵심 필드
- API 엔드포인트 목록
- 도메인 용어 (glossary)

**선택적 추출** (팀 요구에 따라):
- 비즈니스 규칙 상세
- 도메인 이벤트
- ADR (중요한 기술 결정)

**추출하지 않음**:
- 구현 알고리즘 세부사항
- 인프라 설정
- 테스트 코드
