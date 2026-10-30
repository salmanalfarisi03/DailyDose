'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Invoice } from '@/types/api';

interface ReportsViewProps {
  invoices: Invoice[];
  isDarkMode?: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ invoices, isDarkMode = false }) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownload = (reportName: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,Laporan,Tanggal,Status,Nilai\n' +
      `${reportName},2026-10-22,Final,Rp 346.383.000\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Laporan ${reportName} berhasil diunduh!`);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border shadow-xs transition-colors ${
          isDarkMode
            ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}
      >
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-500" />
            <span>Laporan Keuangan &amp; Audit Kampanye</span>
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Rekapitulasi performa finansial, audit tagihan piutang, dan efisiensi kanal pemasaran.
          </p>
        </div>

        <button
          onClick={() => handleDownload('DailyDose_Comprehensive_Q4_Audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition ${
            isDarkMode
              ? 'bg-zinc-100 hover:bg-white text-zinc-900'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Unduh Semua Laporan (ZIP)</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Laporan Pendapatan Eksekutif Q4',
            period: '1 Okt - 22 Okt 2026',
            status: 'Terverifikasi',
            val: 'Rp 346.383.000',
            desc: 'Rekonsiliasi transaksi pembayaran lunas, ROAS 4.61x, dan tren kenaikan +11.9%.',
          },
          {
            title: 'Audit Piutang & Invoice B2B',
            period: 'Oktober 2026',
            status: '100% Tertagih',
            val: 'Rp 41.200.000',
            desc: 'Daftar penagihan grosir terbit, status piutang lancar tanpa kredit macet.',
          },
          {
            title: 'Evaluasi Pacing Anggaran Iklan',
            period: '30 Hari Terakhir',
            status: 'Over 3% (Search)',
            val: 'Rp 28.495.000',
            desc: 'Realisasi biaya iklan Google Ads, Meta Ads, dan endorsement kreator lapangan.',
          },
        ].map((rep, i) => (
          <div
            key={i}
            className={`rounded-2xl p-6 border shadow-xs transition flex flex-col justify-between space-y-4 ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 hover:border-white/20'
                : 'bg-white border-slate-200/80 text-slate-900 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {rep.period}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDarkMode
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {rep.status}
                </span>
              </div>
              <h3 className="font-extrabold text-base">{rep.title}</h3>
              <div className="text-xl font-black font-mono mt-2">{rep.val}</div>
              <p className={`text-xs mt-2 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                {rep.desc}
              </p>
            </div>

            <button
              onClick={() => handleDownload(rep.title)}
              className={`w-full py-2 border text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                isDarkMode
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-zinc-200'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Ekspor Format CSV</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
