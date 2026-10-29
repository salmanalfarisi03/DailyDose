'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  X,
  Target,
  Users,
} from 'lucide-react';

interface AudienceItem {
  id: number;
  name: string;
  description: string;
  size: string;
  matchRate: string;
  channel: string;
  synced: string;
}

interface AudiencesViewProps {
  isDarkMode?: boolean;
}

export const AudiencesView: React.FC<AudiencesViewProps> = ({ isDarkMode = false }) => {
  const [toast, setToast] = useState<string | null>(null);
  const [selectedAudience, setSelectedAudience] = useState<AudienceItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newChannel, setNewChannel] = useState('Meta & Google Ads');
  const [newSize, setNewSize] = useState('5.000 kontak');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [audiences, setAudiences] = useState<AudienceItem[]>([
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
  ]);

  const handleSync = (aud: AudienceItem) => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setAudiences((prev) =>
      prev.map((a) => (a.id === aud.id ? { ...a, synced: `Baru saja (${nowTime})` } : a))
    );
    showToast(`Segmen "${aud.name}" berhasil disinkronkan ke ${aud.channel}!`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newAud: AudienceItem = {
      id: Date.now(),
      name: newName.trim(),
      description: newDesc.trim() || 'Segmen dinamis pelanggan berdasarkan kriteria filter.',
      size: newSize.trim() || '1.000 kontak',
      matchRate: `${Math.floor(Math.random() * 10) + 88}% kecocokan`,
      channel: newChannel,
      synced: 'Baru saja',
    };

    setAudiences([newAud, ...audiences]);
    setCreateModalOpen(false);
    setNewName('');
    setNewDesc('');
    showToast(`Segmen audiens "${newAud.name}" berhasil dibuat dan disinkronkan!`);
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
            <span>Segmen Audiens &amp; Penargetan Iklan</span>
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Segmentasi pelanggan dan sinkronisasi otomatis ke Google Ads, Meta Ads, dan Klaviyo.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition ${
            isDarkMode
              ? 'bg-zinc-100 hover:bg-white text-zinc-900'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
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
            onClick={() => setSelectedAudience(aud)}
            className={`rounded-2xl p-6 border shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 cursor-pointer group ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100 hover:border-white/20'
                : 'bg-white border-slate-200/80 text-slate-900 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${
                    isDarkMode
                      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                  }`}
                >
                  {aud.channel}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {aud.matchRate}
                </span>
              </div>
              <h3 className="text-base font-extrabold group-hover:text-indigo-400 transition">
                {aud.name}
              </h3>
              <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                {aud.description}
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'}`}>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-sans block">JUMLAH KONTAK</span>
                <span className="font-extrabold text-sm">{aud.size}</span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Sinkron: {aud.synced}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSync(aud);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isDarkMode
                      ? 'border-white/10 hover:bg-white/[0.08] text-zinc-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sinkronkan Iklan</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MODAL DETAIL SEGMEN AUDIENS
         ========================================================================= */}
      {selectedAudience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-5 animate-in zoom-in-95 duration-200 ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/10 text-zinc-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono">
                  {selectedAudience.channel}
                </span>
                <h3 className="text-lg font-bold mt-1.5">{selectedAudience.name}</h3>
                <p className="text-xs text-slate-400">{selectedAudience.description}</p>
              </div>
              <button
                onClick={() => setSelectedAudience(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">UKURAN AUDIENS</span>
                <span className="text-base font-bold mt-1 block">{selectedAudience.size}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tersaring aktif di database</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">TINGKAT KECOCOKAN</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">{selectedAudience.matchRate}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Meta & Google Customer Match</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 col-span-2">
                <span className="text-[10px] text-slate-400 block font-sans">STATUS INTEGRASI API</span>
                <span className="text-xs font-bold text-indigo-300 mt-1 block">Tersinkronisasi Otomatis • {selectedAudience.synced}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Webhook sinkronisasi berjalan setiap 6 jam</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  handleSync(selectedAudience);
                  setSelectedAudience(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                  isDarkMode
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Paksa Sinkronkan Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedAudience(null)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                  isDarkMode
                    ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL BANGUN SEGMEN BARU
         ========================================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border space-y-5 animate-in zoom-in-95 duration-200 ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/10 text-zinc-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold">Bangun Segmen Audiens Baru</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Nama Segmen Audiens <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Pembeli Jaket Musim Hujan"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                    isDarkMode
                      ? 'bg-[#151722] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Deskripsi Kriteria Audiens
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Pelanggan yang pernah checkout jaket dan berinteraksi dalam 30 hari..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none resize-none ${
                    isDarkMode
                      ? 'bg-[#151722] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kanal Integrasi
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Meta & Google Ads">Meta &amp; Google Ads</option>
                    <option value="TikTok & Instagram">TikTok &amp; Instagram</option>
                    <option value="LinkedIn & Email">LinkedIn &amp; Email B2B</option>
                    <option value="Klaviyo Retargeting">Klaviyo Retargeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Estimasi Jumlah Kontak
                  </label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="10.000 kontak"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                    isDarkMode
                      ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Simpan &amp; Sinkronkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
