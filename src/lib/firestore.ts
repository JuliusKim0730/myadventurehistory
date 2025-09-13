import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// 여행 기록 타입 정의
export interface TravelRecord {
  id?: string;
  title: string;
  startDate: string;
  endDate: string;
  destinations: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    duration: number;
  }>;
  authorId: string;
  authorName: string;
  thumbnailUrl?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface TimelineCard {
  id?: string;
  travelId: string;
  dayNumber: number;
  time: string;
  title: string;
  location: string;
  photos?: string[];
  referenceUrl?: string;
  plan?: string;
  experience?: string;
  createdAt?: Date | null;
}

// 여행 기록 CRUD 함수들
export const travelService = {
  // 모든 여행 기록 가져오기
  async getAll(): Promise<TravelRecord[]> {
    try {
      const q = query(
        collection(db, 'travels'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TravelRecord));
    } catch (error) {
      console.error('여행 기록 가져오기 실패:', error);
      return [];
    }
  },

  // 특정 사용자의 여행 기록 가져오기
  async getByUserId(userId: string): Promise<TravelRecord[]> {
    try {
      const q = query(
        collection(db, 'travels'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TravelRecord));
    } catch (error) {
      console.error('사용자 여행 기록 가져오기 실패:', error);
      return [];
    }
  },

  // 특정 여행 기록 가져오기
  async getById(id: string): Promise<TravelRecord | null> {
    try {
      const docRef = doc(db, 'travels', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as TravelRecord;
      }
      return null;
    } catch (error) {
      console.error('여행 기록 가져오기 실패:', error);
      return null;
    }
  },

  // 새 여행 기록 생성
  async create(travel: Omit<TravelRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'travels'), {
        ...travel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('여행 기록 생성 실패:', error);
      return null;
    }
  },

  // 여행 기록 업데이트
  async update(id: string, travel: Partial<TravelRecord>): Promise<boolean> {
    try {
      const docRef = doc(db, 'travels', id);
      await updateDoc(docRef, {
        ...travel,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('여행 기록 업데이트 실패:', error);
      return false;
    }
  },

  // 여행 기록 삭제
  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'travels', id));
      return true;
    } catch (error) {
      console.error('여행 기록 삭제 실패:', error);
      return false;
    }
  }
};

// 타임라인 카드 CRUD 함수들
export const timelineService = {
  // 특정 여행의 타임라인 가져오기
  async getByTravelId(travelId: string): Promise<TimelineCard[]> {
    try {
      const q = query(
        collection(db, 'timeline'),
        where('travelId', '==', travelId),
        orderBy('dayNumber'),
        orderBy('time')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TimelineCard));
    } catch (error) {
      console.error('타임라인 가져오기 실패:', error);
      return [];
    }
  },

  // 새 타임라인 카드 생성
  async create(card: Omit<TimelineCard, 'id' | 'createdAt'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, 'timeline'), {
        ...card,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('타임라인 카드 생성 실패:', error);
      return null;
    }
  },

  // 타임라인 카드 업데이트
  async update(id: string, card: Partial<TimelineCard>): Promise<boolean> {
    try {
      const docRef = doc(db, 'timeline', id);
      await updateDoc(docRef, card);
      return true;
    } catch (error) {
      console.error('타임라인 카드 업데이트 실패:', error);
      return false;
    }
  },

  // 타임라인 카드 삭제
  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'timeline', id));
      return true;
    } catch (error) {
      console.error('타임라인 카드 삭제 실패:', error);
      return false;
    }
  }
};
