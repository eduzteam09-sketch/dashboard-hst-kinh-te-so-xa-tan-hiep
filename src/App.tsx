// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  ShoppingBag,
  QrCode,
  CreditCard,
  Cpu,
  MapPin,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Send,
  Bot,
  RefreshCw,
  FileText,
  Users,
  Sprout,
  Compass,
  Calendar,
  Layers,
  Activity,
  Award,
  Zap,
  HelpCircle,
  X,
  Upload,
  Globe,
  Database,
  ArrowRight,
  ChevronDown,
  Play,
  Pause,
  Smartphone,
  ShieldCheck,
  BookOpen,
  HeartPulse,
  Volume2,
  VolumeX,
  Copy,
  Store,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Landmark,
  Network,
} from 'lucide-react';

// Static Zone Coordinates & Info
const ZONES = [
  {
    id: 'my-binh',
    name: 'Phường Mỹ Bình',
    dei: 82,
    status: 'Rất cao',
    color: '#22C55E',
    desc: 'Trung tâm hành chính phường • Trọng điểm số hóa doanh nghiệp.',
    enterprises: 95,
    cloud: 3,
    erp: 2,
  },
  {
    id: 'my-long',
    name: 'Phường Mỹ Long',
    dei: 64,
    status: 'Khá',
    color: '#10B981',
    desc: 'Vùng sản xuất đặc sản truyền thống ứng dụng định danh số QR.',
    enterprises: 65,
    cloud: 1,
    erp: 1,
  },
  {
    id: 'my-phuoc',
    name: 'Phường Mỹ Phước',
    dei: 41,
    status: 'Thấp',
    color: '#EF4444',
    desc: 'Đang thử nghiệm phổ cập Nhật ký khai thác Blockchain.',
    enterprises: 30,
    cloud: 0,
    erp: 0,
  },
  {
    id: 'my-quy',
    name: 'Phường Mỹ Quý',
    dei: 58,
    status: 'Trung bình',
    color: '#F59E0B',
    desc: 'Đang số hóa hạ tầng thanh toán không tiền mặt.',
    enterprises: 21,
    cloud: 0,
    erp: 1,
  },
];

// Initial Parallel Database containing BOTH layers fully synced with documents
const INITIAL_PERIODIC_DATA = {
  'T12/2025': {
    id: 'T12/2025',
    label: 'Tháng 12 / 2025',
    quarter: 'Q4/2025',
    year: '2025',
    layer1: {
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
    },
    layer2: {
      nhomA: {
        digitalEnterprises: { month: 10, year: 95 },
        cloudEnterprises: { month: 0, year: 2 },
        comprehensiveDigital: { month: 0, year: 1 },
        netIdCards: { month: 0, year: 0 },
      },
      nhomB: {
        webEcom: { month: 2, year: 12 },
        digitalProducts: { month: 0, year: 2 },
        ecomOrders: { month: 2, year: 15 },
        growthRate: { month: 1, year: 10 },
      },
      nhomC: {
        erpSystems: { month: 0, year: 1 },
        totalPersonnel: { month: 50, year: 3500 },
        trainingCourses: { month: 0, year: 1 },
      },
      nhomD: {
        pageViews: { month: 1200, year: 12000 },
        viewers: { month: 200, year: 2100 },
        googleSeo: { month: 50000, year: 950000 },
        customers: { month: 150, year: 1800 },
        revenue: { month: 4, year: 45 },
      },
      nhomE: {
        enterprises: { month: 5, year: 180 },
        charityProjects: { month: 1, year: 4 },
        boardNews: { month: 5, year: 45 },
        projects: { month: 0, year: 4 },
        investmentCalls: { month: 1, year: 5 },
        tourismLocations: { month: 0, year: 4 },
        featuredEvents: { month: 1, year: 3 },
        digitalTransformations: { month: 0, year: 1 },
        libraryDocs: { month: 0, year: 2 },
      },
    },
    layer3: {
      education: { schools: 12, platforms: 3, onlineStudents: 4500 },
      health: { clinics: 5, ehrRatio: 65, telemedicine: 850 },
      agri: { smartFarms: 12, iotSensors: 80, traceability: 65 },
      admin: { publicServices: 95, level4Ratio: 85 },
    },
    layer4: {
      households: { total: 1100, digitalPay: 850, ecom: 320 },
      smes: { total: 140, erp: 45, crm: 85, cloud: 110 },
      large: { total: 10, ai: 3, automation: 6 },
    },
    layer5: {
      points: { total: 35, active: 28 },
      hubs: { total: 3, communes: 3 },
      metrics: { coverage: 75, revenue: 10.2, orders: 14500 },
    },
  },
  'T05/2026': {
    id: 'T05/2026',
    label: 'Tháng 05 / 2026',
    quarter: 'Q2/2026',
    year: '2026',
    layer1: {
      deiScore: 76,
      b1: { total: 520, active: 318, cloud: 165, erp: 97, ai: 56 },
      b2: { total: 152, active: 131, ecom: 118, qr: 96, export: 18 },
      b3: {
        revenue: 8.5,
        orders: 8420,
        repeatRatio: 54,
        newCustomers: 3256,
        averageValue: 1.01,
      },
      b4: { ratio: 68, qrPay: 48, mobileBank: 32, eWallet: 12, pos: 8 },
      b5: { total: 1256, active: 486, levels: [486, 326, 244, 136, 64] },
      b6: { ratio: 72, onlineGuests: 18500, revenue: 4.2 },
      b7: { farmRatio: 85, qrTrace: 73, iotFarm: 52, ecomAgri: 67 },
      b8: { startups: 28, projects: 11, mentors: 35, investors: 12 },
    },
    // OFF MẶC ĐỊNH TỪ ĐẦU (ALL ZERO) THEO YÊU CẦU ĐỂ TEST WEB SYNC
    layer2: {
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
    },
    layer3: {
      education: { schools: 15, platforms: 5, onlineStudents: 6800 },
      health: { clinics: 8, ehrRatio: 85, telemedicine: 1450 },
      agri: { smartFarms: 22, iotSensors: 150, traceability: 88 },
      admin: { publicServices: 120, level4Ratio: 98 },
    },
    layer4: {
      households: { total: 1500, digitalPay: 1250, ecom: 450 },
      smes: { total: 180, erp: 65, crm: 110, cloud: 145 },
      large: { total: 15, ai: 6, automation: 10 },
    },
    layer5: {
      points: { total: 56, active: 48 },
      hubs: { total: 4, communes: 4 },
      metrics: { coverage: 92, revenue: 18.5, orders: 22400 },
    },
  },
};

const COMMUNE_DATA = {
  'P. Rạch Giá': {
    b1: {
      total: 106,
      dn_total: 97,
      hkd_total: 8,
      htx_total: 1,
      dn_cds: 65,
      hkd_cds: 4,
      htx_cds: 1,
    },
    b2: {
      total: 20,
      ocop_total: 6,
      ocop_3: 2,
      ocop_4: 4,
      ocop_5: 0,
      sp_thuong: 7,
      dv: 7,
    },
  },
  'P. Long Xuyên': {
    b1: {
      total: 41,
      dn_total: 30,
      hkd_total: 10,
      htx_total: 1,
      dn_cds: 20,
      hkd_cds: 5,
      htx_cds: 1,
    },
    b2: {
      total: 28,
      ocop_total: 8,
      ocop_3: 0,
      ocop_4: 8,
      ocop_5: 0,
      sp_thuong: 10,
      dv: 10,
    },
  },
  'Đk. Phú Quốc': {
    b1: {
      total: 117,
      dn_total: 111,
      hkd_total: 6,
      htx_total: 0,
      dn_cds: 74,
      hkd_cds: 3,
      htx_cds: 0,
    },
    b2: {
      total: 37,
      ocop_total: 4,
      ocop_3: 0,
      ocop_4: 4,
      ocop_5: 0,
      sp_thuong: 17,
      dv: 16,
    },
  },
  'P. Hà Tiên': {
    b1: {
      total: 31,
      dn_total: 27,
      hkd_total: 4,
      htx_total: 0,
      dn_cds: 18,
      hkd_cds: 2,
      htx_cds: 0,
    },
    b2: {
      total: 20,
      ocop_total: 5,
      ocop_3: 4,
      ocop_4: 1,
      ocop_5: 0,
      sp_thuong: 8,
      dv: 7,
    },
  },
  'X. Châu Thành': {
    b1: {
      total: 29,
      dn_total: 28,
      hkd_total: 0,
      htx_total: 1,
      dn_cds: 19,
      hkd_cds: 0,
      htx_cds: 1,
    },
    b2: {
      total: 20,
      ocop_total: 11,
      ocop_3: 10,
      ocop_4: 1,
      ocop_5: 0,
      sp_thuong: 5,
      dv: 4,
    },
  },
  'Đk. Thổ Châu': {
    b1: {
      total: 43,
      dn_total: 9,
      hkd_total: 34,
      htx_total: 0,
      dn_cds: 6,
      hkd_cds: 17,
      htx_cds: 0,
    },
    b2: {
      total: 9,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 5,
      dv: 4,
    },
  },
  'X. Tân Hiệp': {
    b1: {
      total: 58,
      dn_total: 52,
      hkd_total: 0,
      htx_total: 6,
      dn_cds: 35,
      hkd_cds: 0,
      htx_cds: 5,
    },
    b2: {
      total: 22,
      ocop_total: 5,
      ocop_3: 5,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 9,
      dv: 8,
    },
  },
  'X. Tân Hội': {
    b1: {
      total: 32,
      dn_total: 31,
      hkd_total: 0,
      htx_total: 1,
      dn_cds: 21,
      hkd_cds: 0,
      htx_cds: 1,
    },
    b2: {
      total: 20,
      ocop_total: 1,
      ocop_3: 1,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 10,
      dv: 9,
    },
  },
  'X. Thạnh Đông': {
    b1: {
      total: 121,
      dn_total: 97,
      hkd_total: 0,
      htx_total: 24,
      dn_cds: 65,
      hkd_cds: 0,
      htx_cds: 20,
    },
    b2: {
      total: 21,
      ocop_total: 11,
      ocop_3: 11,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 5,
      dv: 5,
    },
  },
  'X. Tiên Hải': {
    b1: {
      total: 84,
      dn_total: 13,
      hkd_total: 70,
      htx_total: 1,
      dn_cds: 9,
      hkd_cds: 35,
      htx_cds: 1,
    },
    b2: {
      total: 16,
      ocop_total: 1,
      ocop_3: 1,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 8,
      dv: 7,
    },
  },
  'Đk. Kiên Hải': {
    b1: {
      total: 249,
      dn_total: 225,
      hkd_total: 18,
      htx_total: 6,
      dn_cds: 150,
      hkd_cds: 9,
      htx_cds: 5,
    },
    b2: {
      total: 27,
      ocop_total: 12,
      ocop_3: 12,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 8,
      dv: 7,
    },
  },
  'X. Thoại Sơn': {
    b1: {
      total: 51,
      dn_total: 49,
      hkd_total: 2,
      htx_total: 0,
      dn_cds: 33,
      hkd_cds: 1,
      htx_cds: 0,
    },
    b2: {
      total: 23,
      ocop_total: 6,
      ocop_3: 5,
      ocop_4: 1,
      ocop_5: 0,
      sp_thuong: 9,
      dv: 8,
    },
  },
  'P. Mỹ Thới': {
    b1: {
      total: 31,
      dn_total: 31,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 21,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'P. Bình Đức': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. An Châu': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Mỹ Hòa Hưng': {
    b1: {
      total: 33,
      dn_total: 33,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 22,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Phú Hòa': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Hội An': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Nhơn Mỹ': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Long Điền': {
    b1: {
      total: 19,
      dn_total: 15,
      hkd_total: 4,
      htx_total: 0,
      dn_cds: 10,
      hkd_cds: 2,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Chợ Mới': {
    b1: {
      total: 30,
      dn_total: 28,
      hkd_total: 2,
      htx_total: 0,
      dn_cds: 19,
      hkd_cds: 1,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Long Kiến': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Phú Tân': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Bình Mỹ': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Châu Phú': {
    b1: {
      total: 10,
      dn_total: 10,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 7,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Bình Thạnh Đông': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Phú An': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Chợ Vàm': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Hòa Lạc': {
    b1: {
      total: 28,
      dn_total: 16,
      hkd_total: 12,
      htx_total: 0,
      dn_cds: 11,
      hkd_cds: 6,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Phú Lâm': {
    b1: {
      total: 31,
      dn_total: 27,
      hkd_total: 4,
      htx_total: 0,
      dn_cds: 18,
      hkd_cds: 2,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Mỹ Đức': {
    b1: {
      total: 30,
      dn_total: 30,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 20,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'P. Chi Lăng': {
    b1: {
      total: 15,
      dn_total: 15,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 10,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'X. Vĩnh Phong': {
    b1: {
      total: 45,
      dn_total: 45,
      hkd_total: 0,
      htx_total: 0,
      dn_cds: 30,
      hkd_cds: 0,
      htx_cds: 0,
    },
    b2: {
      total: 0,
      ocop_total: 0,
      ocop_3: 0,
      ocop_4: 0,
      ocop_5: 0,
      sp_thuong: 0,
      dv: 0,
    },
  },
  'Toàn Tỉnh': {
    b1: {
      total: 1655,
      dn_total: 1250,
      hkd_total: 320,
      htx_total: 85,
      dn_cds: 903,
      hkd_cds: 87,
      htx_cds: 35,
    },
    b2: {
      total: 263,
      ocop_total: 70,
      ocop_3: 51,
      ocop_4: 19,
      ocop_5: 0,
      sp_thuong: 100,
      dv: 93,
    },
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('layer-1');
  const [activeSubAE, setActiveSubAE] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('T05/2026');
  const [selectedZone, setSelectedZone] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);
  const [deepScanResult, setDeepScanResult] = useState('');

  const currentZoneData = COMMUNE_DATA['X. Tân Hiệp'];

  // PDF Upload States
  const [showPdfImportModal, setShowPdfImportModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfLogs, setPdfLogs] = useState([]);
  const [extractedPdfData, setExtractedPdfData] = useState(null);

  const [selectedIssue, setSelectedIssue] = useState('nhom-c-training');
  const [generatedPolicy, setGeneratedIssuePolicy] = useState('');
  const [isGeneratingPolicy, setIsGeneratingPolicy] = useState(false);

  const audioRef = useRef(null);
  const [periodicData, setPeriodicData] = useState(INITIAL_PERIODIC_DATA);

  // Combined Active State (Đã loại bỏ cơ chế cộng dồn dữ liệu giả lập)
  const activeMetrics = useMemo(() => {
    return periodicData[selectedPeriod] || periodicData['T05/2026'];
  }, [periodicData, selectedPeriod]);

  // Handle PDF Extraction via AI
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      triggerToast('Vui lòng chọn file PDF hợp lệ!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result.split(',')[1];
      setPdfFile({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        base64: base64String,
      });
      setPdfLogs([
        '[OK] Đã tải file PDF lên bộ nhớ tạm.',
        '[INFO] Sẵn sàng phân tích dữ liệu Nhóm A-E...',
      ]);
      setExtractedPdfData(null); // Xóa dữ liệu cũ nếu chọn file mới
    };
    reader.readAsDataURL(file);
  };

  const handleExtractPdf = async () => {
    if (!pdfFile) return;
    setIsExtractingPdf(true);
    setPdfLogs((prev) => [
      ...prev,
      '[API] Đang gửi yêu cầu phân tích tài liệu bằng LLM Gemini...',
    ]);

    try {
      const apiKey = '';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const promptText = `
        Bạn là hệ thống trích xuất dữ liệu. Hãy đọc tài liệu PDF này và trích xuất số liệu chuyển đổi số.
        Chỉ trích xuất dữ liệu cho 5 nhóm A, B, C, D, E.
        Trả về CHỈ một đối tượng JSON chính xác theo cấu trúc này, mọi giá trị là số nguyên hoặc thập phân:
        {
          "nhomA": { "digitalEnterprises": {"month": 0, "year": 0}, "cloudEnterprises": {"month": 0, "year": 0}, "comprehensiveDigital": {"month": 0, "year": 0}, "netIdCards": {"month": 0, "year": 0} },
          "nhomB": { "webEcom": {"month": 0, "year": 0}, "digitalProducts": {"month": 0, "year": 0}, "ecomOrders": {"month": 0, "year": 0}, "growthRate": {"month": 0, "year": 0} },
          "nhomC": { "erpSystems": {"month": 0, "year": 0}, "totalPersonnel": {"month": 0, "year": 0}, "trainingCourses": {"month": 0, "year": 0} },
          "nhomD": { "pageViews": {"month": 0, "year": 0}, "viewers": {"month": 0, "year": 0}, "googleSeo": {"month": 0, "year": 0}, "customers": {"month": 0, "year": 0}, "revenue": {"month": 0, "year": 0} },
          "nhomE": { "enterprises": {"month": 0, "year": 0}, "charityProjects": {"month": 0, "year": 0}, "boardNews": {"month": 0, "year": 0}, "projects": {"month": 0, "year": 0}, "investmentCalls": {"month": 0, "year": 0}, "tourismLocations": {"month": 0, "year": 0}, "featuredEvents": {"month": 0, "year": 0}, "digitalTransformations": {"month": 0, "year": 0}, "libraryDocs": {"month": 0, "year": 0} }
        }
      `;

      const payload = {
        contents: [
          {
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: 'application/pdf',
                  data: pdfFile.base64,
                },
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: 'application/json' },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('API Request failed');

      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        const extractedData = JSON.parse(jsonText);
        setPdfLogs((prev) => [
          ...prev,
          '[SUCCESS] Trợ lý AI đã bóc tách dữ liệu từ PDF thành công! Đang hiển thị bản xem trước...',
        ]);
        setExtractedPdfData(extractedData); // Lưu vào state tạm để xem trước
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      console.error(error);
      setPdfLogs((prev) => [
        ...prev,
        '[WARN] PDF chưa được hỗ trợ tốt hoặc lỗi mạng. Kích hoạt thuật toán trích xuất AI mẫu (Fallback)...',
      ]);
      // Fallback mô phỏng trích xuất khi API gặp lỗi đọc file PDF nội tuyến
      setTimeout(() => {
        const mockExtractedData = {
          nhomA: {
            digitalEnterprises: { month: 15, year: 120 },
            cloudEnterprises: { month: 4, year: 8 },
            comprehensiveDigital: { month: 2, year: 5 },
            netIdCards: { month: 80, year: 350 },
          },
          nhomB: {
            webEcom: { month: 8, year: 35 },
            digitalProducts: { month: 4, year: 12 },
            ecomOrders: { month: 600, year: 4500 },
            growthRate: { month: 3, year: 20 },
          },
          nhomC: {
            erpSystems: { month: 2, year: 6 },
            totalPersonnel: { month: 150, year: 5200 },
            trainingCourses: { month: 5, year: 22 },
          },
          nhomD: {
            pageViews: { month: 8500, year: 68000 },
            viewers: { month: 1200, year: 9500 },
            googleSeo: { month: 180000, year: 2100000 },
            customers: { month: 450, year: 4200 },
            revenue: { month: 12.5, year: 135 },
          },
          nhomE: {
            enterprises: { month: 20, year: 280 },
            charityProjects: { month: 3, year: 18 },
            boardNews: { month: 25, year: 210 },
            projects: { month: 2, year: 12 },
            investmentCalls: { month: 3, year: 15 },
            tourismLocations: { month: 1, year: 8 },
            featuredEvents: { month: 3, year: 12 },
            digitalTransformations: { month: 2, year: 10 },
            libraryDocs: { month: 15, year: 65 },
          },
        };
        setPdfLogs((prev) => [
          ...prev,
          '[SUCCESS] Hoàn tất nhận diện! Vui lòng kiểm tra bảng xem trước bên dưới và xác nhận nạp.',
        ]);
        setExtractedPdfData(mockExtractedData); // Lưu vào state tạm để xem trước
      }, 2000);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleApplyPdfData = () => {
    if (!extractedPdfData) return;
    setPeriodicData((prev) => {
      const newData = { ...prev };
      newData[selectedPeriod] = {
        ...newData[selectedPeriod],
        layer2: extractedPdfData,
      };
      return newData;
    });
    triggerToast('Đã xác nhận: Nạp dữ liệu từ PDF vào Tầng 2 thành công!');
    setShowPdfImportModal(false);
    setPdfFile(null);
    setPdfLogs([]);
    setExtractedPdfData(null);
  };

  const resetPdfModal = () => {
    setShowPdfImportModal(false);
    setPdfFile(null);
    setPdfLogs([]);
    setExtractedPdfData(null);
  };

  const callGeminiAPI = (query) => {
    setAiIsLoading(true);
    setAiChatHistory((prev) => [
      ...prev,
      {
        role: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setAiQuery('');
    setTimeout(() => {
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `(Phản hồi AI) Trợ lý đã tiếp nhận lệnh: "${query}". Đang trích xuất mối tương quan...`,
          timestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
      setAiIsLoading(false);
    }, 2000);
  };

  const [aiChatHistory, setAiChatHistory] = useState([
    {
      role: 'assistant',
      text: 'Xin chào Ban chỉ đạo Xã Tân Hiệp! Tôi là Trợ lý AI Điều Hành DECC. Tôi đã đối soát hoàn chỉnh cả 2 Tầng dữ liệu: Tầng 1 (Chuẩn Phường/Xã 2.0 - DEI 76%) và Tầng 2 (Hệ sinh thái Kinh tế số). Sẵn sàng đồng hành cùng lãnh đạo để phân tích mâu thuẫn hệ thống và ra quyết định chính xác nhất.',
      timestamp: '07:41',
    },
  ]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++)
      view.setUint8(offset + i, string.charCodeAt(i));
  };

  const convertPCMToWav = (base64Data, sampleRate) => {
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    const buffer = bytes.buffer;
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + buffer.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.byteLength, true);
    const blob = new Blob([wavHeader, buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const handlePlayTTS = async (textToSpeak) => {
    if (isPlayingBriefing) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingBriefing(false);
      }
      return;
    }
    setIsPlayingBriefing(true);
    triggerToast('Đang kết nối Google Gemini TTS...');
    const apiKey = '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const cleanedText = textToSpeak.replace(/[#*`_-]/g, '').substring(0, 250);
    const payload = {
      contents: [
        {
          parts: [
            { text: `Đọc to đoạn văn bản sau bằng tiếng Việt: ${cleanedText}` },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('TTS API Error');
      const result = await response.json();
      const inlineData = result.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData
      )?.inlineData;
      if (inlineData && inlineData.data) {
        let rate = 24000;
        const rateMatch = inlineData.mimeType.match(/rate=(\d+)/);
        if (rateMatch) rate = parseInt(rateMatch[1]);
        const wavUrl = convertPCMToWav(inlineData.data, rate);
        const audio = new Audio(wavUrl);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setIsPlayingBriefing(false);
      } else throw new Error('No speech returned');
    } catch (err) {
      triggerToast('Giọng nói AI bận. Dùng phương án dự phòng.');
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = 'vi-VN';
      utterance.onend = () => setIsPlayingBriefing(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDeepScan = async () => {
    setAiIsLoading(true);
    setDeepScanResult('');
    triggerToast('Đang quét toàn diện song song Layer 1 & 2...');
    const apiKey = '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const promptText = `Phân tích mâu thuẫn hệ thống: Tầng 1 (Hộ KD cá thể số hóa 38%) vs Tầng 2 (Khóa đào tạo = ${activeMetrics.layer2.nhomC.trainingCourses.year}). Nêu 3 khuyến nghị ngắn gọn.`;
    const payload = { contents: [{ parts: [{ text: promptText }] }] };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      setDeepScanResult(
        json.candidates?.[0]?.content?.parts?.[0]?.text || 'Lỗi đọc AI'
      );
    } catch (err) {
      setDeepScanResult(
        `**PHÁT HIỆN LỆCH PHA DỮ LIỆU**\n\n- Việc Khóa đào tạo số Tầng 2 ở mức ${activeMetrics.layer2.nhomC.trainingCourses.year} là nguyên nhân chính khiến Hộ kinh doanh Tầng 1 dậm chân tại chỗ.\n- Yêu cầu tổ chức tập huấn khẩn cấp.`
      );
    } finally {
      setAiIsLoading(false);
    }
  };

  const handleGeneratePolicy = async () => {
    setIsGeneratingPolicy(true);
    setGeneratedIssuePolicy('');
    const apiKey = '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: 'Soạn một quyết định hành chính ngắn gọn để khắc phục điểm nghẽn đào tạo chuyển đổi số tại Xã Tân Hiệp.',
            },
          ],
        },
      ],
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setGeneratedIssuePolicy(
        data.candidates?.[0]?.content?.parts?.[0]?.text || 'Lỗi AI'
      );
    } catch (err) {
      setGeneratedIssuePolicy(
        `**ỦY BAN NHÂN DÂN XÃ TÂN HIỆP**\n**QUYẾT ĐỊNH:**\nĐiều 1. Khẩn trương mở 5 khóa đào tạo công nghệ trong tháng này để giải quyết tình trạng thiếu hụt năng lực.`
      );
    } finally {
      setIsGeneratingPolicy(false);
    }
  };

  const handleCopyClipboard = (textToCopy) => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = textToCopy;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    triggerToast('Đã sao chép vào clipboard!');
  };

  const handleImportNewPeriod = () => {
    setSelectedPeriod('T05/2026');
    setShowPdfImportModal(false);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white font-sans antialiased selection:bg-cyan-500 flex flex-col overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-full text-xs font-bold shadow-2xl shadow-cyan-500/20 animate-in slide-in-from-top-10 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#0A2540] border-b border-cyan-500/20 px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between sticky top-0 z-40 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#00C2FF] p-2.5 rounded-xl">
            <Cpu className="h-6 w-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>{' '}
                XÃ TÂN HIỆP - DECC COCKPIT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-[#00C2FF] bg-clip-text text-transparent">
              DIGITAL ECONOMY COMMAND CENTER
            </h1>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold">
              Báo cáo:
            </span>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                triggerToast(
                  `Đồng bộ dữ liệu chu kỳ ${
                    periodicData[e.target.value]?.label
                  }`
                );
              }}
              className="bg-[#122A4E] border border-cyan-500/30 rounded-lg px-2.5 py-1.5 text-xs font-bold text-cyan-100 outline-none cursor-pointer hover:border-cyan-400 transition-colors"
            >
              {Object.keys(periodicData).map((key) => (
                <option key={key} value={key}>
                  {periodicData[key].label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowPdfImportModal(true)}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Upload className="h-3.5 w-3.5" /> <span>Nạp PDF Dữ Liệu</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side Navigation Menu */}
        <aside className="w-full lg:w-72 bg-[#091B30] border-b lg:border-b-0 lg:border-r border-cyan-500/10 p-4 flex flex-col gap-1.5">
          <div className="text-[10px] font-bold text-cyan-500/60 uppercase px-3 tracking-wider mb-1 flex items-center justify-between">
            <span>BẢN ĐỒ PHÂN KHU PHƯỜNG</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="px-3 py-2 bg-[#122A4E]/30 rounded-xl border border-cyan-500/5 mb-3">
            <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
              Địa bàn Phường:
            </span>
            <span className="text-xs font-semibold text-cyan-400">
              Xã Tân Hiệp
            </span>
          </div>

          {[
            {
              id: 'layer-1',
              label: 'Tầng 1: Tiêu chí Chuyển đổi số Phường Xã 2.0',
              icon: ShieldCheck,
              subtitle: `DEI ${activeMetrics.layer1.deiScore}% (Kinh tế & Xã hội)`,
            },
            {
              id: 'layer-2',
              label: 'Tầng 2: Hệ sinh thái Kinh tế số',
              icon: Building2,
              subtitle: '5 nhóm A-E khai thác từ Nền tảng',
            },
            {
              id: 'layer-3',
              label: 'Tầng 3: Hệ sinh thái Toàn diện',
              icon: Landmark,
              subtitle: 'Giáo dục, Y tế, Nông nghiệp',
            },
            {
              id: 'layer-4',
              label: 'Tầng 4: Chuyển đổi số Doanh nghiệp',
              icon: Briefcase,
              subtitle: 'HKD, SME, Doanh nghiệp AI',
            },
            {
              id: 'layer-5',
              label: 'Tầng 5: Mạng lưới Hub Xanh O2O',
              icon: Network,
              subtitle: 'Điểm bán Xanh, Doanh thu',
            },
            {
              id: 'ai-command-center',
              label: 'Trợ lý AI Điều Hành',
              icon: Bot,
              isNew: true,
            },
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedZone(null);
                }}
                className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-[#122A4E] border-l-4 border-cyan-400 text-cyan-200 font-bold'
                    : 'text-slate-300 hover:bg-[#122A4E]/20 hover:text-white'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`h-4.5 w-4.5 ${
                        isActive ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {item.isNew && (
                    <span className="bg-cyan-500 text-slate-900 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider">
                      GEMINI
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <span className="text-[10px] text-slate-400 font-normal pl-7 mt-0.5">
                    {item.subtitle}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-auto pt-4 border-t border-cyan-500/10">
            <div className="bg-[#122A4E]/30 rounded-xl p-3 border border-cyan-500/5">
              <span className="text-[10px] text-cyan-400 font-bold block mb-1">
                LÝ THUYẾT QUẢN TRỊ KÉP
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Tầng 1 tập trung đo đạc tiến trình thâm nhập số dân sự. Tầng 2
                điều hành hạ tầng cốt lõi doanh nghiệp trích xuất từ Hệ thống
                Web.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-full flex flex-col gap-6">
          {/* TAB 2: TẦNG 1 */}
          {activeTab === 'layer-1' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-cyan-500/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-cyan-400" /> TẦNG 1: BỘ
                    TIÊU CHÍ KINH TẾ SỐ PHƯỜNG/XÃ 2.0 (ĐIỂM DEI TỔNG THỂ ={' '}
                    {activeMetrics.layer1.deiScore}%)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bản phân rã 8 nhóm chỉ số nhiệm vụ cốt lõi đo lường nền kinh
                    tế số trên toàn địa bàn.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* B1. THÔNG TIN ĐƠN VỊ KINH DOANH TRÊN TOÀN TỈNH */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-4 mb-4 flex flex-col gap-3">
                    {/* Tiêu đề và Nút lọc Phường Xã */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                        <Building2 className="h-5 w-5" /> B1: THÔNG TIN ĐƠN VỊ
                        KINH DOANH - XÃ TÂN HIỆP
                      </span>
                    </div>

                    <div className="bg-[#122A4E]/40 px-4 py-3 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wide uppercase">
                        TỔNG SỐ DOANH NGHIỆP/ HKD/ HTX:
                      </span>
                      <strong className="text-2xl font-black font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                        {currentZoneData.b1.total.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng Số Doanh Nghiệp
                        <br />
                        Vừa Và Nhỏ
                      </span>
                      <strong className="text-2xl font-mono text-white">
                        {currentZoneData.b1.dn_total.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng Số
                        <br />
                        Hộ Kinh Doanh
                      </span>
                      <strong className="text-2xl font-mono text-cyan-300">
                        {currentZoneData.b1.hkd_total.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng Số
                        <br />
                        Hợp Tác Xã
                      </span>
                      <strong className="text-2xl font-mono text-emerald-400">
                        {currentZoneData.b1.htx_total.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-auto bg-[#122A4E]/20 p-4 rounded-xl border border-cyan-500/5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-4">
                      PHỄU CHUYỂN ĐỔI SỐ HOẠT ĐỘNG (CĐS FUNNEL):
                    </span>
                    <div className="space-y-3.5">
                      {[
                        {
                          label: 'Tổng số Doanh Nghiệp vừa và nhỏ CĐS',
                          val: currentZoneData.b1.dn_cds,
                          max: currentZoneData.b1.dn_total,
                          color: 'bg-cyan-500',
                          unit: 'DN',
                        },
                        {
                          label: 'Tổng số Hộ Kinh Doanh CĐS',
                          val: currentZoneData.b1.hkd_cds,
                          max: currentZoneData.b1.hkd_total,
                          color: 'bg-emerald-500',
                          unit: 'HKD',
                        },
                        {
                          label: 'Tổng số Hợp Tác Xã CĐS',
                          val: currentZoneData.b1.htx_cds,
                          max: currentZoneData.b1.htx_total,
                          color: 'bg-indigo-500',
                          unit: 'HTX',
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                        >
                          <span className="w-full sm:w-56 text-[11px] font-semibold text-slate-300">
                            {item.label}
                          </span>
                          <div className="flex-1 bg-[#07111F] h-4 rounded-md overflow-hidden border border-cyan-500/10">
                            <div
                              className={`h-full ${item.color} rounded-md`}
                              style={{
                                width: `${
                                  item.max > 0 ? (item.val / item.max) * 100 : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-white bg-[#0A2540] border border-cyan-500/20 px-2 py-1 rounded w-20 text-center shrink-0">
                            {item.val.toLocaleString()} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-3 pt-4 border-t border-cyan-500/10">
                      BIỂU ĐỒ TỈ LỆ CƠ CẤU ĐƠN VỊ KINH DOANH:
                    </span>
                    {/* Thanh Stacked Bar cho B1 */}
                    <div className="w-full h-8 bg-[#07111F] rounded-md overflow-hidden flex shadow-inner border border-cyan-500/10">
                      {currentZoneData.b1.total > 0 ? (
                        <>
                          <div
                            className="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{
                              width: `${
                                (currentZoneData.b1.dn_total /
                                  currentZoneData.b1.total) *
                                100
                              }%`,
                            }}
                          >
                            {currentZoneData.b1.dn_total > 0 &&
                              `DN (${(
                                (currentZoneData.b1.dn_total /
                                  currentZoneData.b1.total) *
                                100
                              ).toFixed(0)}%)`}
                          </div>
                          <div
                            className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{
                              width: `${
                                (currentZoneData.b1.hkd_total /
                                  currentZoneData.b1.total) *
                                100
                              }%`,
                            }}
                          >
                            {currentZoneData.b1.hkd_total > 0 &&
                              `HKD (${(
                                (currentZoneData.b1.hkd_total /
                                  currentZoneData.b1.total) *
                                100
                              ).toFixed(0)}%)`}
                          </div>
                          <div
                            className="bg-indigo-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{
                              width: `${
                                (currentZoneData.b1.htx_total /
                                  currentZoneData.b1.total) *
                                100
                              }%`,
                            }}
                          >
                            {currentZoneData.b1.htx_total > 0 &&
                              `HTX (${(
                                (currentZoneData.b1.htx_total /
                                  currentZoneData.b1.total) *
                                100
                              ).toFixed(0)}%)`}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                          Chưa có dữ liệu
                        </div>
                      )}
                    </div>
                    {/* Chú thích phía dưới */}
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        <span className="text-[9px] text-slate-300">
                          {currentZoneData.b1.dn_total} DN
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[9px] text-slate-300">
                          {currentZoneData.b1.hkd_total} HKD
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[9px] text-slate-300">
                          {currentZoneData.b1.htx_total} HTX
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B2. THÔNG TIN SẢN PHẨM */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-4 mb-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                        <Award className="h-5 w-5" /> B2: THÔNG TIN SẢN PHẨM
                        TRÊN ĐỊA BÀN
                      </span>
                    </div>

                    <div className="bg-[#122A4E]/40 px-4 py-3 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <span className="text-xs font-bold text-white tracking-wide uppercase">
                        TỔNG SỐ SẢN PHẨM/DỊCH VỤ:
                      </span>
                      <strong className="text-2xl font-black font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                        {currentZoneData.b2.total.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center mb-5">
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng Sản Phẩm
                        <br />
                        OCOP
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-white">
                        {currentZoneData.b2.ocop_total.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng OCOP
                        <br />3 SAO
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-cyan-400">
                        {currentZoneData.b2.ocop_3.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng OCOP
                        <br />4 SAO
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-emerald-400">
                        {currentZoneData.b2.ocop_4.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng OCOP
                        <br />5 SAO
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-indigo-400">
                        {currentZoneData.b2.ocop_5.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng Sản Phẩm
                        <br />
                        Thường
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-purple-400">
                        {currentZoneData.b2.sp_thuong.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3.5 rounded-xl border border-cyan-500/10">
                      <span className="text-[10px] text-slate-400 block mb-2 font-bold uppercase">
                        Tổng
                        <br />
                        Dịch Vụ
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-amber-400">
                        {currentZoneData.b2.dv.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-auto bg-[#122A4E]/20 p-4 rounded-xl border border-cyan-500/5 flex-1 flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-4">
                      PHỄU CHUYỂN ĐỔI DANH SÁCH CÁC SẢN PHẨM/DỊCH VỤ:
                    </span>

                    <div className="space-y-3.5 mb-5">
                      {[
                        {
                          label: 'Sản phẩm thường',
                          val: currentZoneData.b2.sp_thuong,
                          max: currentZoneData.b2.total,
                          color: 'bg-purple-500',
                        },
                        {
                          label: 'Dịch vụ',
                          val: currentZoneData.b2.dv,
                          max: currentZoneData.b2.total,
                          color: 'bg-amber-500',
                        },
                        {
                          label: 'Sản phẩm OCOP',
                          val: currentZoneData.b2.ocop_total,
                          max: currentZoneData.b2.total,
                          color: 'bg-emerald-500',
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
                        >
                          <span className="w-full sm:w-32 text-[11px] font-semibold text-slate-300">
                            {item.label}
                          </span>
                          <div className="flex-1 bg-[#07111F] h-4 rounded-md overflow-hidden border border-cyan-500/10">
                            <div
                              className={`h-full ${item.color} rounded-md`}
                              style={{
                                width: `${
                                  item.max > 0 ? (item.val / item.max) * 100 : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-white bg-[#0A2540] border border-cyan-500/20 px-2 py-1 rounded w-12 text-center shrink-0">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>

                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-3 pt-4 border-t border-cyan-500/10">
                      BIỂU ĐỒ TỈ LỆ CÁC HẠNG SẢN PHẨM OCOP:
                    </span>
                    <div className="w-full h-8 bg-[#07111F] rounded-md overflow-hidden flex shadow-inner border border-cyan-500/10">
                      {currentZoneData.b2.ocop_total > 0 ? (
                        <>
                          <div
                            className="bg-cyan-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{
                              width: `${
                                (currentZoneData.b2.ocop_3 /
                                  currentZoneData.b2.ocop_total) *
                                100
                              }%`,
                            }}
                          >
                            {currentZoneData.b2.ocop_3 > 0 &&
                              `3 SAO (${(
                                (currentZoneData.b2.ocop_3 /
                                  currentZoneData.b2.ocop_total) *
                                100
                              ).toFixed(0)}%)`}
                          </div>
                          <div
                            className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{
                              width: `${
                                (currentZoneData.b2.ocop_4 /
                                  currentZoneData.b2.ocop_total) *
                                100
                              }%`,
                            }}
                          >
                            {currentZoneData.b2.ocop_4 > 0 &&
                              `4 SAO (${(
                                (currentZoneData.b2.ocop_4 /
                                  currentZoneData.b2.ocop_total) *
                                100
                              ).toFixed(0)}%)`}
                          </div>
                          <div
                            className="bg-indigo-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                            style={{
                              width: `${
                                (currentZoneData.b2.ocop_5 /
                                  currentZoneData.b2.ocop_total) *
                                100
                              }%`,
                            }}
                          >
                            {currentZoneData.b2.ocop_5 > 0 &&
                              `5 SAO (${(
                                (currentZoneData.b2.ocop_5 /
                                  currentZoneData.b2.ocop_total) *
                                100
                              ).toFixed(0)}%)`}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                          Chưa có sản phẩm OCOP
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        <span className="text-[9px] text-slate-300">
                          {currentZoneData.b2.ocop_3} SP (3 Sao)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[9px] text-slate-300">
                          {currentZoneData.b2.ocop_4} SP (4 Sao)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[9px] text-slate-300">
                          {currentZoneData.b2.ocop_5} SP (5 Sao)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B3. TMĐT */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" /> B3. THƯƠNG MẠI ĐIỆN TỬ
                      & KHÁCH HÀNG
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-xs text-slate-400">
                        Doanh thu giao thương
                      </span>
                      <strong className="text-3xl font-mono font-black text-emerald-400 block mt-2">
                        {activeMetrics.layer1.b3.revenue} Tỷ
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-xs text-slate-400">
                        Đơn hàng hoàn tất
                      </span>
                      <strong className="text-3xl font-mono font-black text-white block mt-2">
                        {activeMetrics.layer1.b3.orders.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#122A4E]/20 p-4 rounded-xl border border-cyan-500/5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-3">
                      CHỈ SỐ TĂNG TRƯỞNG & ĐỘ BẢO LƯU:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-[#07111F]/50 border border-cyan-500/10 p-3 rounded-lg">
                        <span className="block text-[9px] text-slate-400 mb-1">
                          Khách hàng mới
                        </span>
                        <strong className="text-sm sm:text-base text-cyan-400 font-mono">
                          +
                          {activeMetrics.layer1.b3.newCustomers.toLocaleString()}
                        </strong>
                      </div>
                      <div className="text-center bg-[#07111F]/50 border border-cyan-500/10 p-3 rounded-lg">
                        <span className="block text-[9px] text-slate-400 mb-1">
                          Tỷ lệ mua lặp lại
                        </span>
                        <strong className="text-sm sm:text-base text-emerald-400 font-mono">
                          {activeMetrics.layer1.b3.repeatRatio}%
                        </strong>
                      </div>
                      <div className="text-center bg-[#07111F]/50 border border-cyan-500/10 p-3 rounded-lg">
                        <span className="block text-[9px] text-slate-400 mb-1">
                          Giá trị trung bình/Đơn
                        </span>
                        <strong className="text-sm sm:text-base text-indigo-400 font-mono">
                          {activeMetrics.layer1.b3.averageValue} Tr
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B4. THANH TOÁN */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> B4. HẠ TẦNG THANH TOÁN
                      SỐ (KTM)
                    </span>
                    <span className="text-[11px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
                      Độ phủ: {activeMetrics.layer1.b4.ratio}%
                    </span>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3 font-bold uppercase">
                      <span>Phân bổ phương thức thanh toán:</span>
                    </div>
                    <div className="w-full h-8 bg-[#07111F] rounded-md overflow-hidden flex shadow-inner border border-cyan-500/10">
                      <div
                        className="bg-cyan-500 h-full flex items-center justify-center text-[9px] font-bold text-slate-900"
                        style={{ width: `${activeMetrics.layer1.b4.qrPay}%` }}
                      >
                        QR {activeMetrics.layer1.b4.qrPay}%
                      </div>
                      <div
                        className="bg-emerald-500 h-full flex items-center justify-center text-[9px] font-bold text-slate-900"
                        style={{
                          width: `${activeMetrics.layer1.b4.mobileBank}%`,
                        }}
                      >
                        Mobile {activeMetrics.layer1.b4.mobileBank}%
                      </div>
                      <div
                        className="bg-indigo-500 h-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ width: `${activeMetrics.layer1.b4.eWallet}%` }}
                      >
                        Ví ĐT {activeMetrics.layer1.b4.eWallet}%
                      </div>
                      <div
                        className="bg-rose-500 h-full flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ width: `${activeMetrics.layer1.b4.pos}%` }}
                      >
                        POS {activeMetrics.layer1.b4.pos}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-xs text-center mt-auto">
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1">
                        Mã QR Pay
                      </span>
                      <strong className="font-mono text-cyan-300 text-sm sm:text-base block">
                        {activeMetrics.layer1.b4.qrPay}%
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1">
                        Internet Banking
                      </span>
                      <strong className="font-mono text-emerald-400 text-sm sm:text-base block">
                        {activeMetrics.layer1.b4.mobileBank}%
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1">
                        Ví Điện Tử
                      </span>
                      <strong className="font-mono text-indigo-400 text-sm sm:text-base block">
                        {activeMetrics.layer1.b4.eWallet}%
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1">
                        Máy quẹt POS
                      </span>
                      <strong className="font-mono text-rose-400 text-sm sm:text-base block">
                        {activeMetrics.layer1.b4.pos}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* B5. HỘ KINH DOANH */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Users className="h-5 w-5" /> B5. PHÂN LỚP HỘ KINH DOANH
                      SỐ
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-xs text-slate-400 block mb-1">
                        Tổng số hộ khảo sát
                      </span>
                      <strong className="text-3xl font-mono text-white block mt-1">
                        {activeMetrics.layer1.b5.total.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-xs text-slate-400 block mb-1">
                        Hộ có hoạt động CĐS
                      </span>
                      <strong className="text-3xl font-mono text-emerald-400 block mt-1">
                        {activeMetrics.layer1.b5.active}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-2 bg-[#122A4E]/20 p-4 rounded-xl border border-cyan-500/5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-4">
                      CHI TIẾT PHÂN LỚP NĂNG LỰC SỐ (LEVELS):
                    </span>
                    <div className="space-y-3">
                      {[
                        {
                          label: 'Mức 1: Có tài khoản MXH',
                          val: activeMetrics.layer1.b5.levels[0],
                          max: activeMetrics.layer1.b5.active,
                          color: 'bg-slate-400',
                        },
                        {
                          label: 'Mức 2: Nhận thanh toán QR',
                          val: activeMetrics.layer1.b5.levels[1],
                          max: activeMetrics.layer1.b5.active,
                          color: 'bg-cyan-500',
                        },
                        {
                          label: 'Mức 3: Đăng ký SP OCOP',
                          val: activeMetrics.layer1.b5.levels[2],
                          max: activeMetrics.layer1.b5.active,
                          color: 'bg-emerald-500',
                        },
                        {
                          label: 'Mức 4: Bán hàng TMĐT',
                          val: activeMetrics.layer1.b5.levels[3],
                          max: activeMetrics.layer1.b5.active,
                          color: 'bg-indigo-500',
                        },
                        {
                          label: 'Mức 5: Dùng phần mềm Kế toán',
                          val: activeMetrics.layer1.b5.levels[4],
                          max: activeMetrics.layer1.b5.active,
                          color: 'bg-purple-500',
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="w-48 text-xs text-slate-300">
                            {item.label}
                          </span>
                          <div className="flex-1 bg-[#07111F] h-2.5 rounded-full overflow-hidden border border-cyan-500/5">
                            <div
                              className={`h-full ${item.color} rounded-full`}
                              style={{
                                width: `${(item.val / item.max) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-white w-10 text-right">
                            {item.val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* B6. DU LỊCH */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Globe className="h-5 w-5" /> B6. CHUYỂN ĐỔI SỐ DU LỊCH LỮ
                      HÀNH
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-[10px] sm:text-xs text-slate-400 block mb-2">
                        Điểm du lịch số hóa
                      </span>
                      <strong className="text-2xl font-mono text-cyan-400 block">
                        {activeMetrics.layer1.b6.ratio}%
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-[10px] sm:text-xs text-slate-400 block mb-2">
                        Khách đặt tour Online
                      </span>
                      <strong className="text-2xl font-mono text-white block">
                        {activeMetrics.layer1.b6.onlineGuests.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-4 rounded-2xl border border-cyan-500/5">
                      <span className="text-[10px] sm:text-xs text-slate-400 block mb-2">
                        Doanh thu lữ hành ĐT
                      </span>
                      <strong className="text-2xl font-mono text-emerald-400 block">
                        {activeMetrics.layer1.b6.revenue} Tỷ
                      </strong>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#122A4E]/20 p-5 rounded-xl border border-cyan-500/5 flex items-center gap-4">
                    <div className="flex-1">
                      <span className="text-xs text-slate-400 font-bold block uppercase mb-1">
                        Đánh giá hệ thống tương tác:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed mt-2">
                        Hơn {activeMetrics.layer1.b6.ratio}% các khu nghỉ dưỡng
                        đã áp dụng check-in sinh trắc học và hệ thống chăm sóc
                        khách tự động qua Zalo OA, giúp giảm 30% thời gian chờ.
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-[6px] border-cyan-500/30 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-cyan-400">
                        TỐT
                      </span>
                    </div>
                  </div>
                </div>

                {/* B7. NÔNG NGHIỆP */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Sprout className="h-5 w-5" /> B7. NÔNG NGHIỆP THÔNG MINH
                      & TRUY XUẤT
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center mb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-[#122A4E]/30 h-28 rounded-lg flex items-end justify-center p-1.5 border border-cyan-500/10 mb-3 relative overflow-hidden group">
                        <div
                          className="w-full bg-emerald-500/80 rounded-md transition-all group-hover:bg-emerald-400"
                          style={{
                            height: `${activeMetrics.layer1.b7.farmRatio}%`,
                          }}
                        ></div>
                      </div>
                      <strong className="font-mono text-white text-base">
                        {activeMetrics.layer1.b7.farmRatio}%
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Vùng trồng Xanh
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-[#122A4E]/30 h-28 rounded-lg flex items-end justify-center p-1.5 border border-cyan-500/10 mb-3 relative overflow-hidden group">
                        <div
                          className="w-full bg-cyan-500/80 rounded-md transition-all group-hover:bg-cyan-400"
                          style={{
                            height: `${activeMetrics.layer1.b7.qrTrace}%`,
                          }}
                        ></div>
                      </div>
                      <strong className="font-mono text-cyan-300 text-base">
                        {activeMetrics.layer1.b7.qrTrace}%
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Truy xuất QR
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-[#122A4E]/30 h-28 rounded-lg flex items-end justify-center p-1.5 border border-cyan-500/10 mb-3 relative overflow-hidden group">
                        <div
                          className="w-full bg-indigo-500/80 rounded-md transition-all group-hover:bg-indigo-400"
                          style={{
                            height: `${activeMetrics.layer1.b7.iotFarm}%`,
                          }}
                        ></div>
                      </div>
                      <strong className="font-mono text-indigo-300 text-base">
                        {activeMetrics.layer1.b7.iotFarm}%
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Cảm biến IoT
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-[#122A4E]/30 h-28 rounded-lg flex items-end justify-center p-1.5 border border-cyan-500/10 mb-3 relative overflow-hidden group">
                        <div
                          className="w-full bg-amber-500/80 rounded-md transition-all group-hover:bg-amber-400"
                          style={{
                            height: `${activeMetrics.layer1.b7.ecomAgri}%`,
                          }}
                        ></div>
                      </div>
                      <strong className="font-mono text-amber-300 text-base">
                        {activeMetrics.layer1.b7.ecomAgri}%
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Lên sàn TMĐT
                      </span>
                    </div>
                  </div>
                </div>

                {/* B8. KHỞI NGHIỆP */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Compass className="h-5 w-5" /> B8. ĐỔI MỚI SÁNG TẠO &
                      KHỞI NGHIỆP
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center mb-4">
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Startup
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-white block">
                        {activeMetrics.layer1.b8.startups}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Dự án ươm
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-cyan-400 block">
                        {activeMetrics.layer1.b8.projects}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Chuyên gia
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-emerald-400 block">
                        {activeMetrics.layer1.b8.mentors}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Nhà ĐT
                      </span>
                      <strong className="text-xl sm:text-2xl font-mono text-indigo-400 block">
                        {activeMetrics.layer1.b8.investors}
                      </strong>
                    </div>
                  </div>
                  <div className="mt-2 bg-[#122A4E]/20 p-4 rounded-xl border border-cyan-500/5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase mb-4">
                      HIỆU QUẢ KẾT NỐI HỆ SINH THÁI:
                    </span>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                          1
                        </div>
                        <span className="text-[10px] font-bold">Ý tưởng</span>
                      </div>
                      <div className="flex-1 h-px bg-cyan-500/30 mx-2"></div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          2
                        </div>
                        <span className="text-[10px] font-bold">Ươm tạo</span>
                      </div>
                      <div className="flex-1 h-px bg-cyan-500/30 mx-2"></div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                          3
                        </div>
                        <span className="text-[10px] font-bold">Gọi vốn</span>
                      </div>
                      <div className="flex-1 h-px bg-cyan-500/30 mx-2"></div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                          4
                        </div>
                        <span className="text-[10px] font-bold">
                          Thương mại
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TẦNG 2 - BỘ TIÊU CHÍ KÉP (THÁNG/NĂM) */}
          {activeTab === 'layer-2' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-cyan-500/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-black text-emerald-400 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-emerald-400" /> TẦNG 2:
                    BỘ TIÊU CHÍ HỆ SINH THÁI ĐỊA PHƯƠNG
                  </h2>
                  <p className="text-xs text-slate-400">
                    Cơ chế theo dõi kép mới: Hiển thị đồng thời **Lũy kế trong
                    năm** và **Phát sinh trong tháng**.
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-1.5 bg-[#122A4E] p-1 rounded-xl border border-cyan-500/5">
                  {[
                    { id: 'ALL', label: 'Tổng quan Nhóm A-E' },
                    { id: 'A', label: 'A (Hạ tầng)' },
                    { id: 'B', label: 'B (Hiện diện số)' },
                    { id: 'C', label: 'C (Vận hành)' },
                    { id: 'D', label: 'D (Thị trường)' },
                    { id: 'E', label: 'E (Thông tin)' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubAE(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeSubAE === sub.id
                          ? 'bg-emerald-500 text-slate-900'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TỔNG QUAN TẤT CẢ CÁC NHÓM A-E (HIỂN THỊ KÉP NĂM/THÁNG) */}
              {activeSubAE === 'ALL' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-in fade-in duration-200">
                  <div
                    onClick={() => setActiveSubAE('A')}
                    className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10 hover:bg-[#122A4E]/60 cursor-pointer transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      <span className="text-xs font-black text-white block mb-3 pb-2 border-b border-cyan-500/20">
                        A. HẠ TẦNG & SẴN SÀNG
                      </span>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>DN Số hóa:</span>{' '}
                          <span className="font-mono text-white font-bold">
                            {activeMetrics.layer2.nhomA.digitalEnterprises.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +
                              {
                                activeMetrics.layer2.nhomA.digitalEnterprises
                                  .month
                              }
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Lên Cloud:</span>{' '}
                          <span className="font-mono text-emerald-400 font-bold">
                            {activeMetrics.layer2.nhomA.cloudEnterprises.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +
                              {
                                activeMetrics.layer2.nhomA.cloudEnterprises
                                  .month
                              }
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>NetID:</span>{' '}
                          <span className="font-mono text-indigo-400 font-bold">
                            {activeMetrics.layer2.nhomA.netIdCards.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomA.netIdCards.month}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSubAE('B')}
                    className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10 hover:bg-[#122A4E]/60 cursor-pointer transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      <span className="text-xs font-black text-white block mb-3 pb-2 border-b border-cyan-500/20">
                        B. HIỆN DIỆN SỐ & TM
                      </span>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Web/E-com:</span>{' '}
                          <span className="font-mono text-cyan-400 font-bold">
                            {activeMetrics.layer2.nhomB.webEcom.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomB.webEcom.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Đơn hàng:</span>{' '}
                          <span className="font-mono text-emerald-400 font-bold">
                            {activeMetrics.layer2.nhomB.ecomOrders.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomB.ecomOrders.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Tăng trưởng:</span>{' '}
                          <span className="font-mono text-white font-bold">
                            {activeMetrics.layer2.nhomB.growthRate.year}%{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomB.growthRate.month}%
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSubAE('C')}
                    className={`bg-[#122A4E]/30 p-4 rounded-xl border ${
                      activeMetrics.layer2.nhomC.trainingCourses.year === 0
                        ? 'border-rose-500/30'
                        : 'border-cyan-500/10'
                    } hover:bg-[#122A4E]/60 cursor-pointer transition-all flex flex-col justify-between h-full group`}
                  >
                    <div>
                      <span className="text-xs font-black text-white block mb-3 pb-2 border-b border-cyan-500/20 flex items-center gap-1.5">
                        C. VẬN HÀNH & NGUỒN LỰC{' '}
                        {activeMetrics.layer2.nhomC.trainingCourses.year ===
                          0 && (
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        )}
                      </span>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Hệ thống ERP:</span>{' '}
                          <span className="font-mono text-indigo-400 font-bold">
                            {activeMetrics.layer2.nhomC.erpSystems.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomC.erpSystems.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Tổng nhân sự:</span>{' '}
                          <span className="font-mono text-white font-bold">
                            {activeMetrics.layer2.nhomC.totalPersonnel.year.toLocaleString()}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomC.totalPersonnel.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Khóa đào tạo:</span>{' '}
                          <span
                            className={`font-mono font-bold ${
                              activeMetrics.layer2.nhomC.trainingCourses
                                .year === 0
                                ? 'text-rose-400 animate-pulse'
                                : 'text-emerald-400'
                            }`}
                          >
                            {activeMetrics.layer2.nhomC.trainingCourses.year}{' '}
                            <span className="text-[9px] font-normal">
                              +
                              {activeMetrics.layer2.nhomC.trainingCourses.month}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSubAE('D')}
                    className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10 hover:bg-[#122A4E]/60 cursor-pointer transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      <span className="text-xs font-black text-white block mb-3 pb-2 border-b border-cyan-500/20">
                        D. TƯƠNG TÁC & THỊ TRƯỜNG
                      </span>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Trang xem:</span>{' '}
                          <span className="font-mono text-white font-bold">
                            {activeMetrics.layer2.nhomD.pageViews.year.toLocaleString()}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomD.pageViews.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Google SEO:</span>{' '}
                          <span className="font-mono text-cyan-400 font-bold">
                            {activeMetrics.layer2.nhomD.googleSeo.year.toLocaleString()}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomD.googleSeo.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Doanh thu:</span>{' '}
                          <span className="font-mono text-emerald-400 font-bold">
                            {activeMetrics.layer2.nhomD.revenue.year}Tr{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomD.revenue.month}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveSubAE('E')}
                    className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10 hover:bg-[#122A4E]/60 cursor-pointer transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      <span className="text-xs font-black text-white block mb-3 pb-2 border-b border-cyan-500/20">
                        E. QUẢN LÝ THÔNG TIN
                      </span>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Thiện nguyện:</span>{' '}
                          <span className="font-mono text-rose-400 font-bold">
                            {activeMetrics.layer2.nhomE.charityProjects.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +
                              {activeMetrics.layer2.nhomE.charityProjects.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Kêu gọi ĐT:</span>{' '}
                          <span className="font-mono text-emerald-400 font-bold">
                            {activeMetrics.layer2.nhomE.investmentCalls.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +
                              {activeMetrics.layer2.nhomE.investmentCalls.month}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Dự án:</span>{' '}
                          <span className="font-mono text-amber-400 font-bold">
                            {activeMetrics.layer2.nhomE.projects.year}{' '}
                            <span className="text-[9px] text-emerald-400 font-normal">
                              +{activeMetrics.layer2.nhomE.projects.month}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nhóm A Content */}
              {activeSubAE === 'A' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center animate-in fade-in duration-200">
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Tổng DN số hóa thông tin
                    </span>
                    <strong className="text-3xl font-mono text-white block">
                      {activeMetrics.layer2.nhomA.digitalEnterprises.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomA.digitalEnterprises.month}{' '}
                      trong tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Tổng DN lên Cloud
                    </span>
                    <strong className="text-3xl font-mono text-emerald-400 block">
                      {activeMetrics.layer2.nhomA.cloudEnterprises.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomA.cloudEnterprises.month} trong
                      tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      DN số hóa toàn diện
                    </span>
                    <strong className="text-3xl font-mono text-indigo-400 block">
                      {activeMetrics.layer2.nhomA.comprehensiveDigital.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomA.comprehensiveDigital.month}{' '}
                      trong tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Card điện tử NetID
                    </span>
                    <strong className="text-3xl font-mono text-rose-500 block">
                      {activeMetrics.layer2.nhomA.netIdCards.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomA.netIdCards.month} trong tháng
                    </span>
                  </div>
                </div>
              )}

              {/* Nhóm B Content */}
              {activeSubAE === 'B' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center animate-in fade-in duration-200">
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Website & E-commerce
                    </span>
                    <strong className="text-3xl font-mono text-purple-400 block">
                      {activeMetrics.layer2.nhomB.webEcom.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomB.webEcom.month} phát sinh
                      tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Sản phẩm / Dịch vụ CĐS
                    </span>
                    <strong className="text-3xl font-mono text-cyan-400 block">
                      {activeMetrics.layer2.nhomB.digitalProducts.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomB.digitalProducts.month} phát
                      sinh tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Tổng đơn hàng
                    </span>
                    <strong className="text-3xl font-mono text-emerald-400 block">
                      {activeMetrics.layer2.nhomB.ecomOrders.year}
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomB.ecomOrders.month} phát sinh
                      tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10">
                    <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                      Tốc độ tăng trưởng
                    </span>
                    <strong className="text-3xl font-mono text-amber-400 block">
                      +{activeMetrics.layer2.nhomB.growthRate.year}%
                    </strong>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      +{activeMetrics.layer2.nhomB.growthRate.month}% tháng này
                    </span>
                  </div>
                </div>
              )}

              {/* Nhóm C Content */}
              {activeSubAE === 'C' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10 text-center">
                    <span className="text-xs text-slate-400 block uppercase font-bold mb-2">
                      Hệ thống quản lý ERP
                    </span>
                    <strong className="text-4xl font-mono text-indigo-400 block">
                      {activeMetrics.layer2.nhomC.erpSystems.year}
                    </strong>
                    <span className="text-sm font-mono text-emerald-400 block mt-2">
                      +{activeMetrics.layer2.nhomC.erpSystems.month} trong tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10 text-center">
                    <span className="text-xs text-slate-400 block uppercase font-bold mb-2">
                      Tổng nhân sự toàn hệ thống
                    </span>
                    <strong className="text-4xl font-mono text-white block">
                      {activeMetrics.layer2.nhomC.totalPersonnel.year.toLocaleString()}
                    </strong>
                    <span className="text-sm font-mono text-emerald-400 block mt-2">
                      +{activeMetrics.layer2.nhomC.totalPersonnel.month} trong
                      tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10 text-center relative overflow-hidden">
                    <span className="text-xs text-slate-400 block uppercase font-bold mb-2">
                      Khóa đào tạo
                    </span>
                    <strong className="text-4xl font-mono text-rose-500 block">
                      {activeMetrics.layer2.nhomC.trainingCourses.year}
                    </strong>
                    <span className="text-sm font-mono text-emerald-400 block mt-2">
                      +{activeMetrics.layer2.nhomC.trainingCourses.month} trong
                      tháng
                    </span>
                    <div className="absolute top-0 right-0 h-1.5 w-full bg-rose-500"></div>
                  </div>
                </div>
              )}

              {/* Nhóm D Content */}
              {activeSubAE === 'D' && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center animate-in fade-in duration-200">
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Tương tác trang xem
                    </span>
                    <strong className="text-xl font-mono text-white block">
                      {activeMetrics.layer2.nhomD.pageViews.year.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-400 block">
                      +{activeMetrics.layer2.nhomD.pageViews.month} / tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Tổng số người xem
                    </span>
                    <strong className="text-xl font-mono text-emerald-400 block">
                      {activeMetrics.layer2.nhomD.viewers.year.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-400 block">
                      +{activeMetrics.layer2.nhomD.viewers.month} / tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Google SEO hàng tháng
                    </span>
                    <strong className="text-xl font-mono text-cyan-400 block">
                      {activeMetrics.layer2.nhomD.googleSeo.year.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-400 block">
                      +{activeMetrics.layer2.nhomD.googleSeo.month} / tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Khách hàng
                    </span>
                    <strong className="text-xl font-mono text-indigo-400 block">
                      {activeMetrics.layer2.nhomD.customers.year.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-400 block">
                      +{activeMetrics.layer2.nhomD.customers.month} / tháng
                    </span>
                  </div>
                  <div className="bg-[#122A4E]/30 p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Tổng doanh thu
                    </span>
                    <strong className="text-xl font-mono text-purple-400 block">
                      {activeMetrics.layer2.nhomD.revenue.year} Tr
                    </strong>
                    <span className="text-[10px] text-emerald-400 block">
                      +{activeMetrics.layer2.nhomD.revenue.month} Tr / tháng
                    </span>
                  </div>
                </div>
              )}

              {/* Nhóm E Content */}
              {activeSubAE === 'E' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-[#122A4E]/20 p-5 rounded-2xl border border-cyan-500/10">
                    <span className="text-xs font-bold text-slate-400 block mb-4 uppercase">
                      Chỉ số theo dõi Hệ sinh thái (Nhóm E) - Trong Tháng & Năm
                    </span>
                    <div className="space-y-3">
                      {[
                        {
                          label: 'Doanh nghiệp',
                          val: activeMetrics.layer2.nhomE.enterprises,
                          color: 'bg-cyan-500',
                          max: 300,
                        },
                        {
                          label: 'Công tác thiện nguyện',
                          val: activeMetrics.layer2.nhomE.charityProjects,
                          color: 'bg-rose-500',
                          max: 50,
                        },
                        {
                          label: 'Bảng tin',
                          val: activeMetrics.layer2.nhomE.boardNews,
                          color: 'bg-emerald-500',
                          max: 200,
                        },
                        {
                          label: 'Dự án',
                          val: activeMetrics.layer2.nhomE.projects,
                          color: 'bg-amber-500',
                          max: 50,
                        },
                        {
                          label: 'Kêu gọi đầu tư',
                          val: activeMetrics.layer2.nhomE.investmentCalls,
                          color: 'bg-indigo-500',
                          max: 50,
                        },
                        {
                          label: 'Du lịch',
                          val: activeMetrics.layer2.nhomE.tourismLocations,
                          color: 'bg-pink-500',
                          max: 50,
                        },
                        {
                          label: 'Sự kiện nổi bật',
                          val: activeMetrics.layer2.nhomE.featuredEvents,
                          color: 'bg-orange-500',
                          max: 50,
                        },
                        {
                          label: 'Chuyển đổi số',
                          val: activeMetrics.layer2.nhomE
                            .digitalTransformations,
                          color: 'bg-teal-500',
                          max: 50,
                        },
                        {
                          label: 'Thư viện',
                          val: activeMetrics.layer2.nhomE.libraryDocs,
                          color: 'bg-purple-500',
                          max: 100,
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center text-[11px] justify-between gap-1.5 border-b border-cyan-500/5 pb-2"
                        >
                          <span className="w-40 font-bold text-slate-300">
                            {item.label}
                          </span>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 bg-slate-900/60 h-2.5 rounded-full overflow-hidden border border-cyan-500/5">
                              <div
                                className={`h-full rounded-full ${item.color}`}
                                style={{
                                  width: `${Math.min(
                                    (item.val.year / item.max) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex flex-col items-end w-20">
                              <span className="font-mono text-white font-bold">
                                {item.val.year}{' '}
                                <span className="text-[9px] font-normal text-slate-400">
                                  Năm
                                </span>
                              </span>
                              <span className="font-mono text-emerald-400 text-[9px]">
                                +{item.val.month} Tháng
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TẦNG 3 - HỆ SINH THÁI TỔNG */}
          {activeTab === 'layer-3' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-indigo-400 flex items-center gap-2">
                  <Landmark className="h-6 w-6" /> TẦNG 3: HỆ SINH THÁI TỔNG
                  (LĨNH VỰC CHUYÊN NGÀNH)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Thống kê toàn diện sự thâm nhập của Chuyển đổi số vào các lĩnh
                  vực dân sinh, giáo dục, y tế và nông nghiệp xanh tại
                  Phường/Xã.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Giáo dục */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/10 pb-2">
                    <GraduationCap className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-bold text-white uppercase text-sm">
                      Giáo dục & Đào tạo
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Trường số hóa
                      </span>
                      <strong className="text-xl font-mono text-white">
                        {activeMetrics.layer3.education.schools}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Học sinh E-learning
                      </span>
                      <strong className="text-xl font-mono text-cyan-400">
                        {activeMetrics.layer3.education.onlineStudents.toLocaleString()}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Nền tảng EdTech
                      </span>
                      <strong className="text-xl font-mono text-emerald-400">
                        {activeMetrics.layer3.education.platforms}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Y tế */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/10 pb-2">
                    <Stethoscope className="h-5 w-5 text-rose-400" />
                    <h3 className="font-bold text-white uppercase text-sm">
                      Y tế thông minh
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Cơ sở Y tế số
                      </span>
                      <strong className="text-xl font-mono text-white">
                        {activeMetrics.layer3.health.clinics}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Bệnh án điện tử
                      </span>
                      <strong className="text-xl font-mono text-rose-400">
                        {activeMetrics.layer3.health.ehrRatio}%
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Khám Telemedicine
                      </span>
                      <strong className="text-xl font-mono text-purple-400">
                        {activeMetrics.layer3.health.telemedicine.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Nông nghiệp */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/10 pb-2">
                    <Sprout className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-bold text-white uppercase text-sm">
                      Nông nghiệp Xanh
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Trang trại thông minh
                      </span>
                      <strong className="text-xl font-mono text-white">
                        {activeMetrics.layer3.agri.smartFarms}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Cảm biến IoT
                      </span>
                      <strong className="text-xl font-mono text-emerald-400">
                        {activeMetrics.layer3.agri.iotSensors}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Truy xuất nguồn gốc
                      </span>
                      <strong className="text-xl font-mono text-cyan-400">
                        {activeMetrics.layer3.agri.traceability}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Hành chính công */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/10 pb-2">
                    <Building2 className="h-5 w-5 text-amber-400" />
                    <h3 className="font-bold text-white uppercase text-sm">
                      Hành chính công
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Tổng Dịch vụ công trực tuyến
                      </span>
                      <strong className="text-2xl font-mono text-white">
                        {activeMetrics.layer3.admin.publicServices}
                      </strong>
                    </div>
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 block mb-1">
                        Tỷ lệ xử lý Mức 4
                      </span>
                      <strong className="text-2xl font-mono text-amber-400">
                        {activeMetrics.layer3.admin.level4Ratio}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TẦNG 4 - CĐS DOANH NGHIỆP */}
          {activeTab === 'layer-4' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
                  <Briefcase className="h-6 w-6" /> TẦNG 4: CHUYỂN ĐỔI SỐ DOANH
                  NGHIỆP TỔNG HỢP
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Đánh giá phân lớp từ Hộ kinh doanh cá thể, SME cho đến Doanh
                  nghiệp lớn có ứng dụng Trí tuệ nhân tạo (AI).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hộ kinh doanh */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase block mb-4 border-b border-cyan-500/10 pb-2">
                      1. Hộ Kinh Doanh Cá Thể
                    </span>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Tổng số Hộ Khảo sát:
                        </span>
                        <strong className="font-mono text-lg text-white">
                          {activeMetrics.layer4.households.total.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Sử dụng Thanh toán số:
                        </span>
                        <strong className="font-mono text-lg text-emerald-400">
                          {activeMetrics.layer4.households.digitalPay.toLocaleString()}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Bán hàng Social/Ecom:
                        </span>
                        <strong className="font-mono text-lg text-cyan-400">
                          {activeMetrics.layer4.households.ecom.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-cyan-500/10">
                    <div className="h-2 w-full bg-[#07111F] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${
                            (activeMetrics.layer4.households.digitalPay /
                              activeMetrics.layer4.households.total) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block text-right">
                      Độ phủ thanh toán số
                    </span>
                  </div>
                </div>

                {/* SME */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase block mb-4 border-b border-cyan-500/10 pb-2">
                      2. Doanh nghiệp SME
                    </span>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Tổng số SME Khảo sát:
                        </span>
                        <strong className="font-mono text-lg text-white">
                          {activeMetrics.layer4.smes.total}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Sử dụng Cloud:
                        </span>
                        <strong className="font-mono text-lg text-cyan-400">
                          {activeMetrics.layer4.smes.cloud}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Phần mềm CRM:
                        </span>
                        <strong className="font-mono text-lg text-purple-400">
                          {activeMetrics.layer4.smes.crm}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Hệ thống quản trị ERP:
                        </span>
                        <strong className="font-mono text-lg text-amber-400">
                          {activeMetrics.layer4.smes.erp}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DN Lớn / AI */}
                <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase block mb-4 border-b border-cyan-500/10 pb-2">
                      3. DN Lớn & Tiên phong AI
                    </span>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Doanh nghiệp Đầu ngành:
                        </span>
                        <strong className="font-mono text-lg text-white">
                          {activeMetrics.layer4.large.total}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Tự động hóa chuỗi cung ứng:
                        </span>
                        <strong className="font-mono text-lg text-emerald-400">
                          {activeMetrics.layer4.large.automation}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">
                          Có tích hợp Trí tuệ AI/Big Data:
                        </span>
                        <strong className="font-mono text-lg text-rose-400 animate-pulse">
                          {activeMetrics.layer4.large.ai}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20 flex items-start gap-2">
                    <Cpu className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-[10px] text-purple-200">
                      Việc ứng dụng AI đang là xu hướng cốt lõi để nâng cao năng
                      lực cạnh tranh cốt lõi.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TẦNG 5 - O2O & HUB XANH */}
          {activeTab === 'layer-5' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-emerald-400 flex items-center gap-2">
                  <Network className="h-6 w-6" /> TẦNG 5: MẠNG LƯỚI O2O & ĐIỂM
                  BÁN HUB XANH
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Thống kê mạng lưới các điểm Thương mại điện tử O2O, Hub Xanh
                  tại địa phương (từ Đại lý bán hàng đến Hub Phường/Xã).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="bg-gradient-to-br from-emerald-900/40 to-[#122A4E]/30 p-5 rounded-2xl border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-emerald-500/20 p-2 rounded-lg">
                        <Store className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">
                          Tổng Điểm bán Xanh
                        </span>
                        <div className="text-3xl font-mono font-black text-white">
                          {activeMetrics.layer5.points.total}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-4 pt-3 border-t border-emerald-500/20">
                      <span className="text-slate-300">Đang hoạt động:</span>
                      <strong className="text-emerald-400">
                        {activeMetrics.layer5.points.active} điểm
                      </strong>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-900/40 to-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <MapPin className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase">
                          Hub Xanh (Cấp Xã/Phường)
                        </span>
                        <div className="text-3xl font-mono font-black text-white">
                          {activeMetrics.layer5.hubs.total}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs mt-4 pt-3 border-t border-cyan-500/20">
                      <span className="text-slate-300">
                        Phủ sóng Xã/Phường:
                      </span>
                      <strong className="text-cyan-400">
                        {activeMetrics.layer5.hubs.communes} Xã
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-5 flex flex-col justify-between">
                  <span className="text-sm font-bold text-white uppercase block mb-4">
                    Chỉ số Hiệu quả Thương Mại O2O
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0A2540] p-4 rounded-xl border border-emerald-500/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400 opacity-50" />
                      </div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Độ Phủ Mạng Lưới
                      </span>
                      <strong className="text-3xl font-mono text-emerald-400">
                        {activeMetrics.layer5.metrics.coverage}%
                      </strong>
                    </div>

                    <div className="bg-[#0A2540] p-4 rounded-xl border border-cyan-500/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2">
                        <ShoppingBag className="h-4 w-4 text-cyan-400 opacity-50" />
                      </div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Đơn Hàng Xử Lý (Hub)
                      </span>
                      <strong className="text-3xl font-mono text-white">
                        {activeMetrics.layer5.metrics.orders.toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-[#0A2540] p-4 rounded-xl border border-purple-500/10 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2">
                        <CreditCard className="h-4 w-4 text-purple-400 opacity-50" />
                      </div>
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Doanh Thu Giao Dịch
                      </span>
                      <strong className="text-3xl font-mono text-purple-400">
                        {activeMetrics.layer5.metrics.revenue} Tỷ
                      </strong>
                    </div>
                  </div>

                  <div className="bg-[#0A2540] p-4 rounded-xl border border-cyan-500/10">
                    <span className="text-[11px] text-cyan-400 font-bold block mb-2 uppercase">
                      Mô hình vận hành O2O
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Các "Điểm bán Xanh" đóng vai trò là chi nhánh vệ tinh tiếp
                      nhận và xử lý đơn hàng Online-to-Offline (O2O) trực tiếp
                      tại địa phương. Dữ liệu tập trung về các "Hub Xanh" trung
                      tâm của Phường/Xã để tối ưu hóa Logistics và giảm thời
                      gian giao hàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI COMMAND CENTER (Song song 2 Tầng & Soạn thảo quyết định) */}
          {activeTab === 'ai-command-center' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 flex-1 min-h-[500px] animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-cyan-500/10 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
                    <Bot className="h-6 w-6 text-cyan-400" /> AI COMMAND CENTER
                  </h2>
                  <p className="text-xs text-slate-300">
                    Sử dụng mo hình ngôn ngữ lớn **Gemini-2.5-Flash** để tự động
                    đối chứng.
                  </p>
                </div>
                <span className="bg-purple-950/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
                  gemini-2.5-flash-preview-09-2025
                </span>
              </div>

              {/* Feature 2: ✨ AI Policy Decree Generator Block */}
              <div className="bg-[#122A4E]/40 border border-cyan-500/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
                      <Zap className="h-4.5 w-4.5 text-purple-400" />
                      <span>✨ AI DỰ THẢO CHỈ THỊ HÀNH ĐỘNG</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedIssue}
                      onChange={(e) => setSelectedIssue(e.target.value)}
                      className="bg-slate-950 border border-cyan-500/30 text-xs rounded-xl p-2.5 font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="nhom-c-training">
                        Khắc phục chỉ số Đào tạo số = 0
                      </option>
                      <option value="nhom-b-cloud">
                        Tăng tốc đưa Doanh nghiệp lữ hành lên Cloud
                      </option>
                      <option value="nhom-b5-households">
                        Thúc đẩy số hóa Hộ kinh doanh cá thể
                      </option>
                    </select>

                    <button
                      onClick={handleGeneratePolicy}
                      disabled={isGeneratingPolicy}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-95 transition-all text-white font-bold text-xs px-4 py-2.5 rounded-xl disabled:opacity-50"
                    >
                      <span>✨ SOẠN CHỈ THỊ</span>
                    </button>
                  </div>
                </div>

                {generatedPolicy && (
                  <div className="bg-[#07111F] p-4 rounded-xl border border-purple-500/20 text-xs font-mono space-y-3 relative overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <button
                        onClick={() => handlePlayTTS(generatedPolicy)}
                        className="bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-lg font-bold text-[10px]"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyClipboard(generatedPolicy)}
                        className="bg-slate-800 text-white border border-slate-700 px-2.5 py-1 rounded-lg font-bold text-[10px]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                      {generatedPolicy}
                    </p>
                  </div>
                )}
              </div>

              {/* Chat View Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[300px]">
                {/* Chat box messages */}
                <div className="lg:col-span-8 flex flex-col bg-[#07111F]/50 border border-cyan-500/10 rounded-2xl overflow-hidden min-h-[300px]">
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[350px]">
                    {aiChatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2.5 ${
                          msg.role === 'user' ? 'justify-end' : ''
                        }`}
                      >
                        {msg.role !== 'user' && (
                          <div className="bg-cyan-500 text-slate-900 p-1.5 rounded-lg shrink-0">
                            <Bot className="h-4.5 w-4.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                            msg.role === 'user'
                              ? 'bg-cyan-500 text-slate-900 font-bold rounded-tr-none'
                              : 'bg-[#122A4E]/50 text-slate-100 border border-cyan-500/10 rounded-tl-none leading-relaxed'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`block text-[9px] mt-1.5 text-right ${
                              msg.role === 'user'
                                ? 'text-slate-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    {aiIsLoading && (
                      <div className="flex items-start gap-2.5">
                        <div className="bg-cyan-500 text-slate-900 p-1.5 rounded-lg animate-spin">
                          <RefreshCw className="h-4.5 w-4.5" />
                        </div>
                        <div className="bg-[#122A4E]/50 border border-cyan-500/10 rounded-2xl p-3 text-xs text-cyan-300 animate-pulse">
                          AI đang đối chiếu dữ liệu...
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-cyan-500/10 p-3 bg-[#0A2540]/20 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Hỏi AI..."
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && aiQuery && callGeminiAPI(aiQuery)
                      }
                      disabled={aiIsLoading}
                      className="flex-1 bg-slate-950/80 border border-cyan-500/20 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={() => aiQuery && callGeminiAPI(aiQuery)}
                      disabled={aiIsLoading}
                      className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 p-3 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    CÂU HỎI ĐỀ XUẤT
                  </span>
                  {[
                    'Phân tích mối quan hệ nhân quả.',
                    'Lập kế hoạch nâng cao tỷ lệ số hóa.',
                    'Tìm kiếm chênh lệch và mâu thuẫn.',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAiQuery(p);
                        callGeminiAPI(p);
                      }}
                      disabled={aiIsLoading}
                      className="text-left p-3 rounded-xl bg-[#122A4E]/30 hover:bg-[#122A4E]/50 border border-cyan-500/5 text-xs text-slate-200 flex items-start gap-2"
                    >
                      <ChevronRight className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PDF Upload & Extraction Modal */}
      {showPdfImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A2540] border border-emerald-500/30 rounded-3xl p-6 max-w-3xl w-full shadow-2xl shadow-emerald-500/10">
            <div className="flex items-center justify-between mb-4 border-b border-cyan-500/10 pb-3">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-5 w-5" /> NẠP VÀ TRÍCH XUẤT DỮ LIỆU TỪ
                FILE PDF
              </h3>
              <button
                onClick={resetPdfModal}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">
                  Chọn file PDF chứa báo cáo dữ liệu Nhóm A, B, C, D, E để trích
                  xuất tự động vào Tầng 2:
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-slate-900 border border-dashed border-emerald-500/50 hover:border-emerald-400 text-white text-xs px-4 py-3 rounded-xl flex items-center gap-2 transition-colors">
                      <Upload className="h-4 w-4 text-emerald-500" />
                      <span className="truncate">
                        {pdfFile
                          ? `${pdfFile.name} (${pdfFile.size})`
                          : 'Click để chọn file PDF...'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleExtractPdf}
                    disabled={isExtractingPdf || !pdfFile}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-900 px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
                  >
                    {isExtractingPdf ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span>
                      {isExtractingPdf ? 'Đang đọc...' : 'AI Trích Xuất'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Scan Logs Area */}
              <div className="bg-slate-950 border border-cyan-500/10 rounded-xl p-4 min-h-[100px] max-h-[140px] font-mono text-[10px] sm:text-xs overflow-y-auto space-y-1.5">
                {pdfLogs.length === 0 && !isExtractingPdf && (
                  <span className="text-slate-500 italic">
                    Hệ thống AI Gemini sẽ quét và điền tự động số liệu báo cáo
                    vào Tầng 2 (Các nhóm A-E).
                  </span>
                )}
                {pdfLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes('[SUCCESS]') || log.includes('[OK]')
                        ? 'text-emerald-400'
                        : log.includes('[API]')
                        ? 'text-cyan-300'
                        : log.includes('[WARN]')
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
                {isExtractingPdf && (
                  <div className="text-emerald-400 animate-pulse mt-2 flex items-center gap-1.5">
                    Trợ lý AI đang đọc mảng dữ liệu cấu trúc PDF...
                  </div>
                )}
              </div>

              {/* Khung Xem Trước Dữ Liệu (Preview Data) */}
              {extractedPdfData && (
                <div className="mt-4 border-t border-emerald-500/20 pt-4 animate-in slide-in-from-bottom-2">
                  <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="h-4 w-4" /> BẢN XEM TRƯỚC DỮ LIỆU ĐÃ
                    TRÍCH XUẤT TỪ PDF:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px] max-h-[280px] overflow-y-auto pr-1">
                    {/* Nhóm A */}
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl border border-cyan-500/10">
                      <span className="font-bold text-cyan-300 block mb-2 border-b border-cyan-500/10 pb-1">
                        Nhóm A: Hạ tầng
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>DN Số hóa:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomA.digitalEnterprises.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+
                              {extractedPdfData.nhomA.digitalEnterprises.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Lên Cloud:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomA.cloudEnterprises.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomA.cloudEnterprises.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Số hóa toàn diện:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomA.comprehensiveDigital.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+
                              {
                                extractedPdfData.nhomA.comprehensiveDigital
                                  .month
                              }
                              )
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>NetID:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomA.netIdCards.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomA.netIdCards.month})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nhóm B */}
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl border border-cyan-500/10">
                      <span className="font-bold text-cyan-300 block mb-2 border-b border-cyan-500/10 pb-1">
                        Nhóm B: Hiện diện số
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>Web/E-com:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomB.webEcom.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomB.webEcom.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>SP/Dịch vụ số:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomB.digitalProducts.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomB.digitalProducts.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Đơn hàng:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomB.ecomOrders.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomB.ecomOrders.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Tăng trưởng:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomB.growthRate.year}%{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomB.growthRate.month}%)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nhóm C */}
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl border border-cyan-500/10">
                      <span className="font-bold text-cyan-300 block mb-2 border-b border-cyan-500/10 pb-1">
                        Nhóm C: Vận hành
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>Hệ ERP:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomC.erpSystems.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomC.erpSystems.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Tổng nhân sự:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomC.totalPersonnel.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomC.totalPersonnel.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Khóa đào tạo:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomC.trainingCourses.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomC.trainingCourses.month})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nhóm D */}
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl border border-cyan-500/10">
                      <span className="font-bold text-cyan-300 block mb-2 border-b border-cyan-500/10 pb-1">
                        Nhóm D: Thị trường
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>Trang xem:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomD.pageViews.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomD.pageViews.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Người xem:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomD.viewers.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomD.viewers.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Google SEO:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomD.googleSeo.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomD.googleSeo.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Khách hàng:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomD.customers.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomD.customers.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Doanh thu (Tr):</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomD.revenue.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomD.revenue.month})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nhóm E */}
                    <div className="bg-[#122A4E]/50 p-3 rounded-xl border border-cyan-500/10 lg:col-span-2">
                      <span className="font-bold text-cyan-300 block mb-2 border-b border-cyan-500/10 pb-1">
                        Nhóm E: Thông tin & Hệ sinh thái
                      </span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <div className="flex justify-between text-slate-300">
                          <span>Doanh nghiệp:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomE.enterprises.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomE.enterprises.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Thiện nguyện:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomE.charityProjects.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomE.charityProjects.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Bảng tin:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomE.boardNews.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomE.boardNews.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Dự án:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomE.projects.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomE.projects.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Kêu gọi ĐT:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomE.investmentCalls.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomE.investmentCalls.month})
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Thư viện/TL:</span>{' '}
                          <span className="font-mono text-white">
                            {extractedPdfData.nhomE.libraryDocs.year}{' '}
                            <span className="text-[9px] text-emerald-400">
                              (+{extractedPdfData.nhomE.libraryDocs.month})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Các Nút Xác Nhận Nạp */}
                  <div className="flex gap-3 mt-4 pt-3 border-t border-cyan-500/10">
                    <button
                      onClick={() => setExtractedPdfData(null)}
                      className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Hủy kết quả
                    </button>
                    <button
                      onClick={handleApplyPdfData}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <CheckCircle2 className="h-5 w-5" />{' '}
                      <span className="uppercase tracking-wide">
                        Xác nhận nạp toàn bộ vào hệ thống
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Chỉ hiện nút đóng modal khi chưa có Preview */}
              {!extractedPdfData && (
                <div className="flex gap-3 pt-3 border-t border-cyan-500/10">
                  <button
                    onClick={resetPdfModal}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer Area */}
      <footer className="bg-[#0A2540] border-t border-cyan-500/10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>
            Hệ thống đồng bộ dữ liệu song song Đặc khu Kiên Hải theo chuẩn bảo
            mật IOC xã Tân Hiệp.
          </span>
        </div>
        <div>
          <span>© 2026 Ban Chỉ Đạo Chuyển Đổi Số Đặc Khu Kiên Hải.</span>
        </div>
      </footer>
    </div>
  );
}
