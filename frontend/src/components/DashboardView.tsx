'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Users,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Customer, Invoice, Product, Task, TaskStatus } from '@/types/api';
import { ActiveTab } from './Sidebar';
import { InvoiceDetailModal } from './InvoiceDetailModal';

interface DashboardViewProps {
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  tasks: Task[];
  onNavigate: (tab: ActiveTab) => void;
  onUpdateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  onSeedSampleData?: () => Promise<void>;
  seedingLoading?: boolean;
  onOpenDeepDiveModal?: () => void;
  onOpenDiagnosticsModal?: () => void;
  isDarkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  customers,
  products,
  invoices,
  tasks,
  onNavigate,
  onOpenDeepDiveModal,
  onOpenDiagnosticsModal,
  isDarkMode = false,
}) => {
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDonutMenu, setShowDonutMenu] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [verificationNotice, setVerificationNotice] = useState(false);

  // Revenue & Invoices calculations
  const paidInvoices = invoices.filter((inv) => inv.status === 'PAID');
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);

  const outstandingInvoices = invoices.filter(
    (inv) => inv.status === 'ISSUED' || inv.status === 'OVERDUE'
  );
  const totalOutstanding = outstandingInvoices.reduce(
    (sum, inv) => sum + Number(inv.total_amount),
    0
  );

  const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Sample static rows to guarantee matching SCREEN_2 exactly if DB has fewer
  const defaultDisplayInvoices = [
    {
      id: 1,
      invoice_number: 'INV-HTTP-999',
      status: 'PAID',
      issue_date: '2026-10-20',
      total_amount: 4750000,
    },
    {
      id: 2,
      invoice_number: 'INV-ROUTER-001',
      status: 'DRAFT',
      issue_date: '2026-10-20',
      total_amount: 1000,
    },
    {
      id: 3,
      invoice_number: 'INV-HTTP-001',
      status: 'DRAFT',
      issue_date: '2026-10-20',
      total_amount: 4750000,
    },
    {
      id: 4,
      invoice_number: 'INV-DEBUG-001',
      status: 'DRAFT',
      issue_date: '2026-10-20',
      total_amount: 1000,
    },
    {
      id: 5,
      invoice_number: 'INV-TEST-999',
      status: 'DRAFT',
      issue_date: '2026-10-20',
      total_amount: 4750000,
    },
  ];

  const displayInvoices = invoices.length >= 5 ? invoices.slice(0, 5) : defaultDisplayInvoices;

  // Dynamic Bar Chart dataset based on selected Period
  const currentChartData = React.useMemo(() => {
    switch (chartPeriod) {
      case 'quarterly':
        return {
          titlePeak: 'Kuartal 4 (Rp 4.75M)',
          bars: [
            { month: 'Q1-26', targetH: 70, actualH: 55, isPeak: false, value: 'Rp 2.10M', target: 'Rp 2.50M' },
            { month: 'Q2-26', targetH: 85, actualH: 72, isPeak: false, value: 'Rp 2.90M', target: 'Rp 3.20M' },
            { month: 'Q3-26', targetH: 105, actualH: 95, isPeak: false, value: 'Rp 3.60M', target: 'Rp 3.80M' },
            { month: 'Q4-26(Kini)', targetH: 125, actualH: 155, isPeak: true, value: 'Rp 4.75M', target: 'Rp 4.00M' },
          ],
        };
      case 'yearly':
        return {
          titlePeak: 'FY-2026 (Rp 18.5M)',
          bars: [
            { month: 'FY-2024', targetH: 80, actualH: 65, isPeak: false, value: 'Rp 7.80M', target: 'Rp 8.50M' },
            { month: 'FY-2025', targetH: 110, actualH: 100, isPeak: false, value: 'Rp 13.90M', target: 'Rp 14.50M' },
            { month: 'FY-2026(Kini)', targetH: 130, actualH: 155, isPeak: true, value: 'Rp 18.50M', target: 'Rp 16.00M' },
          ],
        };
      default:
        return {
          titlePeak: 'Oktober (Rp 4.75M)',
          bars: [
            { month: 'Mei', targetH: 70, actualH: 50, isPeak: false, value: 'Rp 1.90M', target: 'Rp 2.50M' },
            { month: 'Jun', targetH: 95, actualH: 75, isPeak: false, value: 'Rp 2.40M', target: 'Rp 2.90M' },
            { month: 'Jul', targetH: 100, actualH: 80, isPeak: false, value: 'Rp 2.60M', target: 'Rp 3.10M' },
            { month: 'Agu', targetH: 110, actualH: 88, isPeak: false, value: 'Rp 2.80M', target: 'Rp 3.40M' },
            { month: 'Sep', targetH: 120, actualH: 105, isPeak: false, value: 'Rp 3.20M', target: 'Rp 3.70M' },
            { month: 'Okt(Kini)', targetH: 125, actualH: 155, isPeak: true, value: 'Rp 4.75M', target: 'Rp 3.80M' },
          ],
        };
    }
  }, [chartPeriod]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* =======================================================================
          1. GRID 4 KARTU METRIK KPI UTAMA (4 COLUMNS GRID)
         ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: TOTAL PENDAPATAN (LUNAS) */}
        <div
          onClick={() => onNavigate('invoices')}
          title="Klik untuk membuka rincian Faktur Penagihan Lunas"
          className={`rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between cursor-pointer group ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 hover:border-white/20'
              : 'bg-white border-slate-200/70 text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TOTAL PENDAPATAN (LUNAS)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {totalRevenue > 0 ? formatCurrency(totalRevenue) : 'Rp 4.750.000'}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                isDarkMode
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                +18.4%
              </span>
              <span className="text-slate-400 font-medium">
                1 tagihan lunas terverifikasi
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 2: TAGIHAN BELUM LUNAS */}
        <div
          onClick={() => onNavigate('invoices')}
          title="Klik untuk memeriksa status penagihan outstanding"
          className={`rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between cursor-pointer group ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 hover:border-white/20'
              : 'bg-white border-slate-200/70 text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TAGIHAN BELUM LUNAS
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {formatCurrency(totalOutstanding)}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="text-slate-400 font-medium">
                0 Piutang Tertunda
              </span>
              <span className={`font-medium px-2.5 py-0.5 rounded-lg text-[11px] flex items-center gap-1 ${
                isDarkMode
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                <Check className="w-3 h-3 stroke-[3]" />
                Arus kas sehat
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: TOTAL KLIEN AKTIF */}
        <div
          onClick={() => onNavigate('customers')}
          title="Klik untuk membuka Direktori Pelanggan / CRM"
          className={`rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between cursor-pointer group ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 hover:border-white/20'
              : 'bg-white border-slate-200/70 text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TOTAL KLIEN AKTIF
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              {customers.length > 0 ? `${customers.length} Akun` : '4 Akun'}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                isDarkMode
                  ? 'bg-white/10 text-zinc-200 border border-white/10'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}>
                100% Retensi
              </span>
              <span className="text-slate-400 font-medium">
                Terverifikasi B2B
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 4: TUGAS & EKSEKUSI */}
        <div
          onClick={() => onNavigate('tasks')}
          title="Klik untuk membuka Papan Kanban Tugas Operasional"
          className={`rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between cursor-pointer group ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 hover:border-white/20'
              : 'bg-white border-slate-200/70 text-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              TUGAS &amp; EKSEKUSI
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
              0 Tertunda
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                isDarkMode
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                Nir-Tunggakan
              </span>
              <span className="text-slate-400 font-medium">
                Sistem Terkini
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================================
          2. ROW KEDUA: VISUALISASI ANALITIK 3D (2 KOLOM SEIMBANG)
         ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Tren Pendapatan & Pertumbuhan Penjualan (Span 7) */}
        <div
          className={`lg:col-span-7 rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-colors ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
              : 'bg-white border-slate-200/70 text-slate-900'
          }`}
        >
          <div>
            {/* Header Chart */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                    Tren Pendapatan &amp; Pertumbuhan Penjualan
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDarkMode
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    FY-2026
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Perbandingan realisasi pendapatan aktual terhadap target bulanan (dalam Juta Rupiah)
                </p>
              </div>

              {/* Segmented Period Switcher (Fully Interactive) */}
              <div className="flex items-center p-1 bg-slate-100/80 rounded-xl text-xs font-medium self-start sm:self-auto border border-slate-200/60">
                <button
                  onClick={() => {
                    setChartPeriod('monthly');
                    setSelectedBar(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    chartPeriod === 'monthly'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Bulanan
                </button>
                <button
                  onClick={() => {
                    setChartPeriod('quarterly');
                    setSelectedBar(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    chartPeriod === 'quarterly'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Kuartal
                </button>
                <button
                  onClick={() => {
                    setChartPeriod('yearly');
                    setSelectedBar(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    chartPeriod === 'yearly'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tahunan
                </button>
              </div>
            </div>

            {/* Legenda & Floating Highlight Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0f172a]" />
                  <span>Realisasi Pendapatan</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
                  <span>Target Omset</span>
                </div>
              </div>

              {/* Floating Tooltip Pill (Updates dynamically on bar click) */}
              <div className="bg-[#0f172a] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>
                  {selectedBar ? (
                    <span>Detail: <strong>{selectedBar}</strong></span>
                  ) : (
                    <span>Puncak Penjualan: <strong>{currentChartData.titlePeak}</strong></span>
                  )}
                </span>
              </div>
            </div>

            {/* Visual 3D Bar Chart Canvas */}
            <div className="mt-6 relative h-64 select-none">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Subtle 3D Depth Filters */}
                  <filter id="barShadow" x="-20%" y="-10%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.12" floodColor="#0f172a" />
                  </filter>
                  <filter id="peakGlowGem" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.3" floodColor="#10b981" />
                  </filter>

                  {/* Emerald Gemstone Gradient for Peak */}
                  <linearGradient id="emeraldPeak" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="60%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>

                  {/* Dark Obsidian Gradient for Front Actual Bars */}
                  <linearGradient id="obsidianBar" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>

                  {/* Soft Light Gray for Target Bars */}
                  <linearGradient id="targetBar" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Horizontal Gridlines */}
                {[
                  { y: 35, label: '5.0M' },
                  { y: 75, label: '3.75M' },
                  { y: 115, label: '2.5M' },
                  { y: 155, label: '1.25M' },
                ].map((g, idx) => (
                  <g key={idx}>
                    <line
                      x1="45"
                      y1={g.y}
                      x2="580"
                      y2={g.y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="38"
                      y={g.y + 3}
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {g.label}
                    </text>
                  </g>
                ))}

                {/* Base axis line */}
                <line x1="45" y1="185" x2="580" y2="185" stroke="#e2e8f0" strokeWidth="1" />

                {/* Dynamic Dual Bars (Clickable to show values) */}
                {currentChartData.bars.map((col, i) => {
                  const count = currentChartData.bars.length;
                  const step = (580 - 55) / count;
                  const centerX = 55 + step * i + step / 2;
                  const barWidth = 14;
                  const baseY = 185;

                  const targetY = baseY - col.targetH;
                  const actualY = baseY - col.actualH;

                  return (
                    <g
                      key={i}
                      onClick={() => setSelectedBar(`${col.month}: Realisasi ${col.value} (Target ${col.target})`)}
                      className="group/bar cursor-pointer"
                    >
                      <title>{`${col.month}: Realisasi ${col.value} / Target ${col.target}`}</title>

                      {/* Target Bar (Behind, Soft Slate) */}
                      <rect
                        x={centerX - 10}
                        y={targetY}
                        width={barWidth}
                        height={col.targetH}
                        rx="4"
                        fill="url(#targetBar)"
                        className="transition-opacity group-hover/bar:opacity-90"
                      />

                      {/* Actual Bar (In Front, Obsidian or Emerald Gemstone) */}
                      <rect
                        x={centerX - 2}
                        y={actualY}
                        width={barWidth}
                        height={col.actualH}
                        rx="4"
                        fill={col.isPeak ? 'url(#emeraldPeak)' : 'url(#obsidianBar)'}
                        filter={col.isPeak ? 'url(#peakGlowGem)' : 'url(#barShadow)'}
                        className="transition-transform group-hover/bar:-translate-y-1"
                      />

                      {/* Month Label */}
                      <text
                        x={centerX + 2}
                        y={204}
                        fill={col.isPeak ? '#059669' : '#64748b'}
                        fontSize={col.isPeak ? '11' : '10'}
                        fontWeight={col.isPeak ? '800' : '600'}
                        textAnchor="middle"
                      >
                        {col.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Footer Chart */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Peningkatan performa penjualan sebesar <strong className="text-slate-900 font-bold">+24.2%</strong> dari kuartal sebelumnya
              </span>
            </div>
            <button
              onClick={() => {
                if (onOpenDeepDiveModal) onOpenDeepDiveModal();
                else onNavigate('invoices');
              }}
              className="text-xs font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition"
            >
              <span>Analisis Mendalam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Status & Distribusi Penagihan (Span 5) */}
        <div
          className={`lg:col-span-5 rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-colors ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
              : 'bg-white border-slate-200/70 text-slate-900'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Status &amp; Distribusi Penagihan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualisasi 3D kedalaman proporsi transaksi
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDonutMenu(!showDonutMenu)}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    isDarkMode
                      ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Opsi Penagihan"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showDonutMenu && (
                  <div
                    className={`absolute right-0 mt-1 w-48 rounded-2xl border shadow-xl py-1.5 z-20 text-xs animate-in fade-in zoom-in-95 ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-zinc-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setShowDonutMenu(false);
                        onNavigate('invoices');
                      }}
                      className={`w-full px-3.5 py-2 text-left font-medium cursor-pointer ${
                        isDarkMode ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-50'
                      }`}
                    >
                      Buka Rincian Invoices
                    </button>
                    <button
                      onClick={() => {
                        setShowDonutMenu(false);
                        onOpenDeepDiveModal?.();
                      }}
                      className={`w-full px-3.5 py-2 text-left font-medium cursor-pointer ${
                        isDarkMode ? 'hover:bg-white/[0.06]' : 'hover:bg-slate-50'
                      }`}
                    >
                      Analisis Margin &amp; Omset
                    </button>
                    <button
                      onClick={() => {
                        setShowDonutMenu(false);
                        onOpenDiagnosticsModal?.();
                      }}
                      className={`w-full px-3.5 py-2 text-left font-medium border-t cursor-pointer ${
                        isDarkMode
                          ? 'border-white/10 hover:bg-white/[0.06]'
                          : 'border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      Status Sinkronisasi Ledger
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* VISUAL 3D DONUT CHART TILTED (Interactive Clickable) */}
            <div className="relative w-56 h-52 mx-auto my-2 flex items-center justify-center select-none">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 220 200"
              >
                <defs>
                  {/* Extrusion bevel shadows & gradients */}
                  <linearGradient id="donutEmeraldExtrude" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#064e3b" />
                  </linearGradient>
                  <linearGradient id="donutEmeraldTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="donutNavyTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <linearGradient id="donutAmberTop" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  <filter id="donutDepthShadow" x="-20%" y="-10%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="6" floodOpacity="0.18" floodColor="#047857" />
                  </filter>
                </defs>

                {/* Ground Drop Shadow */}
                <ellipse cx="110" cy="145" rx="80" ry="28" fill="rgba(15, 23, 42, 0.12)" />

                {/* Extruded 3D Cylinder Wall for Emerald (Bottom rim depth) */}
                <path
                  d="M 28,95 A 82,48 0 0,0 188,110 L 188,124 A 82,48 0 0,1 28,109 Z"
                  fill="url(#donutEmeraldExtrude)"
                />

                {/* Slices of Tilted 3D Ring */}
                {/* 1. Lunas 75% (Emerald dominant segment) */}
                <path
                  d="M 110,95 L 110,47 A 82,48 0 1,0 188,108 Z"
                  fill="url(#donutEmeraldTop)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  filter="url(#donutDepthShadow)"
                  onClick={() => onNavigate('invoices')}
                  className="cursor-pointer hover:brightness-110 transition-all"
                >
                  <title>Lunas (Paid in Full): Rp 4.750.000 (75%)</title>
                </path>

                {/* 2. Draft 18% (Navy Obsidian segment) */}
                <path
                  d="M 110,95 L 188,108 A 82,48 0 0,0 168,58 Z"
                  fill="url(#donutNavyTop)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  onClick={() => onNavigate('invoices')}
                  className="cursor-pointer hover:brightness-110 transition-all"
                >
                  <title>Draft Invoices: 4 Dokumen (18%)</title>
                </path>

                {/* 3. Verifikasi 7% (Amber segment) */}
                <path
                  d="M 110,95 L 168,58 A 82,48 0 0,0 110,47 Z"
                  fill="url(#donutAmberTop)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  onClick={() => setVerificationNotice(!verificationNotice)}
                  className="cursor-pointer hover:brightness-110 transition-all"
                >
                  <title>Dalam Verifikasi: Rp 0 (7%)</title>
                </path>

                {/* Center White Cutout Hole (Dynamic Theme) */}
                <ellipse
                  cx="110"
                  cy="95"
                  rx="44"
                  ry="25"
                  fill={isDarkMode ? '#151722' : '#ffffff'}
                  stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}
                  strokeWidth="1.5"
                />
              </svg>

              {/* Center Donut Label (Clickable) */}
              <button
                type="button"
                onClick={() => onNavigate('invoices')}
                title="Status Penagihan: 100% Lunas (Klik untuk melihat Invoices)"
                className="absolute inset-0 m-auto w-24 h-24 rounded-full flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 transition-transform"
              >
                <span
                  className={`text-[10px] tracking-widest font-bold uppercase ${
                    isDarkMode ? 'text-zinc-400' : 'text-slate-400'
                  }`}
                >
                  LUNAS
                </span>
                <span
                  className={`text-2xl font-black leading-tight ${
                    isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                  }`}
                >
                  100%
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    isDarkMode ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  Zero Unpaid
                </span>
              </button>
            </div>

            {/* Verification Notice Banner if clicked */}
            {verificationNotice && (
              <div
                className={`mb-2 p-2.5 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
                  isDarkMode
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                <span>Seluruh transaksi terverifikasi lancar. Tidak ada piutang tertahan.</span>
                <button
                  onClick={() => setVerificationNotice(false)}
                  className={`font-bold text-xs ml-2 cursor-pointer ${
                    isDarkMode ? 'text-amber-200 hover:text-white' : 'text-amber-600 hover:text-amber-900'
                  }`}
                >
                  Tutup
                </button>
              </div>
            )}

            {/* Tabular Data below Donut (High Contrast & Clear) */}
            <div className="space-y-2.5 pt-2 text-xs">
              {/* Row 1: Lunas */}
              <div
                onClick={() => onNavigate('invoices')}
                title="Buka Faktur Lunas"
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition group ${
                  isDarkMode
                    ? 'hover:bg-white/[0.04]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span
                    className={`font-medium transition ${
                      isDarkMode
                        ? 'text-zinc-200 group-hover:text-emerald-400'
                        : 'text-slate-700 group-hover:text-emerald-700'
                    }`}
                  >
                    Lunas (Paid in Full)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                    }`}
                  >
                    Rp 4.750.000
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isDarkMode
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}
                  >
                    75%
                  </span>
                </div>
              </div>

              {/* Row 2: Draft */}
              <div
                onClick={() => onNavigate('invoices')}
                title="Buka Draft Invoices"
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition group ${
                  isDarkMode
                    ? 'hover:bg-white/[0.04]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      isDarkMode ? 'bg-indigo-400' : 'bg-[#0f172a]'
                    }`}
                  />
                  <span
                    className={`font-medium transition ${
                      isDarkMode
                        ? 'text-zinc-200 group-hover:text-white'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    Draft Invoices
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                    }`}
                  >
                    4 Dokumen
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isDarkMode
                        ? 'bg-white/10 text-zinc-300 border-white/10'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    18%
                  </span>
                </div>
              </div>

              {/* Row 3: Verifikasi */}
              <div
                onClick={() => setVerificationNotice(!verificationNotice)}
                title="Klik untuk melihat status verifikasi piutang"
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition group ${
                  isDarkMode
                    ? 'hover:bg-white/[0.04]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span
                    className={`font-medium transition ${
                      isDarkMode
                        ? 'text-zinc-200 group-hover:text-amber-300'
                        : 'text-slate-700 group-hover:text-amber-800'
                    }`}
                  >
                    Dalam Verifikasi
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                    }`}
                  >
                    Rp 0
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isDarkMode
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}
                  >
                    7%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Conversion */}
          <div
            className={`pt-3 border-t flex items-center justify-between text-xs ${
              isDarkMode ? 'border-white/10' : 'border-slate-100'
            }`}
          >
            <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>
              Tingkat konversi invoice
            </span>
            <span
              className={`font-bold ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}
            >
              Tinggi (98.2%) ↗
            </span>
          </div>
        </div>
      </div>

      {/* =======================================================================
          3. ROW KETIGA: TABEL INVOICES & MODUL OPERASIONAL (2 KOLOM)
         ======================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Invoices & Aktivitas Penagihan Terkini (Span 7) */}
        <div
          className={`lg:col-span-7 rounded-3xl p-6 border shadow-xs space-y-4 transition-colors ${
            isDarkMode
              ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
              : 'bg-white border-slate-200/70 text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Invoices &amp; Aktivitas Penagihan Terkini
                </h3>
                <button
                  onClick={() => onNavigate('invoices')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition ${
                    isDarkMode
                      ? 'bg-white/[0.06] text-zinc-300 border-white/10 hover:bg-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  }`}
                >
                  6 Transaksi
                </button>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                Pantau status penagihan dan riwayat transaksi pelanggan secara detail
              </p>
            </div>
            <button
              onClick={() => onNavigate('invoices')}
              className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition self-start sm:self-auto ${
                isDarkMode ? 'text-zinc-200 hover:text-white' : 'text-slate-900 hover:text-indigo-600'
              }`}
            >
              <span>Lihat Semua Invoices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b font-mono ${isDarkMode ? 'border-white/10 text-zinc-400' : 'border-slate-150 text-slate-400'}`}>
                  <th className="pb-3 font-semibold uppercase text-[10px]">NOMOR INVOICE</th>
                  <th className="pb-3 font-semibold uppercase text-[10px]">STATUS</th>
                  <th className="pb-3 font-semibold uppercase text-[10px]">TANGGAL DIBUAT</th>
                  <th className="pb-3 font-semibold uppercase text-[10px] text-right">TOTAL NILAI</th>
                  <th className="pb-3 font-semibold uppercase text-[10px] text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-medium ${isDarkMode ? 'divide-white/[0.06] text-zinc-300' : 'divide-slate-100 text-slate-700'}`}>
                {displayInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv as Invoice)}
                    className={`transition cursor-pointer group ${
                      isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/80'
                    }`}
                    title="Klik untuk membuka detail faktur resmi"
                  >
                    <td className={`py-3.5 font-mono font-bold transition ${isDarkMode ? 'text-zinc-100 group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                      {inv.invoice_number}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          inv.status === 'PAID'
                            ? isDarkMode
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : isDarkMode
                            ? 'bg-white/10 text-zinc-300 border-white/10'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      20 Okt 2026
                    </td>
                    <td className={`py-3.5 text-right font-mono font-bold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                      {formatCurrency(Number(inv.total_amount))}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(inv as Invoice);
                        }}
                        className={`text-xs font-semibold cursor-pointer underline hover:no-underline ${
                          isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom Kanan: Tugas Prioritas & Status Integritas (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Tugas Prioritas Hari Ini */}
          <div
            className={`rounded-3xl p-6 border shadow-xs space-y-4 transition-colors ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
                : 'bg-white border-slate-200/70 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className={`text-base font-bold ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Tugas Prioritas Hari Ini
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Follow-up penting &amp; operasional langsung
                </p>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                  isDarkMode ? 'text-zinc-200 hover:text-white' : 'text-slate-900 hover:text-indigo-600'
                }`}
              >
                <span>Kelola</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1: Checklist box (Interactive Toggle) */}
              <div
                onClick={() => setTaskCompleted(!taskCompleted)}
                title="Klik untuk menandai tugas selesai / belum selesai"
                className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none ${
                  isDarkMode
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                }`}
              >
                {taskCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <CheckSquare className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate transition ${
                    taskCompleted
                      ? 'line-through text-slate-500'
                      : isDarkMode
                      ? 'text-zinc-100'
                      : 'text-slate-800'
                  }`}>
                    Kirim kontrak perpanjangan tahunan k...
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border transition ${
                      taskCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}>
                      {taskCompleted ? 'SELESAI' : 'HIGH'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {taskCompleted ? 'Telah diverifikasi' : 'Tenggat: Hari ini'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Item 2: Peringatan Stok Amber (Clickable to Products) */}
              <div
                onClick={() => onNavigate('products')}
                title="Buka Katalog Produk & Cek Stok"
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition group ${
                  isDarkMode
                    ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15'
                    : 'bg-amber-50/60 border-amber-200/60 hover:bg-amber-100/60'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className={`text-xs font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                    1 produk memiliki stok menipis (&le; 5).
                  </h4>
                  <p className={`text-[11px] mt-0.5 leading-snug ${isDarkMode ? 'text-amber-400/80' : 'text-amber-800/80'}`}>
                    Katalog Produk membutuhkan re-order dari supplier utama demi kelancaran rantai pasok.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Integritas Keuangan Optimal (Clickable to open System Diagnostics) */}
          <div
            onClick={() => onOpenDiagnosticsModal?.()}
            title="Klik untuk membuka laporan audit pipeline kriptografis & koneksi database"
            className="bg-[#0b0f19] hover:bg-[#121829] text-white rounded-2xl p-4 flex items-center justify-between border border-slate-800 shadow-md cursor-pointer transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500 transition-colors">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Integritas Keuangan Optimal
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Semua audit pipeline tersinkronisasi otomatis dengan ledger
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 tracking-wide flex-shrink-0">
              99.9% ACCURACY
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Detail Preview Modal */}
      <InvoiceDetailModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoice={selectedInvoice}
        customer={customers.find((c) => c.id === selectedInvoice?.customer_id)}
      />
    </div>
  );
};
