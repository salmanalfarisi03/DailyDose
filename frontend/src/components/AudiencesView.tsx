'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  Users,
  Target,
  RefreshCw,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const AudiencesView: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const audiences = [
    {
      id: 1,
      name: 'Pembeli Tenda (Cross-sell)',
      description: 'Pembeli produk tenda yang belum membeli kantung tidur atau kasur angin',
      size: '14.200 kontak',
      matchRate: '88% kecocokan',
      channel: 'Meta & Google Ads',
      synced: 'Hari ini, 04:30',
    },
    {
      id: 2,
      name: 'Mitra Toko Grosir Premium',
      description: 'Pemilik gerai outdoor independen dengan omzet tahunan > Rp 100 Jt',
      size: '480 akun B2B',
      matchRate: '96% kecocokan',
      channel: 'LinkedIn & Email Marketing',
      synced: 'Kemarin, 18:20',
    },
    {
      id: 3,
      name: 'Keranjang Tertinggal 30 Hari',
      description: 'Pengunjung yang memasukkan produk ke keranjang tapi tidak checkout',
      size: '9.201 pengunjung',
      matchRate: '92% kecocokan',
      channel: 'Klaviyo & Meta Retargeting',
      synced: '1 jam lalu',
    },
    {
      id: 4,
      name: 'Peminat Lari Lintas Alam',
      description: 'Audiens yang aktif berinteraksi dengan konten lari lintas alam & sepatu',
      size: '28.500 prospek',
      matchRate: '84% kecocokan',
      channel: 'TikTok & Instagram',
      synced: '2 jam lalu',
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>Segmen Audiens &amp; Penargetan Iklan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Segmentasi pelanggan dan sinkronisasi otomatis ke Google Ads, Meta Ads, dan Klaviyo.
          </p>
        </div>

        <button
          onClick={() => showToast('Membuka wizard pembuatan segmen audiens baru...')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Bangun Segmen Baru</span>
        </button>
      </div>

      {/* Audience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {audiences.map((aud) => (
          <div
            key={aud.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono">
                  {aud.channel}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {aud.matchRate}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{aud.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{aud.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-sans block">JUMLAH KONTAK</span>
                <span className="font-extrabold text-slate-900 text-sm">{aud.size}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Sinkronisasi segmen "${aud.name}" sedang berjalan...`)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sinkronkan Iklan</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
