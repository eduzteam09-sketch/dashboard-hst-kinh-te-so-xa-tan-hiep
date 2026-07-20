import {
  collection,
  doc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

// Lấy tên collection từ file .env
const COLLECTION_NAME = import.meta.env.VITE_APP_COLLECTION_NAME || 'periodicData';

const encodePeriodId = (key: string) => key.replace(/\//g, '-');
const decodePeriodId = (docId: string) => docId.replace(/^(T\d+)-(\d+)$/, '$1/$2');

export const DEFAULT_LAYER1 = {
  deiScore: 68,
  b1: { total: 480, active: 280, cloud: 120, erp: 60, ai: 30 },
  b2: { total: 140, active: 110, ecom: 90, qr: 70, export: 8 },
  b3: {
    revenue: 0,
    orders: 0,
    repeatRatio: 0,
    newCustomers: 0,
    averageValue: 0,
  },
  b4: { ratio: 0, qrPay: 0, mobileBank: 0, eWallet: 0, pos: 0 },
  b5: { total: 0, active: 0, levels: [0, 0, 0, 0, 0] },
  b6: { ratio: 0, onlineGuests: 0, revenue: 0 },
  b7: { farmRatio: 0, qrTrace: 0, iotFarm: 0, ecomAgri: 0 },
  b8: { startups: 0, projects: 0, mentors: 0, investors: 0 },
  b9: {
    households: { total: 0, digitalPay: 0, ecom: 0 },
    smes: { total: 0, erp: 0, crm: 0, cloud: 0 },
    large: { total: 0, ai: 0, automation: 0 },
  }
};

export const DEFAULT_LAYER2 = {
  nhomA: {
    digitalEnterprises: { month: 0, year: 0 },
    cloudEnterprises: { month: 0, year: 0 },
    comprehensiveDigital: { month: 0, year: 0 },
    netIdCards: { month: 0, year: 0 },
  },
  nhomB: {
    webEcom: { month: 0, year: 0 },
    digitalProducts: { month: 0, year: 0 },
    ecomOrders: { month: 0, year: 0 },
    growthRate: { month: 0, year: 0 },
  },
  nhomC: {
    erpSystems: { month: 0, year: 0 },
    totalPersonnel: { month: 0, year: 0 },
    trainingCourses: { month: 0, year: 0 },
  },
  nhomD: {
    pageViews: { month: 0, year: 0 },
    viewers: { month: 0, year: 0 },
    googleSeo: { month: 0, year: 0 },
    customers: { month: 0, year: 0 },
    revenue: { month: 0, year: 0 },
  },
  nhomE: {
    enterprises: { month: 0, year: 0 },
    charityProjects: { month: 0, year: 0 },
    boardNews: { month: 0, year: 0 },
    projects: { month: 0, year: 0 },
    investmentCalls: { month: 0, year: 0 },
    tourismLocations: { month: 0, year: 0 },
    featuredEvents: { month: 0, year: 0 },
    digitalTransformations: { month: 0, year: 0 },
    libraryDocs: { month: 0, year: 0 },
  },
};

export const DEFAULT_LAYER3 = {
  education: { schools: 0, platforms: 0, onlineStudents: 0 },
  health: { clinics: 0, ehrRatio: 0, telemedicine: 0 },
  agri: { smartFarms: 0, iotSensors: 0, traceability: 0 },
  admin: { publicServices: 0, level4Ratio: 0 },
  investmentProjects: { month: 0, quarter: 0, year: 0, total: 0 },
  planningInfo: { month: 0, quarter: 0, year: 0, total: 0 },
};

export const DEFAULT_LAYER4 = {
  households: { total: 0, digitalPay: 0, ecom: 0 },
  smes: { total: 0, erp: 0, crm: 0, cloud: 0 },
  large: { total: 0, ai: 0, automation: 0 },
  policy: { total: 0, enterprise: 0, household: 0, cooperative: 0 },
  feedback: { total: 0, resolved: 0, pending: 0, reviewing: 0 },
};

export const DEFAULT_LAYER5 = {
  points: { total: 0, active: 0 },
  hubs: { total: 0, communes: 0 },
  metrics: { coverage: 0, revenue: 0, orders: 0 },
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

/** Lắng nghe realtime collection dữ liệu chu kỳ */
export function subscribePeriodicData(
  callback: (data: Record<string, any>) => void
): Unsubscribe {
  // ĐÃ SỬA: Thay 'periodicData' thành COLLECTION_NAME
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
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
  
  // ĐÃ SỬA CHỖ 1: Thay 'periodicData' thành COLLECTION_NAME
  const docRef = doc(db, COLLECTION_NAME, docId);

  const { getDoc: getDocFn, setDoc } = await import('firebase/firestore');
  const existing = await getDocFn(docRef);

  if (existing.exists()) {
    // Nếu kỳ báo cáo đã tồn tại, ghi đè hoàn toàn dữ liệu mới nhất vào layer2
    await setDoc(docRef, { ...existing.data(), layer2: layer2Data });
  } else {
    // ĐÃ SỬA CHỖ 2: Thay 'periodicData' thành COLLECTION_NAME
    const fallbackDoc = await getDocFn(doc(db, COLLECTION_NAME, encodePeriodId('T05/2026')));
    
    let templateData: any;
    if (fallbackDoc.exists()) {
      templateData = fallbackDoc.data();
    } else {
      templateData = { 
        layer1: DEFAULT_LAYER1,
        layer2: DEFAULT_LAYER2,
        layer3: DEFAULT_LAYER3,
        layer4: DEFAULT_LAYER4,
        layer5: DEFAULT_LAYER5
      };
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


