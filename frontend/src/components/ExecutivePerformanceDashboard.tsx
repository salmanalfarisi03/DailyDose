'use client';

import React, { useState, useEffect } from 'react';
import {
  Banknote,
  ShoppingBag,
  Percent,
  Coins,
  Download,
  Plus,
  Search,
  Bell,
  Moon,
  Sun,
  Grid,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  X,
  Send,
  AlertTriangle,
  Mail,
  Phone,
  Building,
} from 'lucide-react';

interface ExecutivePerformanceDashboardProps {
  onPlanCampaign?: () => void;
  onOpenLeads?: () => void;
  onOpenCampaigns?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAiSuite?: () => void;
  onOpenDiagnosticsModal?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface LeadItem {
  id: number;
  initials: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  value: string;
  stage: string;
  score: number;
  scoreColor: string;
}

export const ExecutivePerformanceDashboard: React.FC<ExecutivePerformanceDashboardProps> = ({
  onPlanCampaign,
  onOpenLeads,
  onOpenCampaigns,
  onOpenAnalytics,
  onOpenDiagnosticsModal,
  isDarkMode: propIsDarkMode,
  onToggleDarkMode,
}) => {
  // Theme & Canvas States
  const [accentTheme, setAccentTheme] = useState<'indigo' | 'terracotta'>('indigo');
  const [internalDarkMode, setInternalDarkMode] = useState(false);
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : internalDarkMode;

  // Real-time Live Clock State
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLiveHeaderTime = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dayName = days[date.getDay()];
    const dayDate = date.getDate();
    const monthName = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${dayName}, ${dayDate} ${monthName} • ${hours}:${minutes}:${seconds} WIB`;
  };

  const formatLiveBannerDate = (date: Date) => {
    const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    const months = [
      'JANUARI',
      'FEBRUARI',
      'MARET',
      'APRIL',
      'MEI',
      'JUNI',
      'JULI',
      'AGUSTUS',
      'SEPTEMBER',
      'OKTOBER',
      'NOVEMBER',
      'DESEMBER',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} • RINGKASAN EKSEKUTIF`;
  };

  const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 4 && hour < 11) return 'Selamat pagi';
    if (hour >= 11 && hour < 15) return 'Selamat siang';
    if (hour >= 15 && hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const handleToggleTheme = () => {
    if (onToggleDarkMode) {
      onToggleDarkMode();
    } else {
      setInternalDarkMode(!internalDarkMode);
    }
    showToast(!isDarkMode ? 'Mode gelap kanvas diaktifkan' : 'Mode terang diaktifkan');
  };

  const [performanceRange, setPerformanceRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [channelTab, setChannelTab] = useState<'revenue' | 'orders' | 'spend'>('revenue');
  const [funnelFilter, setFunnelFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Modals & Drawers
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [planCampaignModal, setPlanCampaignModal] = useState(false);
  const [funnelModalOpen, setFunnelModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Campaign Form State
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampChannel, setNewCampChannel] = useState('Penelusuran Berbayar');
  const [newCampBudget, setNewCampBudget] = useState('15000000');
  const [newCampRoas, setNewCampRoas] = useState('4.8');

  // AI Quick Chat inside Dashboard
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      sender: 'ai',
      text: 'Halo Pak Aditya! Saya adalah Asisten AI Eksekutif DailyDose. Saya mengawasi 9 q pemasaran aktif, realisasi anggaran Oktober, dan pipeline penjualan Rp 346 Juta. Ada yang ingin Anda optimalkan hari ini?',
      time: '09:48',
    },
  ]);
  const [aiThinking, setAiThinking] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Hover Tooltip on SVG Chart
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    date: string;
    actual: string;
    prev: string;
    note?: string;
  } | null>(null);

  // Live Campaigns State
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: 'Brand Search — Highmoor',
      channel: 'Penelusuran Berbayar • 71 hari tersisa',
      spent: 'Rp 46,1 Jt',
      budget: 'Rp 73,3 Jt',
      percent: 63,
      roas: '5.42× ROAS',
      revenue: 'Rp 249.512.000 omzet',
      active: true,
    },
    {
      id: 2,
      title: 'Weekly Trail Notes',
      channel: 'Email Marketing • 61 hari tersisa',
      spent: 'Rp 5,5 Jt',
      budget: 'Rp 9,0 Jt',
      percent: 61,
      roas: '660 pesanan',
      revenue: 'Rp 87.760.000 omzet',
      active: true,
    },
    {
      id: 3,
      title: 'Cart Rescue Flow',
      channel: 'Email Marketing • 91 hari tersisa',
      spent: 'Rp 4,9 Jt',
      budget: 'Rp 9,0 Jt',
      percent: 54,
      roas: '589 pesanan',
      revenue: 'Rp 78.234.000 omzet',
      active: true,
    },
    {
      id: 4,
      title: 'Trail Runner Retargeting',
      channel: 'Media Sosial Berbayar • 21 hari tersisa',
      spent: 'Rp 11,2 Jt',
      budget: 'Rp 19,0 Jt',
      percent: 59,
      roas: '4.08× ROAS',
      revenue: 'Rp 45.645.000 omzet',
      active: true,
    },
    {
      id: 5,
      title: 'Tents & Shelters Shopping',
      channel: 'Penelusuran Berbayar • 31 hari tersisa',
      spent: 'Rp 5,7 Jt',
      budget: 'Rp 12,2 Jt',
      percent: 47,
      roas: '5.47× ROAS',
      revenue: 'Rp 31.422.000 omzet',
      active: true,
    },
    {
      id: 6,
      title: 'Fall Layering Drop',
      channel: 'Media Sosial Berbayar • 10 hari tersisa',
      spent: 'Rp 6,8 Jt',
      budget: 'Rp 9,9 Jt',
      percent: 69,
      roas: '4.11× ROAS',
      revenue: 'Rp 27.777.000 omzet',
      active: true,
    },
  ]);

  // Hottest Wholesale Leads
  const leadsData: LeadItem[] = [
    {
      id: 1,
      initials: 'GL',
      name: 'Northfork Outfitters',
      contact: 'Grace Liang • Missoula, MT',
      phone: '+1 (406) 555-0192',
      email: 'grace@northforkoutfitters.com',
      value: 'Rp 41.200.000',
      stage: 'Proposal Terkirim',
      score: 77,
      scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
    {
      id: 2,
      initials: 'RS',
      name: 'Silvercreek Engineering',
      contact: 'Rachel Stein • Boise, ID',
      phone: '+1 (208) 555-8314',
      email: 'r.stein@silvercreek.org',
      value: 'Rp 9.800.000',
      stage: 'Negosiasi Kontrak',
      score: 71,
      scoreColor: 'text-amber-700 bg-amber-50 border-amber-300',
    },
    {
      id: 3,
      initials: 'NF',
      name: 'Brightline Software',
      contact: 'Noah Fischer • Seattle, WA',
      phone: '+1 (206) 555-9271',
      email: 'noah@brightline.io',
      value: 'Rp 18.900.000',
      stage: 'Kualifikasi Anggaran',
      score: 70,
      scoreColor: 'text-amber-700 bg-amber-50 border-amber-300',
    },
    {
      id: 4,
      initials: 'HO',
      name: 'Cascade Basecamp Supply',
      contact: 'Hannah Okafor • Bend, OR',
      phone: '+1 (541) 555-4819',
      email: 'hannah@cascadebasecamp.com',
      value: 'Rp 28.400.000',
      stage: 'Review Proposal',
      score: 68,
      scoreColor: 'text-slate-600 bg-slate-50 border-slate-300',
    },
    {
      id: 5,
      initials: 'FL',
      name: 'Alder & Ash Mercantile',
      contact: 'Freya Lindqvist • Ketchum, ID',
      phone: '+1 (208) 555-3920',
      email: 'freya@alderandash.com',
      value: 'Rp 17.400.000',
      stage: 'Diskusi Kebutuhan',
      score: 65,
      scoreColor: 'text-slate-600 bg-slate-50 border-slate-300',
    },
  ];

  const toggleCampaign = (id: number) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextActive = !c.active;
          showToast(
            `Kampanye "${c.title}" ${nextActive ? 'diaktifkan kembali' : 'dijeda sementara'}`
          );
          return { ...c, active: nextActive };
        }
        return c;
      })
    );
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) return;

    const budgetFormatted = (Number(newCampBudget) / 1000000).toFixed(1).replace('.', ',');
    const newCamp = {
      id: Date.now(),
      title: newCampTitle.trim(),
      channel: `${newCampChannel} • 90 hari tersisa`,
      spent: 'Rp 0 Jt',
      budget: `Rp ${budgetFormatted} Jt`,
      percent: 0,
      roas: `${newCampRoas}× ROAS`,
      revenue: 'Rp 0 omzet',
      active: true,
    };

    setCampaigns([newCamp, ...campaigns]);
    setPlanCampaignModal(false);
    setNewCampTitle('');
    showToast(`Kampanye "${newCamp.title}" berhasil dibuat dan mulai tayang!`);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Kategori,Nilai,Perubahan,Pembanding\n' +
      'Total Pendapatan,"Rp 346.383.000",+11.9%,"Rp 309.494.000"\n' +
      'Total Pesanan,"2.705",+12.4%,"2.407"\n' +
      'Tingkat Konversi,"2.21%",+0.3%,"2.21%"\n' +
      'Imbal Hasil Iklan (ROAS),"4.61x",-1.5%,"4.68x"\n' +
      'Realisasi Anggaran Oktober,"Rp 254.000.000",85%,"Target Rp 300.000.000"\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DailyDose_Ringkasan_Performa_Eksekutif.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan CSV performa eksekutif berhasil diunduh!');
  };

  const handleSendAiMessage = () => {
    if (!aiPrompt.trim() || aiThinking) return;

    const userMsg = aiPrompt.trim();
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setAiChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: nowTime },
    ]);
    setAiPrompt('');
    setAiThinking(true);

    setTimeout(() => {
      let reply = '';
      const lower = userMsg.toLowerCase();
      if (lower.includes('budget') || lower.includes('anggaran') || lower.includes('over')) {
        reply =
          'Berdasarkan audit alokasi anggaran Oktober, **Penelusuran Berbayar (Google Ads)** mengalami kelebihan pengeluaran sebesar **3%** (terpakai Rp 5,7 Jt dari estimasi Rp 12,2 Jt). Rekomendasi: Alihkan 10% kuota harian ke **Endorsement Kreator** yang saat ini masih di bawah target 10% guna mempertahankan efisiensi ROAS blended 4,61×.';
      } else if (lower.includes('funnel') || lower.includes('drop') || lower.includes('keranjang')) {
        reply =
          'Analisis Corong Konversi menunjukkan titik penurunan terbesar terjadi pada tahap **Masuk Keranjang (12,7% konversi, 9.201 sesi)**. Sebanyak 87,3% calon pembeli meninggalkan keranjang tanpa melanjutkan pembayaran. Solusi segera: Aktifkan diskon langsung 5% untuk checkout pertama dan sediakan opsi pembayaran instan (QRIS / GoPay / ShopeePay).';
      } else if (lower.includes('lead') || lower.includes('prospek') || lower.includes('grace')) {
        reply =
          '**Northfork Outfitters (Grace Liang)** merupakan prospek grosir terbesar (**Rp 41.200.000**) dengan skor 77. Berkas penawaran telah dikirimkan 48 jam yang lalu. Langkah tindak lanjut: Hubungi via WhatsApp atau Email hari ini dengan menyertakan garansi retur 0% untuk mempercepat penandatanganan kontrak sebelum penutupan buku bulan ini.';
      } else {
        reply = `Analisis Asisten AI: Kinerja bisnis perusahaan saat ini sangat prima dengan total pendapatan mencapai **Rp 346.383.000** (+11,9% dibanding bulan lalu). Imbal hasil iklan rata-rata sebesar 4,61×. Untuk pertanyaan "${userMsg}", seluruh data operasional terpantau stabil sesuai target kuartal.`;
      }

      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setAiThinking(false);
    }, 800);
  };

  const primaryBtnClass = isDarkMode
    ? 'bg-zinc-100 hover:bg-white text-zinc-900 font-medium'
    : accentTheme === 'indigo'
    ? 'bg-slate-900 hover:bg-slate-800 text-white font-medium'
    : 'bg-stone-900 hover:bg-stone-800 text-white font-medium';

  const strokeColor =
    accentTheme === 'indigo'
      ? isDarkMode
        ? '#818cf8'
        : '#4f46e5'
      : isDarkMode
      ? '#fb923c'
      : '#cf5636';
  const fillGradientId = accentTheme === 'indigo' ? 'indigoGrad' : 'terracottaGrad';

  // Dynamic range calculations
  const revenueDisplay =
    performanceRange === '7d'
      ? 'Rp 89.412.000'
      : performanceRange === '90d'
      ? 'Rp 982.150.000'
      : 'Rp 346.383.000';
  const ordersDisplay =
    performanceRange === '7d' ? '684' : performanceRange === '90d' ? '7.940' : '2.705';

  // Performance chart curve data points
  const chartPoints = [
    { x: 40, y: 140, date: '22 Sep', actual: 'Rp 7,8 Jt', prev: 'Rp 6,2 Jt' },
    { x: 85, y: 135, date: '24 Sep', actual: 'Rp 8,4 Jt', prev: 'Rp 7,0 Jt' },
    { x: 130, y: 138, date: '26 Sep', actual: 'Rp 8,1 Jt', prev: 'Rp 7,5 Jt' },
    { x: 175, y: 130, date: '28 Sep', actual: 'Rp 9,2 Jt', prev: 'Rp 8,4 Jt' },
    {
      x: 220,
      y: 110,
      date: '30 Sep',
      actual: 'Rp 11,5 Jt',
      prev: 'Rp 8,8 Jt',
      note: 'Peluncuran: Fall Layering Drop',
    },
    { x: 265, y: 105, date: '2 Okt', actual: 'Rp 12,1 Jt', prev: 'Rp 9,2 Jt' },
    {
      x: 310,
      y: 82,
      date: '4 Okt',
      actual: 'Rp 14,8 Jt',
      prev: 'Rp 9,9 Jt',
      note: 'Peluncuran: Trail Runner Retargeting',
    },
    { x: 355, y: 92, date: '6 Okt', actual: 'Rp 13,6 Jt', prev: 'Rp 10,2 Jt' },
    {
      x: 400,
      y: 80,
      date: '8 Okt (Puncak)',
      actual: 'Rp 15,2 Jt',
      prev: 'Rp 10,8 Jt',
      note: 'Penjualan Tertinggi Kuartal',
    },
    { x: 445, y: 94, date: '10 Okt', actual: 'Rp 13,2 Jt', prev: 'Rp 11,0 Jt' },
    { x: 490, y: 90, date: '12 Okt', actual: 'Rp 13,9 Jt', prev: 'Rp 11,2 Jt' },
    { x: 535, y: 105, date: '14 Okt', actual: 'Rp 12,0 Jt', prev: 'Rp 11,5 Jt' },
    { x: 580, y: 98, date: '16 Okt', actual: 'Rp 12,8 Jt', prev: 'Rp 11,4 Jt' },
    { x: 625, y: 88, date: '18 Okt', actual: 'Rp 14,1 Jt', prev: 'Rp 11,8 Jt' },
    { x: 670, y: 92, date: '20 Okt', actual: 'Rp 13,5 Jt', prev: 'Rp 12,0 Jt' },
    { x: 710, y: 95, date: '21 Okt', actual: 'Rp 13,2 Jt', prev: 'Rp 12,1 Jt' },
  ];

  const actualPathD = `M 40 140 Q 60 138, 85 135 T 130 138 T 175 130 T 220 110 T 265 105 T 310 82 T 355 92 T 400 80 T 445 94 T 490 90 T 535 105 T 580 98 T 625 88 T 670 92 L 710 95`;
  const areaPathD = `${actualPathD} L 710 190 L 40 190 Z`;
  const prevPathD = `M 40 160 Q 90 155, 150 148 T 260 138 T 370 128 T 480 122 T 590 115 L 710 110`;

  const gaugePercent = 0.69;
  const needleAngle = -180 + gaugePercent * 180;

  return (
    <div
      className={`min-h-screen pb-20 font-sans transition-colors duration-300 relative ${
        isDarkMode ? 'bg-[#151722] text-zinc-100' : 'bg-[#faf8f5] text-slate-900'
      }`}
    >
      {/* Toast Notifikasi Pop-up */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP UTILITY BAR */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b px-6 py-2.5 flex items-center justify-between transition-colors ${
          isDarkMode
            ? 'bg-[#191970]/90 border-white/[0.06]'
            : 'bg-[#faf8f5]/90 border-stone-200/60'
        }`}
      >
        {/* Kiri: Breadcrumb & Versi Sistem */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              isDarkMode ? 'text-zinc-300' : 'text-slate-700'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-slate-400" />
            <span>Ringkasan</span>
          </div>
          <span className={isDarkMode ? 'text-zinc-600' : 'text-slate-300'}>/</span>
          <button
            type="button"
            onClick={onOpenDiagnosticsModal}
            title="Klik untuk membuka Diagnostik Sistem & Status Database PostgreSQL"
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
              isDarkMode
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-emerald-50 border-emerald-200/80 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            DailyDose AI Core v2.4
          </button>
        </div>

        {/* Tengah: Kolom Pencarian */}
        <div className="relative w-80 md:w-96">
          <div
            className={`w-full border rounded-full px-4 py-1.5 text-xs flex items-center gap-2 shadow-xs transition-all ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 placeholder:text-zinc-500'
                : 'bg-white border-slate-200/90 text-slate-700'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari kampanye, prospek, audiens... (Tekan Enter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = searchQuery.toLowerCase().trim();
                  if (!q) return;
                  if (q.includes('kampanye') || q.includes('iklan')) {
                    onOpenCampaigns?.();
                    showToast('Membuka halaman Kampanye Pemasaran');
                  } else if (q.includes('prospek') || q.includes('lead') || q.includes('b2b')) {
                    onOpenLeads?.();
                    showToast('Membuka pipeline Prospek B2B');
                  } else if (q.includes('analisis') || q.includes('finansial') || q.includes('omzet')) {
                    onOpenAnalytics?.();
                    showToast('Membuka Analisis Finansial');
                  } else {
                    showToast(`Hasil pencarian untuk "${searchQuery}": 1 data cocok`);
                  }
                }
              }}
              className="bg-transparent border-none outline-none w-full text-xs placeholder:text-slate-400"
            />
            <kbd
              className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                isDarkMode
                  ? 'bg-[#25293c] border-white/10 text-zinc-400'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Kanan: Tanggal, Pengubah Tema, Notifikasi, Mode Visual & Tombol Baru */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden lg:flex items-center gap-1.5 text-xs font-medium font-mono ${
              isDarkMode ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span suppressHydrationWarning>
              {mounted ? formatLiveHeaderTime(currentTime) : 'Memuat waktu...'}
            </span>
          </div>

          <div
            className={`h-4 w-[1px] hidden sm:block ${
              isDarkMode ? 'bg-white/[0.08]' : 'bg-slate-200'
            }`}
          />

          {/* Pengubah Tema Warna Aksen (Interaktif) */}
          <div
            className={`hidden sm:flex items-center border rounded-full p-0.5 shadow-xs text-[11px] ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08]' : 'bg-white border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                setAccentTheme('indigo');
                showToast('Tema aksen diubah ke Iris');
              }}
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                accentTheme === 'indigo'
                  ? isDarkMode
                    ? 'bg-white/10 text-white shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDarkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Aksen Iris"
            >
              Iris
            </button>
            <button
              onClick={() => {
                setAccentTheme('terracotta');
                showToast('Tema aksen diubah ke Terracotta');
              }}
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all cursor-pointer ${
                accentTheme === 'terracotta'
                  ? isDarkMode
                    ? 'bg-white/10 text-white shadow-xs'
                    : 'bg-stone-900 text-white shadow-xs'
                  : isDarkMode
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Aksen Terracotta"
            >
              Terra
            </button>
          </div>

          {/* Tombol Notifikasi */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 rounded-full border transition-colors shadow-xs cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1e2130] border-white/[0.08] text-zinc-300 hover:bg-[#25293c]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Notifikasi Eksekutif"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white/80" />
            </button>

            {/* Menu Pop-up Notifikasi */}
            {notificationsOpen && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border p-4 z-40 animate-in fade-in slide-in-from-top-2 ${
                  isDarkMode
                    ? 'bg-[#1e2130] border-white/10 text-zinc-100'
                    : 'bg-white border-slate-200/90 text-slate-900'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-2 border-b ${
                    isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold">Notifikasi Eksekutif</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDarkMode
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-emerald-600 bg-emerald-50'
                    }`}
                  >
                    3 Pemberitahuan
                  </span>
                </div>
                <div className="space-y-3 mt-3 text-xs">
                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      onOpenLeads?.();
                    }}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      isDarkMode ? 'bg-[#151722] hover:bg-white/[0.05]' : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">
                      🔥 Prospek Baru: Switchback Running Club
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                      }`}
                    >
                      Tomás baru saja menambahkan data prospek wholesale baru.
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setNotificationsOpen(false);
                      setBudgetModalOpen(true);
                    }}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      isDarkMode
                        ? 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-200'
                        : 'bg-amber-50 hover:bg-amber-100/70 text-amber-800'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">
                      ⚠️ Peringatan Anggaran: Penelusuran Berbayar (+3%)
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isDarkMode ? 'text-amber-300/70' : 'text-amber-600'
                      }`}
                    >
                      Pengeluaran harian Google Ads melebihi rencana sebesar 3%.
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-xl ${
                      isDarkMode
                        ? 'bg-emerald-500/10 text-emerald-200'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    <div className="font-semibold text-[11px]">
                      🎯 Target Realisasi 85% Tercapai
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isDarkMode ? 'text-emerald-300/70' : 'text-emerald-600'
                      }`}
                    >
                      Realisasi Rp 254 Jt dari target Rp 300 Jt (+Rp 46,8 Jt di atas target).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tombol Pengubah Mode Gelap/Terang */}
          <button
            onClick={handleToggleTheme}
            className={`p-2 rounded-full border transition-colors shadow-xs cursor-pointer ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/[0.08] text-amber-300 hover:bg-[#25293c]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Ubah Mode Tampilan"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Tombol Utama + Baru */}
          <button
            onClick={() => setPlanCampaignModal(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${primaryBtnClass}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Baru</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1520px] mx-auto px-6 pt-6 space-y-6">
        {/* 2. BANNER SAPAAN EKSEKUTIF */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div>
            <p
              className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono"
              suppressHydrationWarning
            >
              {mounted ? formatLiveBannerDate(currentTime) : 'RINGKASAN EKSEKUTIF'}
            </p>
            <h1
              className={`text-3xl font-extrabold tracking-tight mt-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
              suppressHydrationWarning
            >
              {mounted ? `${getGreeting(currentTime)}, Pak Aditya` : 'Selamat datang, Pak Aditya'}
            </h1>
            <p
              className={`text-sm mt-1 font-normal leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Pendapatan meningkat{' '}
              <span className="text-emerald-500 font-semibold">+11,9%</span> dibanding 30 hari
              sebelumnya.{' '}
              <button
                onClick={onOpenLeads}
                className="underline font-semibold cursor-pointer decoration-slate-400 hover:text-indigo-500 hover:decoration-indigo-500 transition"
              >
                10 prospek baru
              </button>{' '}
              menunggu tindak lanjut tim. Penelusuran berbayar melebihi alokasi anggaran.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Tombol Cepat Asisten AI */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className={`px-4 py-2 font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-white/[0.08] hover:bg-white/[0.12] text-zinc-200 border border-white/10'
                  : 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-200/80'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`} />
              <span>Tanya Asisten AI</span>
            </button>

            <button
              onClick={handleExportCSV}
              className={`px-4 py-2 border font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1e2130] border-white/[0.08] text-zinc-300 hover:bg-[#25293c]'
                  : 'bg-white border-slate-200/90 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Ekspor Data</span>
            </button>

            <button
              onClick={() => setPlanCampaignModal(true)}
              className={`px-4 py-2 font-medium text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${primaryBtnClass}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rencanakan Kampanye</span>
            </button>
          </div>
        </section>

        {/* 3. ROW 1: 4 KARTU METRIK KPI UTAMA */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Kartu 1: Total Pendapatan */}
          <div
            onClick={onOpenAnalytics}
            className={`rounded-2xl p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-md transition-all cursor-pointer group ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Banknote className="w-4 h-4 text-slate-400" />
                <span>Total Pendapatan</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight mt-2.5 mb-2 font-mono tabular-nums">
              {revenueDisplay}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                ↑ +11,9%
              </span>
              <span className="text-slate-400 font-normal">dibanding Rp 309.494.000</span>
            </div>
          </div>

          {/* Kartu 2: Total Pesanan */}
          <div
            onClick={onOpenAnalytics}
            className={`rounded-2xl p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-md transition-all cursor-pointer group ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>Total Pesanan</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight mt-2.5 mb-2 font-mono tabular-nums">
              {ordersDisplay}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                ↑ +12,4%
              </span>
              <span className="text-slate-400 font-normal">dibanding 2.407</span>
            </div>
          </div>

          {/* Kartu 3: Tingkat Konversi */}
          <div
            onClick={() => setFunnelModalOpen(true)}
            className={`rounded-2xl p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-md transition-all cursor-pointer group ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Percent className="w-4 h-4 text-slate-400" />
                <span>Tingkat Konversi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight mt-2.5 mb-2 font-mono tabular-nums">
              2,21%
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                ↑ +0,3%
              </span>
              <span className="text-slate-400 font-normal">dibanding 2,21%</span>
            </div>
          </div>

          {/* Kartu 4: Imbal Hasil Iklan (ROAS) */}
          <div
            onClick={() => setBudgetModalOpen(true)}
            className={`rounded-2xl p-5 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] hover:shadow-md transition-all cursor-pointer group ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Coins className="w-4 h-4 text-slate-400" />
                <span>Imbal Hasil Iklan (ROAS)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight mt-2.5 mb-2 font-mono tabular-nums">
              4,61×
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">
                ↓ -1,5%
              </span>
              <span className="text-slate-400 font-normal">dibanding 4,68×</span>
            </div>
          </div>
        </section>

        {/* 4. ROW 2: GRAFIK PERFORMA & KANAL PENDAPATAN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Kolom Kiri: Tren Performa Penjualan */}
          <div
            className={`lg:col-span-7 rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] flex flex-col justify-between ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div>
                  <h3
                    className={`font-extrabold text-base tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Tren Performa Penjualan
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-normal">
                    {performanceRange === '7d'
                      ? '7 hari terakhir dibandingkan 7 hari sebelumnya'
                      : performanceRange === '90d'
                      ? '90 hari terakhir dibandingkan 90 hari sebelumnya'
                      : '30 hari terakhir dibandingkan 30 hari sebelumnya'}
                  </p>
                </div>

                {/* Pengubah Rentang Periode */}
                <div
                  className={`flex items-center p-0.5 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-[#151722] border-white/[0.06]' : 'bg-slate-100 border-slate-200/70'
                  }`}
                >
                  {(['7d', '30d', '90d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setPerformanceRange(r);
                        showToast(`Rentang data diubah ke ${r}`);
                      }}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        performanceRange === r
                          ? isDarkMode
                            ? 'bg-[#282c3f] text-zinc-100 shadow-xs'
                            : 'bg-white text-slate-900 shadow-xs'
                          : isDarkMode
                          ? 'text-zinc-400 hover:text-zinc-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {r === '7d' ? '7 Hari' : r === '30d' ? '30 Hari' : '90 Hari'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kurva Area SVG Interaktif */}
              <div className="relative w-full h-56 pt-2 select-none">
                <svg
                  viewBox="0 0 740 220"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
                      <stop offset="70%" stopColor="#818cf8" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="terracottaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cf5636" stopOpacity="0.24" />
                      <stop offset="70%" stopColor="#ea580c" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Garis Kisi Horizontal & Nilai Sumbu Y */}
                  <g className="text-[10px] fill-slate-400 font-mono">
                    <line
                      x1="30"
                      y1="40"
                      x2="720"
                      y2="40"
                      stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                      strokeDasharray="4 4"
                    />
                    <text x="25" y="44" textAnchor="end">
                      Rp 20 Jt
                    </text>

                    <line
                      x1="30"
                      y1="115"
                      x2="720"
                      y2="115"
                      stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                      strokeDasharray="4 4"
                    />
                    <text x="25" y="119" textAnchor="end">
                      Rp 10 Jt
                    </text>

                    <line
                      x1="30"
                      y1="190"
                      x2="720"
                      y2="190"
                      stroke={isDarkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}
                    />
                    <text x="25" y="194" textAnchor="end">
                      Rp 0
                    </text>
                  </g>

                  {/* Kurva Putus-putus Periode Sebelumnya */}
                  <path
                    d={prevPathD}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Gradien Fill Aktual */}
                  <path d={areaPathD} fill={`url(#${fillGradientId})`} />

                  {/* Garis Solid Aktual */}
                  <path
                    d={actualPathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Titik Penanda Kampanye */}
                  <g>
                    {/* Titik Sep 30 */}
                    <circle
                      cx="220"
                      cy="110"
                      r="4.5"
                      fill="#ffffff"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:scale-125"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          x: 220,
                          y: 110,
                          date: '30 Sep',
                          actual: 'Rp 11,5 Jt',
                          prev: 'Rp 8,8 Jt',
                          note: 'Peluncuran: Fall Layering Drop',
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() =>
                        showToast('Detail Kampanye: Fall Layering Drop (ROAS 4,11×)')
                      }
                    />

                    {/* Titik Oct 4 */}
                    <circle
                      cx="310"
                      cy="82"
                      r="4.5"
                      fill="#ffffff"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:scale-125"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          x: 310,
                          y: 82,
                          date: '4 Okt',
                          actual: 'Rp 14,8 Jt',
                          prev: 'Rp 9,9 Jt',
                          note: 'Peluncuran: Trail Runner Retargeting',
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() =>
                        showToast('Detail Kampanye: Trail Runner Retargeting (ROAS 4,08×)')
                      }
                    />

                    {/* Titik Puncak Oct 8 */}
                    <circle
                      cx="400"
                      cy="80"
                      r="5.5"
                      fill={strokeColor}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          x: 400,
                          y: 80,
                          date: '8 Okt (Puncak Penjualan)',
                          actual: 'Rp 15,2 Jt',
                          prev: 'Rp 10,8 Jt',
                          note: 'Rekor Penjualan Harian Tertinggi',
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>

                  {/* Area Hover Titik Transparan */}
                  {chartPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          x: pt.x,
                          y: pt.y,
                          date: pt.date,
                          actual: pt.actual,
                          prev: pt.prev,
                          note: pt.note,
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </svg>

                {/* Tooltip Interaktif Saat Hover */}
                {hoveredPoint && (
                  <div
                    className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700 transition-all -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${(hoveredPoint.x / 740) * 100}%`,
                      top: `${(hoveredPoint.y / 220) * 100 - 10}%`,
                    }}
                  >
                    <div className="font-semibold text-slate-200 text-[11px]">
                      {hoveredPoint.date}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-emerald-400 font-bold">
                        {hoveredPoint.actual}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        (Lalu: {hoveredPoint.prev})
                      </span>
                    </div>
                    {hoveredPoint.note && (
                      <div className="mt-1 text-[10px] text-blue-300 font-medium">
                        ● {hoveredPoint.note}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tanggal Sumbu X */}
              <div className="flex justify-between text-[10.5px] font-mono text-slate-400 px-6 pt-1">
                <span>22 Sep</span>
                <span className="hidden sm:inline">24 Sep</span>
                <span>26 Sep</span>
                <span className="hidden sm:inline">28 Sep</span>
                <span className="text-blue-500 font-semibold">30 Sep</span>
                <span className="hidden sm:inline">2 Okt</span>
                <span className="text-blue-500 font-semibold">4 Okt</span>
                <span className="hidden sm:inline">6 Okt</span>
                <span className="font-bold text-indigo-400">8 Okt</span>
                <span className="hidden sm:inline">10 Okt</span>
                <span>12 Okt</span>
                <span className="hidden sm:inline">14 Okt</span>
                <span>16 Okt</span>
                <span className="hidden sm:inline">18 Okt</span>
                <span>20 Okt</span>
                <span>21 Okt</span>
              </div>
            </div>

            {/* Legenda Bawah */}
            <div className="flex items-center flex-wrap gap-5 text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: strokeColor }}
                />
                <span className="font-medium">Periode ini (Aktual)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 border-t-2 border-dashed border-slate-400" />
                <span>Periode sebelumnya</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white" />
                <span>Peluncuran kampanye — klik untuk detail</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Sumber Kanal Pendapatan */}
          <div
            className={`lg:col-span-5 rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] flex flex-col justify-between ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className={`font-extrabold text-base tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Sumber Kanal Pendapatan
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-normal">
                    Berdasarkan kanal, periode yang sama
                  </p>
                </div>

                <div
                  className={`flex items-center p-0.5 rounded-xl border text-xs font-semibold ${
                    isDarkMode ? 'bg-[#151722] border-white/[0.06]' : 'bg-slate-100 border-slate-200/70'
                  }`}
                >
                  {(['revenue', 'orders', 'spend'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setChannelTab(t);
                        showToast(
                          `Metrik kanal diubah ke ${
                            t === 'revenue' ? 'PENDAPATAN' : t === 'orders' ? 'PESANAN' : 'PENGELUARAN'
                          }`
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                        channelTab === t
                          ? isDarkMode
                            ? 'bg-[#282c3f] text-zinc-100 shadow-xs'
                            : 'bg-white text-slate-900 shadow-xs'
                          : isDarkMode
                          ? 'text-zinc-400 hover:text-zinc-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t === 'revenue' ? 'Omzet' : t === 'orders' ? 'Pesanan' : 'Biaya'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Proporsional Berwarna */}
              <div className="h-2.5 w-full rounded-full overflow-hidden flex my-3.5 shadow-inner">
                <div style={{ width: '24%' }} className="bg-amber-400" title="Penelusuran Berbayar 24%" />
                <div style={{ width: '23%' }} className="bg-emerald-500" title="Pencarian Organik 23%" />
                <div style={{ width: '22%' }} className="bg-teal-400" title="Email Marketing 22%" />
                <div style={{ width: '19%' }} className="bg-blue-600" title="Media Sosial 19%" />
                <div style={{ width: '7%' }} className="bg-indigo-600" title="Rujukan Kemitraan 7%" />
                <div style={{ width: '5%' }} className="bg-purple-500" title="Kreator 5%" />
              </div>

              {/* Rincian Kanal */}
              <div className="space-y-3 pt-1">
                {/* 1. Paid search */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="font-semibold">Penelusuran Berbayar</span>
                      <span className="text-[11px] text-slate-400">2,8% konversi</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold">
                        {channelTab === 'revenue'
                          ? 'Rp 83.368.000'
                          : channelTab === 'orders'
                          ? '649 pesanan'
                          : 'Rp 18.120.000'}
                      </span>
                      <span className="text-slate-400 text-[11px] w-7 text-right">24%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[24%]" />
                  </div>
                </div>

                {/* 2. Organic */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold">Pencarian Organik (SEO)</span>
                      <span className="text-[11px] text-slate-400">2,0% konversi</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold">
                        {channelTab === 'revenue'
                          ? 'Rp 80.633.000'
                          : channelTab === 'orders'
                          ? '622 pesanan'
                          : 'Rp 0'}
                      </span>
                      <span className="text-slate-400 text-[11px] w-7 text-right">23%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[23%]" />
                  </div>
                </div>

                {/* 3. Email */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      <span className="font-semibold">Pemasaran Email</span>
                      <span className="text-[11px] text-slate-400">3,6% konversi</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold">
                        {channelTab === 'revenue'
                          ? 'Rp 75.859.000'
                          : channelTab === 'orders'
                          ? '595 pesanan'
                          : 'Rp 3.200.000'}
                      </span>
                      <span className="text-slate-400 text-[11px] w-7 text-right">22%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full w-[22%]" />
                  </div>
                </div>

                {/* 4. Paid social */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="font-semibold">Media Sosial Berbayar</span>
                      <span className="text-[11px] text-slate-400">1,7% konversi</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold">
                        {channelTab === 'revenue'
                          ? 'Rp 65.200.000'
                          : channelTab === 'orders'
                          ? '514 pesanan'
                          : 'Rp 16.000.000'}
                      </span>
                      <span className="text-slate-400 text-[11px] w-7 text-right">19%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[19%]" />
                  </div>
                </div>

                {/* 5. Referral */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span className="font-semibold">Rujukan Kemitraan</span>
                      <span className="text-[11px] text-slate-400">2,3% konversi</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold">
                        {channelTab === 'revenue'
                          ? 'Rp 22.571.000'
                          : channelTab === 'orders'
                          ? '189 pesanan'
                          : 'Rp 1.100.000'}
                      </span>
                      <span className="text-slate-400 text-[11px] w-7 text-right">7%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full w-[7%]" />
                  </div>
                </div>

                {/* 6. Creators */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="font-semibold">Endorsement Kreator</span>
                      <span className="text-[11px] text-slate-400">1,4% konversi</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold">
                        {channelTab === 'revenue'
                          ? 'Rp 18.752.000'
                          : channelTab === 'orders'
                          ? '136 pesanan'
                          : 'Rp 4.075.000'}
                      </span>
                      <span className="text-slate-400 text-[11px] w-7 text-right">5%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full w-[5%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Kotak Insight */}
            <div
              className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
                isDarkMode
                  ? 'bg-[#151722] border-white/[0.06] text-zinc-300'
                  : 'bg-slate-50 border-slate-200/70 text-slate-600'
              }`}
            >
              Setiap <strong className="font-semibold">Rp 1.000</strong> pada kanal berbayar
              menghasilkan <strong className="text-indigo-400 font-bold">Rp 4.610 ROAS</strong>{' '}
              dalam 30 hari terakhir.
            </div>
          </div>
        </section>

        {/* 5. ROW 3: KAMPANYE BERJALAN & CORONG PENJUALAN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Kolom Kiri: Kampanye Berjalan */}
          <div
            className={`lg:col-span-7 rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className={`font-extrabold text-base tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Kampanye Berjalan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {campaigns.length} kampanye aktif terhadap alokasi anggaran
                </p>
              </div>

              <button
                onClick={onOpenCampaigns}
                className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Semua Kampanye</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Daftar Kampanye */}
            <div className="space-y-3.5">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => onOpenCampaigns?.()}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-xl transition-colors border cursor-pointer ${
                    isDarkMode
                      ? 'border-transparent hover:bg-white/[0.04]'
                      : 'border-transparent hover:bg-slate-50/80 hover:border-slate-100'
                  }`}
                  title="Klik untuk membuka detail kampanye pemasaran"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs truncate hover:text-indigo-400 transition">{camp.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{camp.channel}</div>
                  </div>

                  <div className="hidden sm:block w-36 flex-shrink-0">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>{camp.spent}</span>
                      <span>dari {camp.budget}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${camp.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 w-32 font-mono">
                    <div className="text-xs font-bold">{camp.roas}</div>
                    <div className="text-[10px] text-slate-400">{camp.revenue}</div>
                  </div>

                  <div className="flex-shrink-0 pl-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCampaign(camp.id);
                      }}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        camp.active ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      title={camp.active ? 'Klik untuk jeda' : 'Klik untuk aktifkan'}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                          camp.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Corong Konversi Transaksi */}
          <div
            className={`lg:col-span-5 rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] flex flex-col justify-between ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3
                    className={`font-extrabold text-base tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Corong Konversi Transaksi
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">30 hari terakhir, setiap kunjungan</p>
                </div>

                <button
                  onClick={() => setFunnelModalOpen(true)}
                  className="text-xs font-semibold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Detail Corong</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap my-3">
                {[
                  'Semua',
                  '● Media Sosial',
                  '● Penelusuran',
                  '● Email',
                  '● Organik',
                  '● Kreator',
                  '● Rujukan',
                ].map((chip) => {
                  const isActive =
                    funnelFilter === chip || (chip === 'Semua' && funnelFilter === 'Semua');
                  return (
                    <button
                      key={chip}
                      onClick={() => {
                        setFunnelFilter(chip);
                        showToast(`Filter corong: ${chip}`);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                        isActive
                          ? isDarkMode
                            ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                            : 'bg-slate-900 text-white shadow-xs'
                          : isDarkMode
                          ? 'bg-[#25293c] text-zinc-400 hover:text-zinc-200 hover:bg-[#2e334a]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* 5 Tahapan Corong */}
              <div className="space-y-3.5 pt-1 font-mono">
                {/* 1. Sesi Kunjungan */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold font-sans">Sesi Kunjungan</span>
                    <span className="font-bold">122k awal</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 dark:bg-white/10 rounded-lg overflow-hidden flex items-center p-1">
                    <div className="h-full bg-indigo-600 rounded-md w-full flex items-center justify-end pr-2 text-[10px] font-bold text-white">
                      100%
                    </div>
                  </div>
                </div>

                {/* 2. Melihat Produk */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold font-sans">Melihat Produk</span>
                    <span className="text-slate-400">72,6k (59,4%)</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 dark:bg-white/10 rounded-lg overflow-hidden flex items-center p-1">
                    <div
                      className="h-full bg-indigo-500 rounded-md flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                      style={{ width: '59.4%' }}
                    >
                      59,4%
                    </div>
                  </div>
                </div>

                {/* 3. Masuk Keranjang (Penurunan Terbesar) */}
                <div>
                  <div className="flex justify-between text-xs mb-1 items-center">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="font-semibold">Masuk Keranjang</span>
                      <span className="bg-rose-50 border border-rose-200 text-rose-600 font-bold text-[9.5px] px-1.5 py-0.2 rounded">
                        Penurunan Terbesar
                      </span>
                    </div>
                    <span className="text-slate-400">9.201 (12,7%)</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 dark:bg-white/10 rounded-lg overflow-hidden flex items-center p-1">
                    <div
                      className="h-full bg-indigo-400 rounded-md flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                      style={{ width: '12.7%' }}
                    >
                      12,7%
                    </div>
                  </div>
                </div>

                {/* 4. Masuk Pembayaran */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold font-sans">Masuk Pembayaran</span>
                    <span className="text-slate-400">4.892 (53,2%)</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 dark:bg-white/10 rounded-lg overflow-hidden flex items-center p-1">
                    <div
                      className="h-full bg-indigo-400/80 rounded-md flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                      style={{ width: '53.2%' }}
                    >
                      53,2%
                    </div>
                  </div>
                </div>

                {/* 5. Pesanan Berhasil */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold font-sans">Pesanan Berhasil</span>
                    <span className="text-emerald-500 font-bold">2.705 (55,3%)</span>
                  </div>
                  <div className="h-6 w-full bg-slate-100 dark:bg-white/10 rounded-lg overflow-hidden flex items-center p-1">
                    <div
                      className="h-full bg-emerald-500 rounded-md flex items-center justify-end pr-2 text-[10px] font-bold text-white"
                      style={{ width: '55.3%' }}
                    >
                      55,3%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Bawah Corong */}
            <div
              className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
                isDarkMode
                  ? 'bg-[#151722] border-white/[0.06] text-zinc-300'
                  : 'bg-slate-50 border-slate-200/70 text-slate-600'
              }`}
            >
              Penurunan konversi terpusat pada tahap keranjang belanja. Pertimbangkan untuk
              menyediakan metode pembayaran kilat (QRIS / e-Wallet / WhatsApp Checkout).
            </div>
          </div>
        </section>

        {/* 6. ROW 4: PANEL INFORMASI BAWAH */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* KOLOM 1: Prospek B2B Utama */}
          <div
            className={`rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className={`font-extrabold text-base tracking-tight flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {/* <Flame className="w-4 h-4 text-amber-500" /> */}
                  <span>Prospek B2B Utama</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Grosir &amp; korporat, berdasarkan skor</p>
              </div>

              <button
                onClick={onOpenLeads}
                className="text-xs font-semibold text-indigo-500 hover:underline cursor-pointer"
              >
                Alur Prospek
              </button>
            </div>

            <div className="space-y-3.5">
              {leadsData.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`flex items-center justify-between gap-3 p-2 rounded-xl transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-slate-50'
                  }`}
                  title="Klik untuk melihat detail prospek"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {lead.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{lead.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{lead.contact}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 font-mono">
                    <div className="text-right">
                      <div className="text-xs font-bold">{lead.value}</div>
                      <div className="text-[10px] text-slate-400">● {lead.stage}</div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold ${lead.scoreColor}`}
                    >
                      {lead.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOLOM 2: Anggaran Pemasaran Oktober */}
          <div
            className={`rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] flex flex-col justify-between ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3
                    className={`font-extrabold text-base tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Anggaran Pemasaran Oktober
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rp 28.495.000 dari Rp 41.300.000 terpakai
                  </p>
                </div>

                <button
                  onClick={() => setBudgetModalOpen(true)}
                  className="text-xs font-semibold text-indigo-500 hover:underline cursor-pointer"
                >
                  Rencana Anggaran
                </button>
              </div>

              {/* Speedometer Gauge SVG */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-48 h-28 flex items-center justify-center">
                  <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke={isDarkMode ? '#334155' : '#f1f5f9'}
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="251.3"
                      strokeDashoffset={251.3 * (1 - gaugePercent)}
                    />

                    <g transform="translate(100, 100)">
                      <line
                        x1="0"
                        y1="0"
                        x2="-65"
                        y2="0"
                        stroke={isDarkMode ? '#f8fafc' : '#0f172a'}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        transform={`rotate(${needleAngle + 180})`}
                      />
                      <circle cx="0" cy="0" r="6" fill={isDarkMode ? '#f8fafc' : '#0f172a'} />
                      <circle cx="0" cy="0" r="2.5" fill={isDarkMode ? '#0f172a' : '#ffffff'} />
                    </g>
                  </svg>

                  <div className="absolute bottom-0 text-center">
                    <div className="text-2xl font-black font-mono tracking-tight">Rp 28,5 Jt</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      69% dari anggaran bulan ini
                    </div>
                  </div>
                </div>

                <p
                  className={`text-xs text-center max-w-xs mt-3 leading-relaxed ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Pada kecepatan saat ini realisasi Oktober diproyeksikan{' '}
                  <strong className="font-bold font-mono">Rp 41.262.000</strong>. Indikator jarum
                  menunjukkan target pengeluaran ideal hari ini.
                </p>
              </div>
            </div>

            {/* Status Anggaran Kanal */}
            <div
              className={`pt-3 border-t flex items-center justify-between text-xs font-medium ${
                isDarkMode ? 'border-slate-700' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Media Sosial</span>
                <span className="text-emerald-500 font-semibold ml-1">Sesuai Target</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Penelusuran</span>
                <span className="text-rose-500 font-semibold ml-1">3% Melebihi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Kreator</span>
                <span className="text-purple-400 font-semibold ml-1">10% Di Bawah</span>
              </div>
            </div>
          </div>

          {/* KOLOM 3: Aktivitas Tim Pemasaran */}
          <div
            className={`rounded-2xl p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.025)] ${
              isDarkMode ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.22)]' : 'bg-white border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.025)]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className={`font-extrabold text-base tracking-tight flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Aktivitas Tim Pemasaran</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Pembaruan sistem hari ini</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  id: 1,
                  avatar: 'TK',
                  avatarColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  user: 'Tomás',
                  action: 'menambahkan prospek baru: Switchback Running Club',
                  time: 'baru saja',
                },
                {
                  id: 2,
                  avatar: 'DR',
                  avatarColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  user: 'Diego',
                  action: 'memindahkan Cascade Basecamp Supply ke tahap Proposal',
                  time: '17 mnt lalu',
                },
                {
                  id: 3,
                  avatar: 'MC',
                  avatarColor: 'bg-amber-50 text-amber-700 border-amber-200',
                  user: 'Marcus',
                  action: 'menaikkan batas harian Fall Layering Drop ke Rp 4.000.000',
                  time: '53 mnt lalu',
                },
                {
                  id: 4,
                  avatar: 'AT',
                  avatarColor: 'bg-blue-50 text-blue-700 border-blue-200',
                  user: 'Aiko',
                  action: 'mengunggah 4 video uji lapangan baru di Creator Field Tests',
                  time: '2 jam lalu',
                },
                {
                  id: 5,
                  avatar: 'IS',
                  avatarColor: 'bg-purple-50 text-purple-700 border-purple-200',
                  user: 'Ingrid',
                  action: 'menjadwalkan Winter Sleep System Preview untuk Minggu 25 Okt',
                  time: '16 jam lalu',
                },
                {
                  id: 6,
                  avatar: 'SA',
                  avatarColor: 'bg-rose-50 text-rose-700 border-rose-200',
                  user: 'Selin',
                  action: 'membuat segmen audiens "Pembeli tenda, belum beli kasur"',
                  time: '19 jam lalu',
                },
              ].map((act) => (
                <div
                  key={act.id}
                  onClick={() => showToast(`Aktivitas ${act.user}: ${act.action}`)}
                  className={`flex items-start gap-3 text-xs leading-snug p-1 rounded-xl transition cursor-pointer ${
                    isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${act.avatarColor}`}
                  >
                    {act.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p>
                      <strong className="font-bold">{act.user}</strong> {act.action}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* TOMBOL MENGAMBANG ASISTEN AI (AI COPILOT) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setAiDrawerOpen(true)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border transition-all cursor-pointer group ${
            isDarkMode
              ? 'bg-[#1e2130] hover:bg-[#25293c] text-zinc-100 border-white/10'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-white/10 text-zinc-200' : 'bg-white/20 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold tracking-tight">AI Copilot</span>
        </button>
      </div>

      {/* MODAL: RENCANAKAN KAMPANYE BARU */}
      {planCampaignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-lg w-full p-6 shadow-2xl border animate-in fade-in zoom-in-95 ${
              isDarkMode
                ? 'bg-[#1e2130] text-zinc-100 border-white/10'
                : 'bg-white text-slate-900 border-slate-100'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 border-b ${
                isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    isDarkMode ? 'bg-white/10 text-zinc-200' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Rencanakan Kampanye Baru</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                    Tambahkan kampanye ke pipeline pemasaran kuartal ini
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPlanCampaignModal(false)}
                className={`p-1.5 rounded-full transition ${
                  isDarkMode
                    ? 'hover:bg-white/[0.08] text-zinc-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 mt-4">
              <div>
                <label
                  className={`block text-xs font-bold mb-1 ${
                    isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                  }`}
                >
                  Nama Kampanye
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Promo Akhir Tahun 2026"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none transition ${
                    isDarkMode
                      ? 'bg-[#151722] border-white/10 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-bold mb-1 ${
                      isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                    }`}
                  >
                    Kanal Pemasaran
                  </label>
                  <select
                    value={newCampChannel}
                    onChange={(e) => setNewCampChannel(e.target.value)}
                    className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none transition ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-zinc-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Penelusuran Berbayar">Penelusuran Berbayar (Google Ads)</option>
                    <option value="Media Sosial Berbayar">Media Sosial (Meta / TikTok)</option>
                    <option value="Email Marketing">Pemasaran Email</option>
                    <option value="Endorsement Kreator">Endorsement Kreator</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold mb-1 ${
                      isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                    }`}
                  >
                    Target ROAS
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCampRoas}
                    onChange={(e) => setNewCampRoas(e.target.value)}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-mono transition ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-zinc-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-bold mb-1 ${
                    isDarkMode ? 'text-zinc-300' : 'text-slate-700'
                  }`}
                >
                  Alokasi Anggaran (Rupiah)
                </label>
                <input
                  type="number"
                  value={newCampBudget}
                  onChange={(e) => setNewCampBudget(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none font-mono transition ${
                    isDarkMode
                      ? 'bg-[#151722] border-white/10 text-zinc-100'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPlanCampaignModal(false)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                    isDarkMode
                      ? 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-medium shadow-xs ${primaryBtnClass}`}
                >
                  Luncurkan Kampanye
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL PROSPEK B2B */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border animate-in fade-in zoom-in-95 ${
              isDarkMode
                ? 'bg-[#1e2130] text-zinc-100 border-white/10'
                : 'bg-white text-slate-900 border-slate-100'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-4 border-b ${
                isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${
                    isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'
                  }`}
                >
                  {selectedLead.initials}
                </div>
                <div>
                  <h3 className="text-base font-extrabold">{selectedLead.name}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                    {selectedLead.contact}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className={`p-1.5 rounded-full transition ${
                  isDarkMode
                    ? 'hover:bg-white/[0.08] text-zinc-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-5 text-xs">
              <div
                className={`p-3.5 rounded-2xl flex items-center justify-between ${
                  isDarkMode ? 'bg-[#151722] border border-white/[0.06]' : 'bg-slate-50'
                }`}
              >
                <div>
                  <div
                    className={`text-[10px] uppercase font-bold font-mono ${
                      isDarkMode ? 'text-zinc-400' : 'text-slate-400'
                    }`}
                  >
                    POTENSI NILAI DEAL
                  </div>
                  <div className="text-lg font-black font-mono mt-0.5">{selectedLead.value}</div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedLead.scoreColor}`}
                >
                  Skor: {selectedLead.score}/100
                </div>
              </div>

              <div className={`space-y-2 ${isDarkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Tahap Pipeline: {selectedLead.stage}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  showToast(`Membuka email tindak lanjut untuk ${selectedLead.name}...`);
                  setSelectedLead(null);
                }}
                className={`flex-1 py-2.5 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition ${
                  isDarkMode
                    ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Kirim Tindak Lanjut</span>
              </button>
              <button
                onClick={() => {
                  setSelectedLead(null);
                  onOpenLeads?.();
                }}
                className={`px-4 py-2.5 font-medium text-xs rounded-xl cursor-pointer transition ${
                  isDarkMode
                    ? 'bg-white/[0.08] hover:bg-white/[0.12] text-zinc-200 border border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Buka di Alur Prospek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL CORONG KONVERSI */}
      {funnelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-lg w-full p-6 shadow-2xl border animate-in fade-in zoom-in-95 space-y-4 ${
              isDarkMode
                ? 'bg-[#1e2130] text-zinc-100 border-white/10'
                : 'bg-white text-slate-900 border-slate-100'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="text-base font-extrabold">Analisis Drop-off Corong Belanja</h3>
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                  Audit 122.000 kunjungan dalam 30 hari terakhir
                </p>
              </div>
              <button
                onClick={() => setFunnelModalOpen(false)}
                className={`p-1.5 rounded-full transition ${
                  isDarkMode
                    ? 'hover:bg-white/[0.08] text-zinc-400'
                    : 'hover:bg-slate-100 text-slate-400'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div
                className={`p-3.5 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Titik Penurunan Kritis: Keranjang Belanja</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed">
                  Dari 72.600 pengunjung yang melihat produk, hanya 9.201 (12,7%) yang
                  memasukkan ke keranjang. Kehilangan potensi omzet diperkirakan mencapai{' '}
                  <strong className="font-semibold">Rp 180 Juta</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold">Rekomendasi Tindakan AI:</div>
                <ul
                  className={`list-disc pl-5 space-y-1 text-[11px] ${
                    isDarkMode ? 'text-zinc-300' : 'text-slate-600'
                  }`}
                >
                  <li>Tambahkan tombol &quot;Beli Instan via QRIS / WhatsApp&quot; pada detail produk.</li>
                  <li>Tampilkan estimasi ongkos kirim otomatis sebelum masuk keranjang.</li>
                  <li>Kirimkan email pengingat otomatis 1 jam setelah pengunjung meninggalkan keranjang.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setFunnelModalOpen(false);
                  showToast('Rekomendasi optimasi corong berhasil dicatat ke daftar tugas!');
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isDarkMode
                    ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Terapkan Solusi ke Tugas Tim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RENCANA ANGGARAN PEMASARAN */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-lg w-full p-6 shadow-2xl border animate-in fade-in zoom-in-95 space-y-4 ${
              isDarkMode
                ? 'bg-[#1e2130] text-zinc-100 border-white/10'
                : 'bg-white text-slate-900 border-slate-100'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="text-base font-extrabold">Alokasi Anggaran Pemasaran Oktober</h3>
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                  Total Anggaran: Rp 41.300.000 / Bulan
                </p>
              </div>
              <button
                onClick={() => setBudgetModalOpen(false)}
                className={`p-1.5 rounded-full transition ${
                  isDarkMode
                    ? 'hover:bg-white/[0.08] text-zinc-400'
                    : 'hover:bg-slate-100 text-slate-400'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-sans font-semibold">Penelusuran Berbayar</span>
                  <span className="text-rose-500 font-bold">Rp 18.120.000 (3% melebihi target)</span>
                </div>
                <div
                  className={`h-2 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-[#151722]' : 'bg-slate-100'
                  }`}
                >
                  <div className="h-full bg-amber-500 rounded-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-sans font-semibold">Media Sosial Berbayar</span>
                  <span className="text-emerald-500 font-bold">Rp 16.000.000 (Sesuai target)</span>
                </div>
                <div
                  className={`h-2 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-[#151722]' : 'bg-slate-100'
                  }`}
                >
                  <div className="h-full bg-blue-600 rounded-full w-[69%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-sans font-semibold">Endorsement Kreator</span>
                  <span className="text-purple-400 font-bold">Rp 4.075.000 (10% di bawah target)</span>
                </div>
                <div
                  className={`h-2 w-full rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-[#151722]' : 'bg-slate-100'
                  }`}
                >
                  <div className="h-full bg-purple-500 rounded-full w-[45%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setBudgetModalOpen(false)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition ${
                  isDarkMode
                    ? 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setBudgetModalOpen(false);
                  showToast('Penyeimbangan anggaran otomatis berhasil diterapkan!');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  isDarkMode
                    ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Seimbangkan Otomatis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER: ASISTEN AI EKSEKUTIF */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-2xs flex justify-end">
          <div
            className={`w-full max-w-md h-full shadow-2xl border-l flex flex-col justify-between animate-in slide-in-from-right duration-200 ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/10 text-zinc-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header Drawer */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDarkMode
                  ? 'bg-[#151722] border-white/[0.06] text-zinc-100'
                  : 'bg-slate-900 text-white border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-white/10 text-white' : 'bg-white/20 text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Asisten AI Eksekutif DailyDose</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    ● Terhubung Langsung ke PostgreSQL &amp; Telemetri
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className={`p-1 rounded-lg transition ${
                  isDarkMode
                    ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Riwayat Percakapan */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {aiChatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? isDarkMode
                          ? 'bg-zinc-100 text-zinc-900 rounded-br-none shadow-xs font-medium'
                          : 'bg-slate-900 text-white rounded-br-none shadow-xs font-medium'
                        : isDarkMode
                        ? 'bg-[#151722] text-zinc-200 rounded-bl-none border border-white/[0.08]'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span
                    className={`text-[9.5px] font-mono mt-1 px-1 ${
                      isDarkMode ? 'text-zinc-500' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              ))}

              {aiThinking && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-2xl text-xs animate-pulse ${
                    isDarkMode
                      ? 'bg-[#151722] text-zinc-400 border border-white/[0.06]'
                      : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Asisten AI sedang menganalisis data eksekutif...</span>
                </div>
              )}
            </div>

            {/* Pertanyaan Cepat Siap Klik */}
            <div
              className={`p-3 border-t space-y-1.5 ${
                isDarkMode ? 'bg-[#151722] border-white/[0.06]' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div
                className={`text-[10px] uppercase font-bold font-mono ${
                  isDarkMode ? 'text-zinc-500' : 'text-slate-400'
                }`}
              >
                PERTANYAAN CEPAT:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Kenapa Paid Search melebihi anggaran 3%?',
                  'Solusi penurunan 12,7% di keranjang belanja?',
                  'Tindak lanjut Northfork (Rp 41,2 Jt)',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setAiPrompt(q);
                    }}
                    className={`text-[10.5px] px-2.5 py-1 rounded-full transition text-left cursor-pointer border ${
                      isDarkMode
                        ? 'bg-[#1e2130] border-white/10 text-zinc-300 hover:bg-white/10'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Kolom Input Chat */}
            <div
              className={`p-3 border-t flex items-center gap-2 ${
                isDarkMode ? 'bg-[#1e2130] border-white/[0.06]' : 'bg-white border-slate-100'
              }`}
            >
              <input
                type="text"
                placeholder="Tanyakan analisis bisnis atau strategi pemasaran..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border outline-none transition ${
                  isDarkMode
                    ? 'bg-[#151722] border-white/10 text-zinc-100 placeholder:text-zinc-500'
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!aiPrompt.trim() || aiThinking}
                className={`p-2.5 rounded-xl transition cursor-pointer disabled:opacity-40 ${
                  isDarkMode
                    ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
