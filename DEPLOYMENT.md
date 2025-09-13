# My Adventure History 배포 가이드 🚀

## 1. Firebase 설정

### Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `myadventurehistory` 입력
4. Google Analytics 설정 (선택사항)

### Authentication 설정
1. Firebase Console에서 "Authentication" 선택
2. "시작하기" 클릭
3. "Sign-in method" 탭에서 "Google" 활성화
4. 프로젝트 지원 이메일 설정

### Firestore Database 설정
1. "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. "테스트 모드에서 시작" 선택 (나중에 보안 규칙 수정 필요)
4. 지역 선택 (asia-northeast3 권장)

### Storage 설정
1. "Storage" 선택
2. "시작하기" 클릭
3. 보안 규칙 기본값 사용

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBrNt9RTr6o80RxFJn79-zFovIEf5-4TUc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myadventurehistory.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myadventurehistory
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myadventurehistory.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1082105729340
NEXT_PUBLIC_FIREBASE_APP_ID=1:1082105729340:web:58d700852107b77b304e39
```

## 3. Vercel 배포

### GitHub 연결 확인
```bash
git remote -v
# origin  https://github.com/JuliusKim0730/myadventurehistory.git (fetch)
# origin  https://github.com/JuliusKim0730/myadventurehistory.git (push)
```

### Vercel 설정
1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. "New Project" 클릭
3. GitHub에서 `myadventurehistory` 저장소 선택
4. Framework Preset: "Next.js" 자동 감지
5. Environment Variables 추가:
   - 위의 Firebase 환경 변수들을 모두 추가
6. "Deploy" 클릭

### 도메인 설정 (선택사항)
1. 배포 완료 후 Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Domains"
3. 원하는 도메인 추가

## 4. Firebase 보안 규칙 설정

### Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자가 인증된 경우에만 읽기/쓰기 허용
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage 보안 규칙
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 5. 로컬 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

## 6. 빌드 및 배포 테스트

```bash
# 프로덕션 빌드
npm run build

# 로컬에서 프로덕션 서버 실행
npm start
```

## 7. 주요 기능 테스트

### 메인 페이지
- ✅ 애니메이션 정상 작동
- ✅ Google 로그인 버튼
- ✅ 게스트 로그인 버튼

### 인증 기능
- ✅ Google 로그인
- ✅ 게스트 모드
- ✅ 로그아웃

### 여행 기록 관리
- ✅ 새 여행 기록 생성
- ✅ 여행지 추가/삭제
- ✅ 기간 자동 계산

### 타임라인 시스템
- ✅ 일차별 카드 추가
- ✅ 시간순 정렬
- ✅ 계획/경험 분리 입력
- ✅ 참고 링크 추가

### 커뮤니티 기능
- ✅ 전체 여행 기록 조회
- ✅ 검색 및 필터링
- ✅ 반응형 카드 레이아웃

## 8. 향후 개발 계획

- [ ] 실제 Firebase 데이터 연동
- [ ] 이미지 업로드 기능
- [ ] 댓글 시스템
- [ ] 좋아요 기능
- [ ] 푸시 알림
- [ ] PWA 지원
- [ ] 지도 연동
- [ ] 소셜 공유

## 9. 문제 해결

### Firebase 연결 오류
- API 키 확인
- 도메인 승인 설정 (Firebase Console → Authentication → Settings → Authorized domains)

### Vercel 배포 오류
- 환경 변수 설정 확인
- 빌드 로그 확인
- Node.js 버전 호환성 확인

### 접근성 오류
- 모든 버튼에 `aria-label` 추가됨
- 폼 요소에 적절한 라벨 설정됨
- 키보드 네비게이션 지원

---

🎉 **축하합니다!** My Adventure History 프로젝트가 성공적으로 구축되었습니다!

배포 URL: [https://myadventurehistory.vercel.app](https://myadventurehistory.vercel.app) (예상)
GitHub: [https://github.com/JuliusKim0730/myadventurehistory](https://github.com/JuliusKim0730/myadventurehistory)
