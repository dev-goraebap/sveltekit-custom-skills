# 심볼릭 링크 가이드

환경에 따라 심볼릭 링크 생성 명령이 다르다. 실패할 경우 대안을 순서대로 시도한다.

## macOS / Linux

```bash
ln -s /absolute/path/to/wiki-repo .wiki
```

이 명령은 권한 문제 없이 동작한다.

## Windows

Windows는 셸 환경에 따라 명령이 다르고, 심볼릭 링크 생성에 권한 제약이 있을 수 있다.

### Git Bash (MSYS2)

```bash
# 방법 1: cmd를 경유하여 심볼릭 링크 생성
cmd //c mklink //D ".wiki" "C:\\absolute\\path\\to\\wiki-repo"

# 방법 2: Junction 사용 (관리자 권한 불필요, 로컬 경로만 지원)
cmd //c mklink //J ".wiki" "C:\\absolute\\path\\to\\wiki-repo"
```

Git Bash에서는 `/`가 옵션으로 해석되므로 `//`로 이스케이프해야 한다.

### CMD (명령 프롬프트)

```cmd
:: 심볼릭 링크 (관리자 권한 또는 개발자 모드 필요)
mklink /D .wiki C:\absolute\path\to\wiki-repo

:: Junction (관리자 권한 불필요)
mklink /J .wiki C:\absolute\path\to\wiki-repo
```

### PowerShell

```powershell
# 심볼릭 링크 (관리자 권한 또는 개발자 모드 필요)
New-Item -ItemType SymbolicLink -Path ".wiki" -Target "C:\absolute\path\to\wiki-repo"

# Junction (관리자 권한 불필요)
New-Item -ItemType Junction -Path ".wiki" -Target "C:\absolute\path\to\wiki-repo"
```

## Windows 권한 문제 대응

Windows에서 심볼릭 링크(`/D`) 생성이 실패하면 다음 순서로 대응한다.

1. **Junction(`/J`)으로 재시도** — 관리자 권한 없이 동작하며, 로컬 경로라면 심볼릭 링크와 기능적으로 동일하다. 대부분의 경우 이것으로 충분하다.
2. 그래도 실패하면 사용자에게 **개발자 모드 활성화**를 안내한다:
   - 설정 → 개발자용 → 개발자 모드 ON
   - 이후 심볼릭 링크(`/D`)가 관리자 권한 없이 동작한다

## 기존 링크 제거 후 재연결

폴더명 변경이나 경로 이동으로 재연결이 필요한 경우, 기존 `.wiki` 링크를 먼저 제거한다.

```bash
# macOS / Linux / Git Bash
rm .wiki

# Windows CMD
rmdir .wiki

# PowerShell
Remove-Item .wiki
```

그 다음 위의 심볼릭 링크 생성 단계를 다시 수행한다.
