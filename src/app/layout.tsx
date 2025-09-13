import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'My Adventure History - 나만의 여행 기록',
  description: '특별한 여행의 순간들을 기록하고 공유하세요',
  keywords: ['여행', '기록', '모험', '여행일기', 'travel', 'adventure'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}