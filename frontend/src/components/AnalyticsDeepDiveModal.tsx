'use client';

import React from 'react';
import {
  X,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface AnalyticsDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalRevenue: number;
}

export const AnalyticsDeepDiveModal: React.FC<AnalyticsDeepDiveModalProps> = ({
  isOpen,
  onClose,
  totalRevenue,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Analisis Mendalam Kinerja &amp; Proyeksi Finansial
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Q4 FY-2026
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Laporan komprehensif pertumbuhan omset, margin operasional, dan proyeksi kuartal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top 3 High Level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Omset Kuartal Ini
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                {totalRevenue > 0 ? formatCurrency(totalRevenue) : 'Rp 4.750.000'}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24.2% YoY
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Gross Profit Margin
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                78.4%
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-1">
                Efisiensi Sangat Baik
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Proyeksi Akhir Tahun
              </p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">
                Rp 18.500.000
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 mt-1">
                Target Terpenuhi
              </span>
            </div>
          </div>

          {/* Breakdown by Stream */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Kontribusi Pendapatan per Lini Bisnis
            </h4>
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Industrial 5G Gateway Router (Hardware Enterprise)</span>
                  <span className="text-slate-900">Rp 4.750.000 (100%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">Cloud Server Enterprise (Langganan SaaS)</span>
                  <span className="text-slate-500">Pipeline Draft (Rp 3.500.000)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-800">API AI Business Assistant (Token AI Kuota)</span>
                  <span className="text-slate-500">Pipeline Draft (Rp 1.850.000)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-300 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
            <div className="font-bold text-indigo-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Rekomendasi Strategis AI Executive</span>
            </div>
            <p className="text-indigo-900/80 leading-relaxed">
              Arus kas perusahaan berada dalam kondisi sangat prima dengan rasio piutang tertagih 100%. Untuk memaksimalkan pertumbuhan di kuartal berikutnya, disarankan mempercepat konversi tagihan draft pada produk Cloud Server dan API AI guna meningkatkan recurring revenue bulanan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => alert('Laporan performa finansial telah siap diekspor.')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan (PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
