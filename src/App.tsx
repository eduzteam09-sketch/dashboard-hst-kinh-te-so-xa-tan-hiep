// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const requestGemini = async (model: string, action: string, payload: any) => {
  const apiKey = GEMINI_API_KEY;
  if (apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}?key=${apiKey}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } else {
    return fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, action, payload }),
    });
  }
};

import {
  subscribeZones,
  subscribePeriodicData,
  subscribeCommuneData,
  upsertPeriodicLayer2,
  DEFAULT_LAYER1,
  DEFAULT_LAYER2,
  DEFAULT_LAYER3,
  DEFAULT_LAYER4,
  DEFAULT_LAYER5
} from './services/firestoreService';


// Placeholder cho lúc đang loading từ Firestore
const EMPTY_COMMUNE_ENTRY = {
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
};

function mergeDefaults(data: any, defaults: any) {
  if (!data) return defaults;
  const result = { ...defaults };
  for (const key in data) {
    if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
      result[key] = mergeDefaults(data[key], defaults[key] || {});
    } else {
      result[key] = data[key];
    }
  }
  return result;
}

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

  // PDF Upload States
  const [showPdfImportModal, setShowPdfImportModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfLogs, setPdfLogs] = useState([]);
  const [extractedPdfData, setExtractedPdfData] = useState<any>(null);
  const [extractedPdfPeriod, setExtractedPdfPeriod] = useState<{thang: number, nam: number} | null>(null);
  const [pdfErrorMsg, setPdfErrorMsg] = useState(null);

  const [selectedIssue, setSelectedIssue] = useState('nhom-c-training');
  const [generatedPolicy, setGeneratedIssuePolicy] = useState('');
  const [isGeneratingPolicy, setIsGeneratingPolicy] = useState(false);

  const audioRef = useRef(null);

  // ========================
  // FIRESTORE STATE + REALTIME
  // ========================
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(true);
  const [zones, setZones] = useState<any[]>([]);
  const [periodicData, setPeriodicData] = useState<Record<string, any>>({});
  const [communeData, setCommuneData] = useState<Record<string, any>>({});

  // Dữ liệu xã Tân Hiệp từ Firestore (thay thế COMMUNE_DATA['X. Tân Hiệp'])
  const currentZoneData = useMemo(() => {
    return communeData['X. Tân Hiệp'] || EMPTY_COMMUNE_ENTRY;
  }, [communeData]);

  // Khởi tạo Firestore: seed nếu trống + lắng nghe realtime
  useEffect(() => {
    let unsubZones: (() => void) | null = null;
    let unsubPeriodic: (() => void) | null = null;
    let unsubCommunes: (() => void) | null = null;

    const initFirestore = async () => {
      try {
        unsubZones = subscribeZones((data) => setZones(data));
        unsubPeriodic = subscribePeriodicData((data) => {
          setPeriodicData(data);
          setIsFirestoreLoading(false);
        });
        unsubCommunes = subscribeCommuneData((data) => setCommuneData(data));
      } catch (err) {
        console.error('[Firestore] Lỗi khởi tạo:', err);
        setIsFirestoreLoading(false);
      }
    };

    initFirestore();

    return () => {
      unsubZones?.();
      unsubPeriodic?.();
      unsubCommunes?.();
    };
  }, []);



  // Combined Active State (Đã loại bỏ cơ chế cộng dồn dữ liệu giả lập)
  const activeMetrics = useMemo(() => {
    const rawMetrics = periodicData[selectedPeriod] || periodicData['T05/2026'] || {};
    return {
      ...rawMetrics,
      layer1: mergeDefaults(rawMetrics.layer1, DEFAULT_LAYER1),
      layer2: mergeDefaults(rawMetrics.layer2, DEFAULT_LAYER2),
      layer3: mergeDefaults(rawMetrics.layer3, DEFAULT_LAYER3),
      layer4: mergeDefaults(rawMetrics.layer4, DEFAULT_LAYER4),
      layer5: mergeDefaults(rawMetrics.layer5, DEFAULT_LAYER5),
    };
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
      setPdfErrorMsg(null); // Xóa lỗi cũ
    };
    reader.readAsDataURL(file);
  };

  const handleExtractPdf = async () => {
    if (!pdfFile) return;
    setIsExtractingPdf(true);
    setPdfErrorMsg(null);
    setPdfLogs((prev) => [
      ...prev,
      '[API] Đang gửi yêu cầu phân tích tài liệu bằng LLM Gemini (gemini-3.1-flash-lite)...',
    ]);

    try {
      const promptText = `
        Bạn là hệ thống trích xuất dữ liệu. Hãy đọc tài liệu PDF này và trích xuất số liệu chuyển đổi số.
        Chỉ trích xuất dữ liệu cho 5 nhóm A, B, C, D, E. ĐỒNG THỜI xác định tháng và năm báo cáo từ tài liệu.
        Trả về CHỈ một đối tượng JSON chính xác theo cấu trúc này, mọi giá trị là số nguyên hoặc thập phân:
        {
          "thang": 8,
          "nam": 2026,
          "duLieu": {
            "nhomA": { "digitalEnterprises": {"month": 0, "year": 0}, "cloudEnterprises": {"month": 0, "year": 0}, "comprehensiveDigital": {"month": 0, "year": 0}, "netIdCards": {"month": 0, "year": 0} },
            "nhomB": { "webEcom": {"month": 0, "year": 0}, "digitalProducts": {"month": 0, "year": 0}, "ecomOrders": {"month": 0, "year": 0}, "growthRate": {"month": 0, "year": 0} },
            "nhomC": { "erpSystems": {"month": 0, "year": 0}, "totalPersonnel": {"month": 0, "year": 0}, "trainingCourses": {"month": 0, "year": 0} },
            "nhomD": { "pageViews": {"month": 0, "year": 0}, "viewers": {"month": 0, "year": 0}, "googleSeo": {"month": 0, "year": 0}, "customers": {"month": 0, "year": 0}, "revenue": {"month": 0, "year": 0} },
            "nhomE": { "enterprises": {"month": 0, "year": 0}, "charityProjects": {"month": 0, "year": 0}, "boardNews": {"month": 0, "year": 0}, "projects": {"month": 0, "year": 0}, "investmentCalls": {"month": 0, "year": 0}, "tourismLocations": {"month": 0, "year": 0}, "featuredEvents": {"month": 0, "year": 0}, "digitalTransformations": {"month": 0, "year": 0}, "libraryDocs": {"month": 0, "year": 0} }
          }
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

      const response = await requestGemini('gemini-3.1-flash-lite', 'generateContent', payload);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        const extractedData = JSON.parse(jsonText);
        setPdfLogs((prev) => [
          ...prev,
          '[SUCCESS] Trợ lý AI đã bóc tách dữ liệu từ PDF thành công! Đang hiển thị bản xem trước...',
        ]);
        setExtractedPdfPeriod({ thang: extractedData.thang, nam: extractedData.nam });
        setExtractedPdfData(extractedData.duLieu); // Lưu vào state tạm để xem trước
      } else {
        throw new Error('Empty response');
      }
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || error;
      setPdfLogs((prev) => [
        ...prev,
        `[ERROR] Chi tiết lỗi: ${errMsg}`,
        '[WARN] Trích xuất thất bại. Vui lòng chọn Thử lại hoặc Sử dụng dữ liệu mẫu.',
      ]);
      setPdfErrorMsg(errMsg);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleLoadMockData = () => {
    setIsExtractingPdf(true);
    setPdfLogs((prev) => [
      ...prev,
      '[INFO] Đang nạp dữ liệu mẫu giả lập...',
    ]);
    const mockExtractedData = {
      thang: 8,
      nam: 2026,
      duLieu: {
        nhomA: {
          digitalEnterprises: { month: 12, year: 85 },
          cloudEnterprises: { month: 5, year: 45 },
          comprehensiveDigital: { month: 2, year: 15 },
          netIdCards: { month: 150, year: 2500 },
        },
        nhomB: {
          webEcom: { month: 8, year: 120 },
          digitalProducts: { month: 25, year: 350 },
          ecomOrders: { month: 1200, year: 15000 },
          growthRate: { month: 15, year: 125 },
        },
        nhomC: {
          erpSystems: { month: 3, year: 25 },
          totalPersonnel: { month: 45, year: 550 },
          trainingCourses: { month: 2, year: 18 },
        },
        nhomD: {
          pageViews: { month: 5000, year: 65000 },
          viewers: { month: 2500, year: 32000 },
          googleSeo: { month: 15, year: 250 },
          customers: { month: 300, year: 4500 },
          revenue: { month: 150, year: 2500 },
        },
        nhomE: {
          enterprises: { month: 8, year: 145 },
          charityProjects: { month: 2, year: 15 },
          boardNews: { month: 15, year: 180 },
          projects: { month: 5, year: 45 },
          investmentCalls: { month: 3, year: 15 },
          tourismLocations: { month: 1, year: 8 },
          featuredEvents: { month: 3, year: 12 },
          digitalTransformations: { month: 2, year: 10 },
          libraryDocs: { month: 15, year: 65 },
        },
      }
    };
    setTimeout(() => {
      setPdfLogs((prev) => [
        ...prev,
        '[SUCCESS] Đã nạp dữ liệu mẫu thành công! Vui lòng kiểm tra bản xem trước bên dưới và xác nhận nạp.',
      ]);
      setExtractedPdfPeriod({ thang: mockExtractedData.thang, nam: mockExtractedData.nam });
      setExtractedPdfData(mockExtractedData.duLieu);
      setPdfErrorMsg(null);
      setIsExtractingPdf(false);
    }, 1000);
  };

  const handleApplyPdfData = async () => {
    if (!extractedPdfData || !extractedPdfPeriod) {
      triggerToast('Dữ liệu PDF không hợp lệ hoặc thiếu thông tin Tháng/Năm.');
      return;
    }
    
    try {
      const newPeriodKey = await upsertPeriodicLayer2(
        extractedPdfPeriod.thang, 
        extractedPdfPeriod.nam, 
        extractedPdfData
      );
      
      triggerToast(`Đã lưu dữ liệu thành công cho kỳ: ${newPeriodKey}`);
      // Tự động chuyển view sang tháng mới nạp
      setSelectedPeriod(newPeriodKey);
    } catch (err) {
      console.error('[Firestore] Lỗi ghi PDF data:', err);
      triggerToast('Lỗi khi lưu dữ liệu. Vui lòng thử lại.');
    }
    setShowPdfImportModal(false);
    setPdfFile(null);
    setPdfLogs([]);
    setExtractedPdfData(null);
    setPdfErrorMsg(null);
  };

  const resetPdfModal = () => {
    setShowPdfImportModal(false);
    setPdfFile(null);
    setPdfLogs([]);
    setExtractedPdfData(null);
    setExtractedPdfPeriod(null);
    setPdfErrorMsg(null);
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
    triggerToast('Đang kết nối Google Gemini TTS (gemini-3.1-flash-tts-preview)...');
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
      const response = await requestGemini('gemini-3.1-flash-tts-preview', 'generateContent', payload);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }
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
    triggerToast('Đang quét toàn diện song song Layer 1 & 2 (gemini-3.1-flash-lite)...');
    const promptText = `Phân tích mâu thuẫn hệ thống: Tầng 1 (Hộ KD cá thể số hóa 38%) vs Tầng 2 (Khóa đào tạo = ${activeMetrics.layer2.nhomC.trainingCourses.year}). Nêu 3 khuyến nghị ngắn gọn.`;
    const payload = { contents: [{ parts: [{ text: promptText }] }] };

    try {
      const response = await requestGemini('gemini-3.1-flash-lite', 'generateContent', payload);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }
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
      const response = await requestGemini('gemini-3.1-flash-lite', 'generateContent', payload);
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }
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

  if (isFirestoreLoading) {
    return (
      <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-center text-cyan-400 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p>Đang đồng bộ dữ liệu Hệ Sinh Thái từ hệ thống đám mây...</p>
      </div>
    );
  }

  // Màn hình trống nếu Database hoàn toàn chưa có dữ liệu báo cáo nào
  if (!activeMetrics || !activeMetrics.layer1) {
    return (
      <div className="min-h-screen bg-[#07111F] flex flex-col items-center justify-center text-slate-300 font-sans p-6">
        <div className="bg-[#0A2540] border border-cyan-500/20 p-8 rounded-2xl max-w-md text-center shadow-2xl shadow-cyan-900/20">
          <Upload className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-cyan-400 mb-2">Chưa có Dữ Liệu Báo Cáo</h2>
          <p className="text-sm text-slate-400 mb-6">
            Database của bạn hiện tại đang trống. Vui lòng tải lên một file báo cáo PDF (dữ liệu mẫu hoặc file thực tế) để hệ thống tự động khởi tạo dữ liệu và cấu trúc hiển thị.
          </p>
          <button
            onClick={() => setShowPdfImportModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto w-full"
          >
            <Upload className="h-4 w-4" /> Nạp PDF Dữ Liệu Đầu Tiên
          </button>
        </div>

        {/* Cửa sổ Modal vẫn cần được render ở đây để có thể mở lên */}
        {showPdfImportModal && (
          <div className="fixed inset-0 bg-[#07111F]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-[#0A2540] border border-cyan-500/30 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh]">
              {/* Header Modal */}
              <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-cyan-300">
                      Nhập Dữ Liệu Từ Báo Cáo PDF
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Sử dụng Gemini 3.1 Flash Lite AI để bóc tách dữ liệu
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetPdfModal}
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Main Modal Content (Minimal version for empty state) */}
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 p-4">
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="border-2 border-dashed border-cyan-500/30 bg-[#122A4E]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 transition-colors group relative h-40">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="h-8 w-8 text-cyan-500/50 group-hover:text-emerald-400 mb-3 transition-colors" />
                    <span className="text-xs font-bold text-cyan-300 block mb-1">
                      Kéo thả hoặc nhấn để chọn file
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Chỉ hỗ trợ file PDF
                    </span>
                  </div>
                  {pdfFile && (
                    <div className="bg-[#122A4E]/50 border border-cyan-500/20 rounded-xl p-3 flex items-start gap-3">
                      <div className="bg-red-500/20 p-2 rounded-lg mt-0.5">
                        <FileText className="h-4 w-4 text-red-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-slate-200 truncate">
                          {pdfFile.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {pdfFile.size}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleExtractPdf}
                    disabled={!pdfFile || isExtractingPdf}
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                  >
                    {isExtractingPdf ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Đang
                        phân tích...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" /> Bắt Đầu Bóc Tách AI
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLoadMockData}
                    disabled={isExtractingPdf}
                    className="py-1.5 px-3 bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-600 hover:text-slate-900 text-emerald-400 rounded-lg text-xs font-bold transition-all mt-2"
                  >
                    Sử Dụng Dữ Liệu Mẫu
                  </button>
                </div>
                <div className="flex-1 bg-[#122A4E]/30 rounded-xl border border-cyan-500/20 p-4 overflow-y-auto">
                  <h4 className="text-sm font-bold text-cyan-400 mb-3 sticky top-0 bg-[#122A4E]/30 py-1 backdrop-blur-md">
                    Trạng Thái Xử Lý
                  </h4>
                  <div className="space-y-2 mb-4">
                    {pdfLogs.map((log, i) => (
                      <div key={i} className={`text-xs p-2 rounded border ${log.includes('[ERROR]') ? 'bg-red-500/10 border-red-500/30 text-red-400' : log.includes('[SUCCESS]') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-300'}`}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-cyan-500/20 flex justify-end gap-3 bg-[#0A2540] rounded-b-2xl">
                <button
                  onClick={resetPdfModal}
                  className="px-4 py-2 hover:bg-white/5 text-slate-300 rounded-xl text-xs font-bold transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    handleApplyPdfData();
                    setShowPdfImportModal(false);
                  }}
                  disabled={!extractedPdfData || !extractedPdfPeriod}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Xác Nhận Lưu Dữ Liệu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

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
                  `Đồng bộ dữ liệu chu kỳ ${periodicData[e.target.value]?.label
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
            <span>BẢN ĐỒ PHÂN KHU</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          </div>

          <div className="px-3 py-2 bg-[#122A4E]/30 rounded-xl border border-cyan-500/5 mb-3">
            <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
              Địa bàn:
            </span>
            <span className="text-xs font-semibold text-cyan-400">
              Xã Tân Hiệp
            </span>
          </div>

          {[
            {
              id: 'layer-1',
              label: 'Tầng 1: Bộ tiêu chí kinh tế số UBND cấp xã',
              icon: ShieldCheck,
              subtitle: `DEI ${activeMetrics.layer1.deiScore}% (Kinh tế & Xã hội)`,
            },
            {
              id: 'layer-2',
              label: 'Tầng 2: Tiêu chí nền tảng kinh tế số',
              icon: Building2,
              subtitle: '5 nhóm A-E khai thác từ Nền tảng',
            },
            {
              id: 'layer-3',
              label: 'Tầng 3: Dự án kêu gọi đầu tư - Quy hoạch',
              icon: Landmark,
              subtitle: 'Kêu gọi đầu tư, quy hoạch',
            },
            {
              id: 'layer-4',
              label: 'Tầng 4: Chính sách & Giải đáp kiến nghị',
              icon: Briefcase,
              subtitle: 'Hỗ trợ doanh nghiệp, các góp ý kiến nghị',
            },
            {
              id: 'layer-5',
              label: 'Tầng 5: Điểm trưng bày/Hội quán',
              icon: Network,
              subtitle: 'Điểm bán Xanh, Doanh thu',
            },
            {
              id: 'docs-cds',
              label: 'Tài liệu Chuyển đổi số cho doanh nghiệp',
              icon: FileText,
              isExternal: true, // Đánh dấu đây là link ngoài
              url: 'https://tanhiepangiang.vn/B4222h6a2d1d4cE'
            },
            {
              id: 'stats-report',
              label: 'Thống kê báo cáo',
              icon: Activity,
            },
            // {
            //   id: 'ai-command-center',
            //   label: 'Trợ lý AI Điều Hành',
            //   icon: Bot,
            //   isNew: true,
            // },
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            // Xử lý logic click
            const handleClick = () => {
              if (item.isExternal) {
                window.open(item.url, '_blank', 'noopener,noreferrer');
              } else {
                setActiveTab(item.id);
                setSelectedZone(null);
              }
            };
            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all text-left ${isActive
                  ? 'bg-[#122A4E] border-l-4 border-cyan-400 text-cyan-200 font-bold'
                  : 'text-slate-300 hover:bg-[#122A4E]/20 hover:text-white'
                  }`}
              >
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`h-4.5 w-4.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'
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
                    TIÊU CHÍ KINH TẾ SỐ UBND CẤP XÃ
                  </h2>
                  <p className="text-xs text-slate-400">
                    Bản phân rã 8 nhóm chỉ số nhiệm vụ cốt lõi đo lường nền kinh
                    tế số trên toàn địa bàn.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* B1. THÔNG TIN ĐƠN VỊ KINH DOANH TẠI ĐỊA BÀN */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-5">
                    <Building2 className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm font-bold text-cyan-400 uppercase tracking-wide">
                      B1: THÔNG TIN ĐƠN VỊ KINH DOANH - XÃ TÂN HIỆP
                    </span>
                  </div>

                  {/* Tổng số DN/HKD/HTX (Có Link) */}
                  <a
                    href="https://tanhiepangiang.vn/28C70aH88eC9063"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#07111F]/50 px-5 py-3 rounded-xl border border-cyan-500/10 flex justify-between items-center mb-3 cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/30 transition-all"
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      TỔNG SỐ DOANH NGHIỆP/ HKD/ HTX:
                    </span>
                    <strong className="text-2xl font-black text-emerald-400 font-mono">
                      {currentZoneData.b1.total}
                    </strong>
                  </a>

                  {/* 3 Cột Tổng (Có Link) */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    <a
                      href="https://tanhiepangiang.vn/330887F70hF9E63"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#122A4E]/20 p-3 rounded-xl border border-cyan-500/10 block cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/40 transition-all"
                    >
                      <span className="text-[9px] text-slate-400 block mb-2 font-bold uppercase h-6">
                        Tổng Số Doanh Nghiệp<br />Vừa Và Nhỏ
                      </span>
                      <strong className="text-xl font-mono text-white">
                        {currentZoneData.b1.dn_total}
                      </strong>
                    </a>

                    <a
                      href="https://tanhiepangiang.vn/C0EcH948862e780"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#122A4E]/20 p-3 rounded-xl border border-cyan-500/10 block cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/40 transition-all"
                    >
                      <span className="text-[9px] text-slate-400 block mb-2 font-bold uppercase h-6">
                        Tổng Số<br />Hộ Kinh Doanh
                      </span>
                      <strong className="text-xl font-mono text-cyan-300">
                        {currentZoneData.b1.hkd_total}
                      </strong>
                    </a>

                    <a
                      href="https://tanhiepangiang.vn/0846B862H659B5E"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#122A4E]/20 p-3 rounded-xl border border-cyan-500/10 block cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/40 transition-all"
                    >
                      <span className="text-[9px] text-slate-400 block mb-2 font-bold uppercase h-6">
                        Tổng Số<br />Hợp Tác Xã
                      </span>
                      <strong className="text-xl font-mono text-emerald-400">
                        {currentZoneData.b1.htx_total}
                      </strong>
                    </a>
                  </div>

                  {/* Tổng số CĐS */}
                  <a
                    href="https://tanhiepangiang.vn/3e6h8527Eb344b3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#07111F]/50 px-5 py-3 rounded-xl border border-cyan-500/10 flex justify-between items-center mb-3 cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/30 transition-all"
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      TỔNG SỐ DOANH NGHIỆP/ HKD/ HTX SỐ CHUYỂN ĐỔI SỐ:
                    </span>
                    <strong className="text-xl font-black text-emerald-400 font-mono">
                      {currentZoneData.b1.dn_cds + currentZoneData.b1.hkd_cds + currentZoneData.b1.htx_cds}
                    </strong>
                  </a>

                  {/* 3 Cột CĐS */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1 font-bold uppercase h-6">
                        Tổng Số Doanh Nghiệp<br />Chuyển Đổi Số
                      </span>
                      <strong className="text-lg font-mono text-white block mb-1">
                        {currentZoneData.b1.dn_cds}
                      </strong>
                      <span className="text-[8px] text-slate-500">
                        Chiếm {currentZoneData.b1.dn_total > 0 ? ((currentZoneData.b1.dn_cds / currentZoneData.b1.dn_total) * 100).toFixed(2) : 0}% ({currentZoneData.b1.dn_cds}/{currentZoneData.b1.dn_total})
                      </span>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1 font-bold uppercase h-6">
                        Tổng Số Hộ Kinh Doanh<br />Chuyển Đổi Số
                      </span>
                      <strong className="text-lg font-mono text-cyan-300 block mb-1">
                        {currentZoneData.b1.hkd_cds}
                      </strong>
                      <span className="text-[8px] text-slate-500">
                        Chiếm {currentZoneData.b1.hkd_total > 0 ? ((currentZoneData.b1.hkd_cds / currentZoneData.b1.hkd_total) * 100).toFixed(0) : 0}% ({currentZoneData.b1.hkd_cds}/{currentZoneData.b1.hkd_total})
                      </span>
                    </div>
                    <div className="bg-[#122A4E]/30 p-3 rounded-xl border border-cyan-500/5">
                      <span className="text-[9px] text-slate-400 block mb-1 font-bold uppercase h-6">
                        Tổng Số Hợp Tác Xã<br />Chuyển Đổi Số
                      </span>
                      <strong className="text-lg font-mono text-emerald-400 block mb-1">
                        {currentZoneData.b1.htx_cds}
                      </strong>
                      <span className="text-[8px] text-slate-500">
                        Chiếm {currentZoneData.b1.htx_total > 0 ? ((currentZoneData.b1.htx_cds / currentZoneData.b1.htx_total) * 100).toFixed(1) : 0}% ({currentZoneData.b1.htx_cds}/{currentZoneData.b1.htx_total})
                      </span>
                    </div>
                  </div>

                  {/* Biểu đồ Tỉ lệ CĐS theo hàng */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-300 uppercase">
                        TỈ LỆ DOANH NGHIỆP/ HKD/ HTX CHUYỂN ĐỔI SỐ:
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        ({currentZoneData.b1.dn_cds + currentZoneData.b1.hkd_cds + currentZoneData.b1.htx_cds}/{currentZoneData.b1.total}) {currentZoneData.b1.total > 0 ? (((currentZoneData.b1.dn_cds + currentZoneData.b1.hkd_cds + currentZoneData.b1.htx_cds) / currentZoneData.b1.total) * 100).toFixed(2) : 0}%
                      </span>
                    </div>

                    <div className="space-y-3 border-b border-cyan-500/10 pb-5 mb-4">
                      {/* Bar DN */}
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] w-8 text-slate-400">DN/VN</span>
                        <div className="flex-1 flex items-center h-6">
                          {currentZoneData.b1.dn_total > 0 && (
                            <div className="h-full bg-[#86EFAC] flex items-center justify-center text-[9px] text-slate-900 font-bold" style={{ width: `${(currentZoneData.b1.dn_total / currentZoneData.b1.total) * 100}%` }}>
                              {currentZoneData.b1.dn_total}
                            </div>
                          )}
                          {currentZoneData.b1.dn_cds > 0 && (
                            <div className="h-full bg-[#FB923C] flex items-center justify-center text-[9px] text-slate-900 font-bold" style={{ width: `${(currentZoneData.b1.dn_cds / currentZoneData.b1.total) * 100}%` }}>
                              {currentZoneData.b1.dn_cds}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Bar HKD */}
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] w-8 text-slate-400">HKD</span>
                        <div className="flex-1 flex items-center h-6">
                          {currentZoneData.b1.hkd_total > 0 && (
                            <div className="h-full bg-[#86EFAC] flex items-center justify-center text-[9px] text-slate-900 font-bold" style={{ width: `${(currentZoneData.b1.hkd_total / currentZoneData.b1.total) * 100}%` }}>
                              {currentZoneData.b1.hkd_total}
                            </div>
                          )}
                          {currentZoneData.b1.hkd_cds > 0 && (
                            <div className="h-full bg-[#FB923C] flex items-center justify-center text-[9px] text-slate-900 font-bold" style={{ width: `${(currentZoneData.b1.hkd_cds / currentZoneData.b1.total) * 100}%` }}>
                              {currentZoneData.b1.hkd_cds}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Bar HTX */}
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] w-8 text-slate-400">HTX</span>
                        <div className="flex-1 flex items-center h-6">
                          {currentZoneData.b1.htx_total > 0 && (
                            <div className="h-full bg-[#86EFAC] flex items-center justify-center text-[9px] text-slate-900 font-bold" style={{ width: `${(currentZoneData.b1.htx_total / currentZoneData.b1.total) * 100}%` }}>
                              {currentZoneData.b1.htx_total}
                            </div>
                          )}
                          {currentZoneData.b1.htx_cds > 0 && (
                            <div className="h-full bg-[#FB923C] flex items-center justify-center text-[9px] text-slate-900 font-bold" style={{ width: `${(currentZoneData.b1.htx_cds / currentZoneData.b1.total) * 100}%` }}>
                              {currentZoneData.b1.htx_cds}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Biểu đồ Cơ cấu Stacked Bar */}
                    <span className="text-[10px] text-slate-300 font-bold block uppercase mb-2">
                      BIỂU ĐỒ TỈ LỆ CƠ CẤU ĐƠN VỊ KINH DOANH:
                    </span>
                    <div className="w-full h-7 bg-[#07111F] flex mb-2">
                      {currentZoneData.b1.dn_total > 0 && (
                        <div className="bg-cyan-400 h-full flex items-center justify-center text-[10px] font-bold text-slate-900" style={{ width: `${(currentZoneData.b1.dn_total / currentZoneData.b1.total) * 100}%` }}>
                          DN ({(currentZoneData.b1.dn_total / currentZoneData.b1.total * 100).toFixed(0)}%)
                        </div>
                      )}
                      {currentZoneData.b1.hkd_total > 0 && (
                        <div className="bg-emerald-400 h-full flex items-center justify-center text-[10px] font-bold text-slate-900" style={{ width: `${(currentZoneData.b1.hkd_total / currentZoneData.b1.total) * 100}%` }}>
                          HKD ({(currentZoneData.b1.hkd_total / currentZoneData.b1.total * 100).toFixed(0)}%)
                        </div>
                      )}
                      {currentZoneData.b1.htx_total > 0 && (
                        <div className="bg-[#A855F7] h-full flex items-center justify-center text-[10px] font-bold text-white" style={{ width: `${(currentZoneData.b1.htx_total / currentZoneData.b1.total) * 100}%` }}>
                          HTX ({(currentZoneData.b1.htx_total / currentZoneData.b1.total * 100).toFixed(0)}%)
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span className="text-[9px] text-slate-400">{currentZoneData.b1.dn_total} DN</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-[9px] text-slate-400">{currentZoneData.b1.hkd_total} HKD</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#A855F7]"></span>
                        <span className="text-[9px] text-slate-400">{currentZoneData.b1.htx_total} HTX</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B2. THÔNG TIN SẢN PHẨM */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-5">
                    <Award className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm font-bold text-cyan-400 uppercase tracking-wide">
                      B2: THÔNG TIN SẢN PHẨM TRÊN ĐỊA BÀN
                    </span>
                  </div>

                  {/* Tổng số SP/DV (Có Link) */}
                  <a
                    href="https://tanhiepangiang.vn/B4HbFf11820eB5C"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#07111F]/50 px-5 py-4 rounded-xl border border-cyan-500/10 flex justify-between items-center mb-5 cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/30 transition-all"
                  >
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      TỔNG SỐ SẢN PHẨM/DỊCH VỤ:
                    </span>
                    <strong className="text-2xl font-black text-emerald-400 font-mono">
                      {currentZoneData.b2.total}
                    </strong>
                  </a>

                  {/* Cấu trúc mới: OCOP chiếm 100%, Thường + Dịch vụ nằm dưới */}
                  <div className="space-y-4">
                    {/* Khối OCOP - Chiếm full chiều ngang */}
                    <div className="bg-[#122A4E]/30 rounded-xl border border-cyan-500/10 p-5 w-full">
                      {/* Tiêu đề & Tổng số */}
                      <a
                        href="https://tanhiepangiang.vn/8d2h87Bf66915e4"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center mb-6 hover:bg-cyan-500/5 rounded-lg py-2 transition-all cursor-pointer"
                      >
                        <span className="text-sm text-slate-300 uppercase block mb-1 tracking-wider">TỔNG SỐ SẢN PHẨM OCOP</span>
                        <strong className="text-5xl font-black font-mono text-emerald-400">{currentZoneData.b2.ocop_total}</strong>
                      </a>

                      {/* Thanh tiến độ */}
                      <div className="w-full h-4 bg-[#07111F] rounded-full overflow-hidden mb-2 flex">
                        {currentZoneData.b2.ocop_total > 0 && (
                          <>
                            <div className="bg-[#60A5FA] h-full" style={{ width: `${(currentZoneData.b2.ocop_3 / currentZoneData.b2.ocop_total) * 100}%` }}></div>
                            <div className="bg-[#A855F7] h-full" style={{ width: `${(currentZoneData.b2.ocop_4 / currentZoneData.b2.ocop_total) * 100}%` }}></div>
                            <div className="bg-[#FDBA74] h-full" style={{ width: `${(currentZoneData.b2.ocop_5 / currentZoneData.b2.ocop_total) * 100}%` }}></div>
                          </>
                        )}
                      </div>

                      {/* Chú thích màu */}
                      <div className="flex items-center justify-center gap-6 mb-6">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#60A5FA] rounded-full"></span><span className="text-xs text-slate-300">OCOP 3 SAO</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#A855F7] rounded-full"></span><span className="text-xs text-slate-300">OCOP 4 SAO</span></div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-[#FDBA74] rounded-full"></span><span className="text-xs text-slate-300">OCOP 5 SAO</span></div>
                      </div>

                      {/* 3 Hộp số liệu to rõ phía dưới */}
                      <div className="grid grid-cols-3 gap-4">
                        <a href="https://tanhiepangiang.vn/B21h949f82D4E0B" target="_blank" rel="noopener noreferrer" className="bg-[#07111F]/50 border border-cyan-500/10 rounded-xl py-4 flex flex-col items-center cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/30 transition-all">
                          <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">OCOP 3 SAO</span>
                          <strong className="text-3xl text-[#60A5FA] font-mono">{currentZoneData.b2.ocop_3}</strong>
                        </a>
                        <a href="https://tanhiepangiang.vn/2cA8Da8d6hE3981" target="_blank" rel="noopener noreferrer" className="bg-[#07111F]/50 border border-cyan-500/10 rounded-xl py-4 flex flex-col items-center cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/30 transition-all">
                          <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">OCOP 4 SAO</span>
                          <strong className="text-3xl text-[#A855F7] font-mono">{currentZoneData.b2.ocop_4}</strong>
                        </a>
                        <a href="https://tanhiepangiang.vn/0a73988dH47f0fB" target="_blank" rel="noopener noreferrer" className="bg-[#07111F]/50 border border-cyan-500/10 rounded-xl py-4 flex flex-col items-center cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/30 transition-all">
                          <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">OCOP 5 SAO</span>
                          <strong className="text-3xl text-[#FDBA74] font-mono">{currentZoneData.b2.ocop_5}</strong>
                        </a>
                      </div>
                    </div>

                    {/* Khối Thường & Dịch Vụ - 2 cột cùng 1 row */}
                    <div className="grid grid-cols-2 gap-4">
                      <a href="https://tanhiepangiang.vn/1a7dBc4hEa25E3D" target="_blank" rel="noopener noreferrer" className="bg-[#122A4E]/30 rounded-xl border border-cyan-500/10 flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/50 transition-all">
                        <span className="text-[10px] text-slate-300 uppercase block mb-1">Tổng Số Sản Phẩm Thường</span>
                        <strong className="text-2xl font-mono text-emerald-400">{currentZoneData.b2.sp_thuong}</strong>
                      </a>
                      <a href="https://tanhiepangiang.vn/1b79B33dH0B97f3" target="_blank" rel="noopener noreferrer" className="bg-[#122A4E]/30 rounded-xl border border-cyan-500/10 flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-cyan-400 hover:bg-[#122A4E]/50 transition-all">
                        <span className="text-[10px] text-slate-300 uppercase block mb-1">Tổng Số Dịch Vụ</span>
                        <strong className="text-2xl font-mono text-orange-400">{currentZoneData.b2.dv}</strong>
                      </a>
                    </div>
                  </div>

                  {/* Vùng Donut Chart */}
                  <div className="mt-auto border-t border-cyan-500/10 pt-4 relative">
                    <span className="text-xs font-bold text-slate-300 uppercase block mb-6">
                      TỈ LỆ CÁC LOẠI SẢN PHẨM
                    </span>

                    <div className="flex justify-center relative pb-4">
                      {/* Vòng Donut bằng CSS */}
                      {(() => {
                        const total = currentZoneData.b2.total || 1;
                        const p_ocop = (currentZoneData.b2.ocop_total / total) * 100;
                        const p_thuong = (currentZoneData.b2.sp_thuong / total) * 100;
                        const p_dv = (currentZoneData.b2.dv / total) * 100;

                        return (
                          <div className="relative w-40 h-40">
                            {/* Conic gradient background */}
                            <div
                              className="w-full h-full rounded-full"
                              style={{
                                background: `conic-gradient(
                                  #60A5FA 0% ${p_ocop}%, 
                                  #C084FC ${p_ocop}% ${p_ocop + p_thuong}%, 
                                  #FDBA74 ${p_ocop + p_thuong}% 100%
                                )`
                              }}
                            ></div>
                            {/* Inner circle cut out */}
                            <div className="absolute inset-0 m-auto w-20 h-20 bg-[#0A2540] rounded-full"></div>

                            {/* Labels positioned absolutely */}
                            <div className="absolute top-0 -right-16 text-[9px] text-slate-300 flex flex-col items-center">
                              <span className="uppercase">Sản Phẩm OCOP</span>
                              <span className="font-mono">{p_ocop.toFixed(1)}%</span>
                            </div>
                            <div className="absolute bottom-[-15px] right-0 text-[9px] text-slate-300 flex flex-col items-center w-full text-center">
                              <span className="uppercase">Sản Phẩm Thường</span>
                              <span className="font-mono">{p_thuong.toFixed(1)}%</span>
                            </div>
                            <div className="absolute top-1/2 -left-12 -translate-y-1/2 text-[9px] text-slate-300 flex flex-col items-center">
                              <span className="uppercase">Dịch Vụ</span>
                              <span className="font-mono">{p_dv.toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })()}
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
                    <a
                      href="https://tanhiepangiang.vn/8fBhB2Ff059dA08"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-cyan-400 flex items-center gap-2 hover:text-cyan-200 transition-colors cursor-pointer"
                    >
                      <Globe className="h-5 w-5" /> B6. DU LỊCH - ẨM THỰC - LỄ HỘI
                    </a>
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
                {/* B9. CĐS DOANH NGHIỆP (Dùng dữ liệu từ layer1.b9) */}
                <div className="bg-[#0A2540] border border-cyan-500/15 rounded-3xl p-5 flex flex-col justify-between lg:col-span-2">
                  <div className="border-b border-cyan-500/10 pb-3 mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Compass className="h-5 w-5" /> B9. CĐS DOANH NGHIỆP TOÀN DIỆN
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hộ kinh doanh */}
                    <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-4">
                      <span className="text-xs font-bold text-cyan-400 block mb-3">1. Hộ Kinh Doanh Cá Thể</span>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-slate-300"><span>Tổng số hộ:</span> <span className="font-mono text-white">{activeMetrics.layer1.b9?.households?.total?.toLocaleString() || '0'}</span></div>
                        <div className="flex justify-between text-xs text-slate-300"><span>Thanh toán số:</span> <span className="font-mono text-emerald-400">{activeMetrics.layer1.b9?.households?.digitalPay?.toLocaleString() || '0'}</span></div>
                        <div className="flex justify-between text-xs text-slate-300"><span>Bán hàng Ecom:</span> <span className="font-mono text-cyan-400">{activeMetrics.layer1.b9?.households?.ecom?.toLocaleString() || '0'}</span></div>
                      </div>
                    </div>
                    {/* SME */}
                    <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-4">
                      <span className="text-xs font-bold text-indigo-400 block mb-3">2. Doanh nghiệp vừa và nhỏ</span>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-slate-300"><span>Tổng số DN:</span> <span className="font-mono text-white">{activeMetrics.layer1.b9?.smes?.total || '0'}</span></div>
                        <div className="flex justify-between text-xs text-slate-300"><span>Sử dụng Cloud:</span> <span className="font-mono text-cyan-400">{activeMetrics.layer1.b9?.smes?.cloud || '0'}</span></div>
                        <div className="flex justify-between text-xs text-slate-300"><span>Hệ thống QLDN:</span> <span className="font-mono text-amber-400">{activeMetrics.layer1.b9?.smes?.erp || '0'}</span></div>
                      </div>
                    </div>
                    {/* DN Lớn */}
                    <div className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-4">
                      <span className="text-xs font-bold text-purple-400 block mb-3">3. DN Lớn & Tiên phong AI</span>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-slate-300"><span>Doanh nghiệp lớn:</span> <span className="font-mono text-white">{activeMetrics.layer1.b9?.large?.total || '0'}</span></div>
                        <div className="flex justify-between text-xs text-slate-300"><span>Tự động hóa:</span> <span className="font-mono text-emerald-400">{activeMetrics.layer1.b9?.large?.automation || '0'}</span></div>
                        <div className="flex justify-between text-xs text-slate-300"><span>Ứng dụng AI:</span> <span className="font-mono text-rose-400">{activeMetrics.layer1.b9?.large?.ai || '0'}</span></div>
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubAE === sub.id
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
                          <span>DN CĐS:</span>{' '}
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
                    className={`bg-[#122A4E]/30 p-4 rounded-xl border ${activeMetrics.layer2.nhomC.trainingCourses.year === 0
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
                          <span>Hệ thống QLDN:</span>{' '}
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
                            className={`font-mono font-bold ${activeMetrics.layer2.nhomC.trainingCourses
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

          {/* TAB 4: TẦNG 3 - DỰ ÁN KÊU GỌI ĐẦU TƯ - QUY HOẠCH */}
          {activeTab === 'layer-3' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-indigo-400 flex items-center gap-2">
                  <Landmark className="h-6 w-6" /> TẦNG 3: DỰ ÁN KÊU GỌI ĐẦU TƯ - QUY HOẠCH
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Thông tin các dự án kêu gọi đầu tư và thông tin quy hoạch tại địa phương
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ 1: Dự án kêu gọi đầu tư */}
                <a
                  href="https://quanly.tanhiepangiang.vn/52E03fH4A71038A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-6 flex flex-col cursor-pointer hover:bg-[#122A4E]/50 hover:border-cyan-400 transition-all block"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-white uppercase tracking-wider">DỰ ÁN KÊU GỌI ĐẦU TƯ</span>
                    <strong className="text-2xl font-black font-mono text-cyan-400">{activeMetrics.layer3.investmentProjects.total}</strong>
                  </div>
                  <div className="relative flex-1 flex mt-2">
                    {/* ... (Giữ nguyên cấu trúc trục và lưới) ... */}
                    <div className="relative h-full flex flex-col justify-between py-1 z-10 gap-4">
                      {[
                        { val: activeMetrics.layer3.investmentProjects.month, color: 'bg-[#FDBA74]' },
                        { val: activeMetrics.layer3.investmentProjects.quarter, color: 'bg-[#C084FC]' },
                        { val: activeMetrics.layer3.investmentProjects.year, color: 'bg-[#60A5FA]' },
                        { val: activeMetrics.layer3.investmentProjects.total, color: 'bg-[#FDE047]' },
                      ].map((item, idx) => (
                        <div key={idx} className="w-full flex items-center h-8">
                          <div className={`h-full ${item.color} rounded-r-sm flex items-center justify-end pr-2 text-slate-900 font-medium text-sm transition-all duration-500`}
                            style={{ width: `${activeMetrics.layer3.investmentProjects.total > 0 ? (item.val / activeMetrics.layer3.investmentProjects.total) * 100 : 0}%` }}>
                            {item.val > 0 ? item.val : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </a>

                {/* Biểu đồ 2: Thông tin quy hoạch (Có Link) */}
                <a
                  href="https://tanhiepangiang.vn/5c0h8e5b050d903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-6 flex flex-col cursor-pointer hover:bg-[#122A4E]/50 hover:border-cyan-400 transition-all block"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-white uppercase tracking-wider">THÔNG TIN QUY HOẠCH</span>
                    <strong className="text-2xl font-black font-mono text-cyan-400">{activeMetrics.layer3.planningInfo.total}</strong>
                  </div>
                  <div className="relative flex-1 flex mt-2">
                    {/* ... (Giữ nguyên cấu trúc trục và lưới) ... */}
                    <div className="relative h-full flex flex-col justify-between py-1 z-10 gap-4">
                      {[
                        { val: activeMetrics.layer3.planningInfo.month, color: 'bg-[#FDBA74]' },
                        { val: activeMetrics.layer3.planningInfo.quarter, color: 'bg-[#C084FC]' },
                        { val: activeMetrics.layer3.planningInfo.year, color: 'bg-[#60A5FA]' },
                        { val: activeMetrics.layer3.planningInfo.total, color: 'bg-[#FDE047]' },
                      ].map((item, idx) => (
                        <div key={idx} className="w-full flex items-center h-8">
                          <div className={`h-full ${item.color} rounded-r-sm flex items-center justify-end pr-2 text-slate-900 font-medium text-sm transition-all duration-500`}
                            style={{ width: `${activeMetrics.layer3.planningInfo.total > 0 ? (item.val / activeMetrics.layer3.planningInfo.total) * 100 : 0}%` }}>
                            {item.val > 0 ? item.val : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'layer-4' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-amber-400 flex items-center gap-2">
                  <Briefcase className="h-6 w-6" /> TẦNG 4: CHÍNH SÁCH & GIẢI ĐÁP KIẾN NGHỊ
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Các chính sách hỗ trợ doanh nghiệp và danh sách các góp ý kiến nghị của người dân
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ 1: Chính sách hỗ trợ (CÓ LINK) */}
                <a
                  href="https://tanhiepangiang.vn/5aE67hA421AdC5C"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-6 flex flex-col cursor-pointer hover:bg-[#122A4E]/50 hover:border-cyan-400 transition-all block"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-white uppercase tracking-wider">CHÍNH SÁCH HỖ TRỢ</span>
                    <strong className="text-2xl font-black font-mono text-cyan-400">{activeMetrics.layer4.policy.total}</strong>
                  </div>
                  <div className="space-y-4">
                    {['Doanh nghiệp', 'Hộ kinh doanh', 'Hợp tác xã'].map((label, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-xs text-slate-300 w-24">{label}</span>
                        <div className="flex-1 h-6 bg-[#07111F] flex items-center">
                          <div className="h-full bg-[#86EFAC]" style={{ width: `${(activeMetrics.layer4.policy.total > 0 ? (i === 0 ? activeMetrics.layer4.policy.enterprise : i === 1 ? activeMetrics.layer4.policy.household : activeMetrics.layer4.policy.cooperative) / activeMetrics.layer4.policy.total * 100 : 0)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </a>

                {/* Biểu đồ 2: Giải đáp kiến nghị (CÓ LINK) */}
                <a
                  href="https://quanly.tanhiepangiang.vn/1cHf9b5674Ad2e2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#122A4E]/30 border border-cyan-500/10 rounded-2xl p-6 flex flex-col cursor-pointer hover:bg-[#122A4E]/50 hover:border-cyan-400 transition-all block"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-white uppercase tracking-wider">GIẢI ĐÁP KIẾN NGHỊ</span>
                    <strong className="text-2xl font-black font-mono text-cyan-400">{activeMetrics.layer4.feedback.total}</strong>
                  </div>
                  <div className="space-y-4">
                    {['Đã giải đáp', 'Chưa giải đáp', 'Xem xét'].map((label, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-xs text-slate-300 w-24">{label}</span>
                        <div className="flex-1 h-6 bg-[#07111F] flex items-center">
                          <div className="h-full bg-[#FB7185]" style={{ width: `${(activeMetrics.layer4.feedback.total > 0 ? (i === 0 ? activeMetrics.layer4.feedback.resolved : i === 1 ? activeMetrics.layer4.feedback.pending : activeMetrics.layer4.feedback.reviewing) / activeMetrics.layer4.feedback.total * 100 : 0)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* TAB 6: TẦNG 5 - O2O & HUB XANH */}
          {activeTab === 'layer-5' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-emerald-400 flex items-center gap-2">
                  <Network className="h-6 w-6" /> TẦNG 5: ĐIỂM TRƯNG BÀY/HỘI QUÁN
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

          {activeTab === 'stats-report' && (
            <div className="bg-[#0A2540] border border-cyan-500/10 rounded-3xl p-6 flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="border-b border-cyan-500/10 pb-4">
                <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
                  <Activity className="h-6 w-6" /> THỐNG KÊ BÁO CÁO
                </h2>
              </div>

              {/* B1 & B2 Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10">
                  <h3 className="text-sm font-bold text-white mb-4">TỔNG HỢP B1 (ĐƠN VỊ KINH DOANH)</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>Tổng số đơn vị: <span className="font-bold text-white">{currentZoneData.b1.total.toLocaleString()}</span></p>
                    <p>Đã chuyển đổi số: <span className="font-bold text-emerald-400">{(currentZoneData.b1.dn_cds + currentZoneData.b1.hkd_cds + currentZoneData.b1.htx_cds).toLocaleString()}</span></p>
                  </div>
                </div>
                <div className="bg-[#122A4E]/30 p-5 rounded-2xl border border-cyan-500/10">
                  <h3 className="text-sm font-bold text-white mb-4">TỔNG HỢP B2 (SẢN PHẨM)</h3>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>Tổng sản phẩm/dịch vụ: <span className="font-bold text-white">{currentZoneData.b2.total.toLocaleString()}</span></p>
                    {/* Dữ liệu lấy từ currentZoneData.b2.ocop_total thay vì activeMetrics */}
                    <p>Sản phẩm OCOP: <span className="font-bold text-emerald-400">{currentZoneData.b2.ocop_total.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>

              {/* Biểu đồ Doanh thu theo kỳ */}
              <div className="bg-[#122A4E]/30 p-6 rounded-2xl border border-cyan-500/10">
                <h3 className="text-sm font-bold text-white mb-6 uppercase">Biểu đồ doanh thu theo các mốc thời gian</h3>
                <div className="h-64 flex items-end gap-6 pb-2 border-b border-slate-700">
                  {Object.keys(periodicData).map((period) => {
                    const rev = periodicData[period].layer1.b3.revenue || 0;
                    return (
                      <div key={period} className="flex flex-col items-center flex-1">
                        <div
                          className="w-12 bg-cyan-500 rounded-t-lg hover:bg-cyan-400 transition-all"
                          style={{ height: `${rev > 0 ? rev * 10 : 5}px` }}
                        ></div>
                        <span className="text-[10px] text-slate-400 mt-2">{period}</span>
                      </div>
                    );
                  })}
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
                    Sử dụng mô hình ngôn ngữ lớn **Gemini-3.1-Flash-Lite** để tự động
                    đối chứng.
                  </p>
                </div>
                <span className="bg-purple-950/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30">
                  gemini-3.1-flash-lite
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
                        className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''
                          }`}
                      >
                        {msg.role !== 'user' && (
                          <div className="bg-cyan-500 text-slate-900 p-1.5 rounded-lg shrink-0">
                            <Bot className="h-4.5 w-4.5" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-xs ${msg.role === 'user'
                            ? 'bg-cyan-500 text-slate-900 font-bold rounded-tr-none'
                            : 'bg-[#122A4E]/50 text-slate-100 border border-cyan-500/10 rounded-tl-none leading-relaxed'
                            }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`block text-[9px] mt-1.5 text-right ${msg.role === 'user'
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
                    className={`${log.includes('[SUCCESS]') || log.includes('[OK]')
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

              {/* Alert Lỗi & Lựa chọn Fallback */}
              {pdfErrorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-3 animate-in fade-in-50 duration-200">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-rose-400 uppercase">Lỗi Kết Nối Hoặc API</h5>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Hệ thống gặp sự cố khi gọi API Gemini: <span className="font-mono text-rose-300 break-all">{pdfErrorMsg}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2.5 justify-end">
                    <button
                      onClick={handleExtractPdf}
                      disabled={isExtractingPdf}
                      className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <RefreshCw className={`h-3 w-3 ${isExtractingPdf ? 'animate-spin' : ''}`} />
                      Thử Lại
                    </button>
                    <button
                      onClick={handleLoadMockData}
                      disabled={isExtractingPdf}
                      className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-lg text-xs font-bold transition-all"
                    >
                      Sử Dụng Dữ Liệu Mẫu
                    </button>
                  </div>
                </div>
              )}

              {/* Khung Xem Trước Dữ Liệu (Preview Data) */}
              {extractedPdfData && (
                <div className="mt-4 border-t border-emerald-500/20 pt-4 animate-in slide-in-from-bottom-2">
                  <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="h-4 w-4" /> BẢN XEM TRƯỚC DỮ LIỆU ĐÃ TRÍCH XUẤT TỪ PDF
                    {extractedPdfPeriod && (
                      <span className="text-white bg-emerald-500/20 px-2 py-0.5 rounded-full ml-1">
                        (Tháng {extractedPdfPeriod.thang}/{extractedPdfPeriod.nam})
                      </span>
                    )}:
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
            Hệ thống đồng bộ dữ liệu song song theo chuẩn bảo
            mật IOC xã Tân Hiệp.
          </span>
        </div>
        <div>
          <span>© 2026 Ban Chỉ Đạo Chuyển Đổi Số Xã Tân Hiệp.</span>
        </div>
      </footer>
    </div>
  );
}
