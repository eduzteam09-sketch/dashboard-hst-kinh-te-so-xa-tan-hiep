import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

const encodePeriodId = (key: string) => key.replace(/\//g, '-');
const decodePeriodId = (docId: string) => docId.replace(/^(T\d+)-(\d+)$/, '$1/$2');

const DEFAULT_LAYER1 = {
  deiScore: 68,
  b1: { total: 480, active: 280, cloud: 120, erp: 60, ai: 30 },
  b2: { total: 140, active: 110, ecom: 90, qr: 70, export: 8 },
  b3: {
    revenue: 6.2,
    orders: 5400,
    repeatRatio: 45,
    newCustomers: 1800,
    averageValue: 0.95,
  },
  b4: { ratio: 55, qrPay: 40, mobileBank: 35, eWallet: 15, pos: 10 },
  b5: { total: 1100, active: 380, levels: [380, 240, 180, 90, 40] },
  b6: { ratio: 58, onlineGuests: 12000, revenue: 2.8 },
  b7: { farmRatio: 65, qrTrace: 50, iotFarm: 35, ecomAgri: 48 },
  b8: { startups: 18, projects: 6, mentors: 20, investors: 8 },
  b9: {
    households: { total: 1100, digitalPay: 850, ecom: 320 },
    smes: { total: 140, erp: 45, crm: 85, cloud: 110 },
    large: { total: 10, ai: 3, automation: 6 },
  }
};

// ============================================================
// REALTIME LISTENERS
// ============================================================

/** Lắng nghe realtime collection 'zones' */
export function subscribeZones(callback: (zones: any[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'zones'), (snapshot) => {
    const zones = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(zones);
  });
}

/** Lắng nghe realtime collection 'periodicData' */
export function subscribePeriodicData(
  callback: (data: Record<string, any>) => void
): Unsubscribe {
  return onSnapshot(collection(db, 'periodicData'), (snapshot) => {
    const data: Record<string, any> = {};
    snapshot.docs.forEach((d) => {
      const originalKey = decodePeriodId(d.id);
      data[originalKey] = d.data();
    });
    callback(data);
  });
}

/** Lắng nghe realtime collection 'communes' */
export function subscribeCommuneData(
  callback: (data: Record<string, any>) => void
): Unsubscribe {
  return onSnapshot(collection(db, 'communes'), (snapshot) => {
    const data: Record<string, any> = {};
    snapshot.docs.forEach((d) => {
      data[d.id] = d.data();
    });
    callback(data);
  });
}

// ============================================================
// WRITE OPERATIONS
// ============================================================

/** 
 * Ghi layer2 (dữ liệu PDF) vào Firestore cho 1 tháng cụ thể. 
 * Nếu tháng này chưa có, tự động tạo mới lấy cấu trúc (layer1, 3, 4, 5) từ một tháng fallback.
 */
export async function upsertPeriodicLayer2(
  month: number,
  year: number,
  layer2Data: any
): Promise<string> {
  const monthStr = month.toString().padStart(2, '0');
  const periodKey = `T${monthStr}/${year}`;
  const docId = encodePeriodId(periodKey);
  const docRef = doc(db, 'periodicData', docId);

  const { getDoc: getDocFn, setDoc } = await import('firebase/firestore');
  const existing = await getDocFn(docRef);

  if (existing.exists()) {
    // Nếu kỳ báo cáo đã tồn tại, ghi đè hoàn toàn dữ liệu mới nhất vào layer2
    await setDoc(docRef, { ...existing.data(), layer2: layer2Data });
  } else {
    // Nếu chưa có, copy template (layer1, 3, 4, 5) từ tháng fallback (ví dụ T05/2026)
    const fallbackDoc = await getDocFn(doc(db, 'periodicData', encodePeriodId('T05/2026')));
    let templateData: any = {};
    if (fallbackDoc.exists()) {
       templateData = fallbackDoc.data();
    } else {
       templateData = { layer1: DEFAULT_LAYER1 };
    }
    
    const newDoc = {
       ...templateData,
       id: periodKey,
       label: `Tháng ${monthStr} / ${year}`,
       quarter: `Q${Math.ceil(month / 3)}/${year}`,
       year: year.toString(),
       layer2: layer2Data,
    };
    await setDoc(docRef, newDoc);
  }

  return periodKey;
}


