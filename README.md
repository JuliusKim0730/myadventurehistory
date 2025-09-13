# My Adventure History 🌟

나만의 특별한 여행 기록을 만들고 공유하는 플랫폼입니다.

## 🚀 주요 기능

- **아름다운 메인 페이지**: 파란 하늘과 함께 움직이는 교통수단 애니메이션
- **간편한 로그인**: Google 로그인 또는 게스트 모드
- **여행 기록 관리**: 날짜별, 장소별 상세한 여행 계획 및 기록
- **타임라인 시스템**: 일차별 상세한 여행 일정 관리
- **커뮤니티 기능**: 다른 사용자의 여행 기록 둘러보기

## 🛠 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📱 주요 페이지

### 1. 메인 페이지 (/)
- 파란 하늘 배경과 교통수단 애니메이션
- Google 로그인 및 게스트 로그인 기능

### 2. 대시보드 (/dashboard)
- 사용자 환영 메시지
- 주요 기능 바로가기 카드
- 최근 활동 현황

### 3. 여행 기록 생성 (/create)
- 여행 기본 정보 입력
- 여행지별 세부 일정 관리
- 기간 자동 계산

### 4. 여행 기록 탐색 (/explore)
- 모든 사용자의 여행 기록 조회
- 검색 및 필터링 기능
- 좋아요 및 댓글 기능

## 🔧 설치 및 실행

1. **프로젝트 클론**
   \`\`\`bash
   git clone https://github.com/JuliusKim0730/myadventurehistory.git
   cd myadventurehistory
   \`\`\`

2. **의존성 설치**
   \`\`\`bash
   npm install
   \`\`\`

3. **환경 변수 설정**
   \`.env.local\` 파일을 생성하고 Firebase 설정을 추가하세요:
   \`\`\`
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   \`\`\`

4. **개발 서버 실행**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **브라우저에서 확인**
   [http://localhost:3000](http://localhost:3000)

## 🎨 디자인 특징

- **반응형 디자인**: 모바일부터 데스크톱까지 완벽한 호환성
- **부드러운 애니메이션**: Framer Motion을 활용한 생동감 있는 UI
- **직관적인 UX**: 사용자 친화적인 인터페이스
- **한국어 폰트**: Noto Sans KR 적용

## 📝 개발 계획

- [x] 프로젝트 초기 설정
- [x] 메인 페이지 애니메이션
- [x] Firebase 인증 연동
- [x] 기본 CRUD 페이지
- [ ] 타임라인 상세 기능
- [ ] 이미지 업로드 기능
- [ ] 댓글 및 좋아요 시스템
- [ ] 푸시 알림
- [ ] PWA 지원

## 🚀 배포

이 프로젝트는 Vercel로 배포됩니다.

\`\`\`bash
npm run build
\`\`\`

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 연락처

- GitHub: [@JuliusKim0730](https://github.com/JuliusKim0730)
- 프로젝트 링크: [https://github.com/JuliusKim0730/myadventurehistory](https://github.com/JuliusKim0730/myadventurehistory)

---

**"인생을 살며, 즐겨야할 때가 있다. 남들이 짠 계획이 아닌 우리만의 모험을 해보자."** ✈️🚢🚗🚂