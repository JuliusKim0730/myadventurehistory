# Firebase 설정 가이드 🔥

## 1. Firebase Console 설정

### Authentication 설정
1. [Firebase Console](https://console.firebase.google.com/project/myadventurehistory) 접속
2. **Authentication** → **Sign-in method** 클릭
3. **Google** 제공업체 활성화
4. **승인된 도메인**에 다음 도메인들 추가:
   - `localhost` (개발용)
   - `mah.vercel.app` (프로덕션용)
   - `myadventurehistory-kvjees431-juliuskims-projects.vercel.app` (현재 도메인)

### Firestore Database 설정
1. **Firestore Database** → **규칙** 탭
2. 다음 규칙으로 업데이트:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage 설정
1. **Storage** → **규칙** 탭
2. 다음 규칙으로 업데이트:
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

## 2. Vercel 도메인 설정

### 커스텀 도메인 추가
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `myadventurehistory` 프로젝트 선택
3. **Settings** → **Domains** 클릭
4. `mah.vercel.app` 도메인 추가
   - 이미 사용 중이면 `my-adventure-history.vercel.app` 시도

### 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수들 추가:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBrNt9RTr6o80RxFJn79-zFovIEf5-4TUc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myadventurehistory.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myadventurehistory
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myadventurehistory.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1082105729340
NEXT_PUBLIC_FIREBASE_APP_ID=1:1082105729340:web:58d700852107b77b304e39
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-59C83LLBB8
```

## 3. 디버깅 체크리스트

### Google 로그인 문제 해결
- [ ] Firebase Console에서 Google 인증 활성화됨
- [ ] 승인된 도메인에 배포 URL 추가됨
- [ ] 브라우저 콘솔에서 Firebase 초기화 로그 확인
- [ ] 팝업 차단기 비활성화

### Firestore 연결 문제 해결
- [ ] Firestore 규칙이 올바르게 설정됨
- [ ] 사용자가 인증된 상태에서 데이터 접근
- [ ] 네트워크 탭에서 Firestore 요청 확인

### 일반적인 문제들
- [ ] 브라우저 캐시 클리어
- [ ] 시크릿 모드에서 테스트
- [ ] 다른 브라우저에서 테스트
- [ ] 모바일에서 테스트

## 4. 테스트 시나리오

### 기본 기능 테스트
1. **메인 페이지 로딩**: 애니메이션이 정상 작동하는지
2. **Google 로그인**: 팝업이 열리고 로그인이 성공하는지
3. **게스트 로그인**: 게스트 모드로 접근 가능한지
4. **여행 기록 생성**: 새 여행을 만들고 저장되는지
5. **타임라인 추가**: 카드를 추가하고 실시간 반영되는지
6. **데이터 조회**: 다른 사용자의 여행 기록이 보이는지

### 오류 상황 테스트
1. **네트워크 오프라인**: 적절한 오류 메시지 표시
2. **인증 실패**: 로그인 실패 시 사용자 친화적 메시지
3. **데이터 저장 실패**: Firestore 오류 시 적절한 처리

## 5. 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용 완료
- 외부 이미지 도메인 설정 완료

### 코드 분할
- 페이지별 자동 코드 분할 적용
- 동적 import 사용 가능

### 캐싱
- Vercel Edge Network 자동 적용
- Firebase 캐싱 설정 가능

## 6. 모니터링

### Firebase Analytics
- 사용자 행동 추적 활성화
- 페이지 뷰 자동 수집

### Vercel Analytics
- 성능 메트릭 수집
- 실시간 사용자 모니터링

---

## 🚨 중요 알림

**Firebase 보안 규칙**이 현재 테스트 모드로 설정되어 있습니다. 
프로덕션 환경에서는 더 엄격한 보안 규칙을 적용해야 합니다.

**도메인 설정**이 완료되면 Firebase Console의 승인된 도메인 목록을 업데이트해주세요.
