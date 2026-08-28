# 🎉 Rolling paper generator

> Claude와 함께 만든 **바이브코딩(Vibe Coding) 프로젝트**입니다.

생일, 졸업, 크리스마스 같은 기념일을 위한 롤링페이퍼를 만들고, 링크 하나로 공유해서
누구나 로그인 없이 메시지를 남길 수 있는 웹앱입니다. 배경 이미지를 직접 올려 나만의
커스텀 테마를 만들 수도 있어요.


## ✨ 기능

- **내장 테마**: 생일 🎂 / 졸업 🎓 / 크리스마스 🎄 — 테마별 그라디언트 배경과 장식
- **커스텀 테마**: 배경 이미지를 올려 그 사진 크기·비율 그대로 나만의 롤링페이퍼 카드로 사용
- **로그인 없는 참여**: 공유 링크만 있으면 누구나 바로 메시지 작성
- **소유자 관리**: 만든 사람만 아는 관리 링크로 메시지 삭제, 작성 마감, 전체 삭제
- **메이슨리 메시지 보드**: 메시지 길이가 제각각이어도 겹치거나 빈 공간 없이 촘촘하게 배치


## 🛠 기술 스택
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=flat-square&logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Vibe Coded](https://img.shields.io/badge/Vibe_Coded-Claude-D97757?style=flat-square&logo=anthropic&logoColor=white)

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js (App Router, Server Actions) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 데이터베이스 | Neon (서버리스 Postgres) |
| 이미지 | Cloudinary (커스텀 배경 업로드/전송) |
| 배포 | Netlify |


## 🚀 동작 방식

- 모든 DB 읽기/쓰기는 Next.js **Server Action**이 `DATABASE_URL`로 직접 처리합니다.
  브라우저에는 DB 접근 권한이 전혀 노출되지 않으므로, 앱을 거치지 않고는 데이터를 읽거나
  쓸 방법이 없습니다.
- 브라우저가 외부 서비스에 직접 접근하는 유일한 경우는 **커스텀 배경 이미지 업로드**로,
  Cloudinary의 unsigned upload preset을 통해 브라우저 → Cloudinary로 바로 올라갑니다.
  업로드 전 브라우저에서 리사이즈·압축(최대 1920px, WebP, 2MB 이하)하고, Cloudinary
  preset 자체에도 포맷/용량 제한을 걸어 이중으로 막습니다.
- 로그인이 없으므로, 롤링페이퍼를 만들면 **관리 링크**(`/p/[id]/manage?token=...`)가
  발급됩니다. 이 링크(정확히는 안의 토큰)가 곧 관리자 권한입니다. 같은 브라우저에서는
  localStorage에 저장해 자동으로 인식하고, 다른 기기에서는 관리 링크(또는 토큰)를 직접
  붙여넣어 인증할 수 있습니다.
- 커스텀 테마는 업로드한 사진의 가로세로 비율 그대로 카드 크기를 정하고, 그 안에서
  제목/작성 버튼은 고정, 메시지 목록만 남은 공간을 채우며 넘치면 그 안에서 스크롤됩니다.


## 📁 프로젝트 구조

```
app/
  page.tsx                          # 랜딩 페이지
  create/                           # 롤링페이퍼 생성 폼 + Server Action
  p/[id]/                           # 공개 롤링페이퍼 뷰 + 메시지 작성
  p/[id]/manage/                    # 관리 페이지 (owner_token 인증)
lib/
  db.ts                             # Neon(Postgres) 서버 전용 접근
  cloudinary.ts                     # 브라우저 → Cloudinary 직접 업로드
  themes.ts                         # 내장 테마 정의
  image.ts                          # 배경 이미지 리사이즈/압축
  validation.ts                     # zod 스키마 + UUID/배경 URL 검증
components/                         # ThemePicker, MessageCard, MessageGrid,
                                     # PaperBackground, CustomPhotoPaper, ConfirmDialog 등
db/schema.sql                       # DB 테이블 정의 (Neon/Postgres)
```


## 📄 라이선스
개인/학습용 프로젝트입니다.