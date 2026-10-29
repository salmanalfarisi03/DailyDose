'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  X,
  Play,
  Pause,
} from 'lucide-react';

interface CampaignItem {
  id: number;
  title: string;
  channel: string;
  status: string;
  spent: string;
  budget: string;
  roas: string;
  revenue: string;
  orders: number;
  daysLeft: number;
  active: boolean;
}

interface CampaignsViewProps {
  onPlanCampaign?: () => void;
  isDarkMode?: boolean;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ onPlanCampaign, isDarkMode = false }) => {
  const [filterChannel, setFilterChannel] = useState('Semua');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Modals state
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State for New Campaign
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('Pencarian Berbayar');
  const [newBudget, setNewBudget] = useState('15000000');
  const [newRoas, setNewRoas] = useState('4.8');
  const [newDays, setNewDays] = useState('60');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [campaignsList, setCampaignsList] = useState<CampaignItem[]>([
    {
      id: 1,
      title: 'Pencarian Brand — Highmoor',
      channel: 'Pencarian Berbayar',
      status: 'Aktif',
      spent: 'Rp 46.100.000',
      budget: 'Rp 73.300.000',
      roas: '5.42×',
      revenue: 'Rp 249.512.000',
      orders: 1420,
      daysLeft: 71,
      active: true,
    },
    {
      id: 2,
      title: 'Buletin Mingguan Jalur Petualang',
      channel: 'Email Marketing',
      status: 'Aktif',
      spent: 'Rp 5.500.000',
      budget: 'Rp 9.000.000',
      roas: '9.75×',
      revenue: 'Rp 87.760.000',
      orders: 660,
      daysLeft: 61,
      active: true,
    },
    {
      id: 3,
      title: 'Pemulihan Keranjang Terbengkalai',
      channel: 'Email Marketing',
      status: 'Aktif',
      spent: 'Rp 4.900.000',
      budget: 'Rp 9.000.000',
      roas: '8.69×',
      revenue: 'Rp 78.234.000',
      orders: 589,
      daysLeft: 91,
      active: true,
    },
    {
      id: 4,
      title: 'Retargeting Pelari Lintas Alam',
      channel: 'Media Sosial Berbayar',
      status: 'Aktif',
      spent: 'Rp 11.200.000',
      budget: 'Rp 19.000.000',
      roas: '4.08×',
      revenue: 'Rp 45.645.000',
      orders: 394,
      daysLeft: 21,
      active: true,
    },
    {
      id: 5,
      title: 'Iklan Katalog Tenda & Perlengkapan',
      channel: 'Pencarian Berbayar',
      status: 'Aktif',
      spent: 'Rp 5.700.000',
      budget: 'Rp 12.200.000',
      roas: '5.47×',
      revenue: 'Rp 31.422.000',
      orders: 281,
      daysLeft: 31,
      active: true,
    },
    {
      id: 6,
      title: 'Rilis Pakaian Musim Hujan',
      channel: 'Media Sosial Berbayar',
      status: 'Aktif',
      spent: 'Rp 6.800.000',
      budget: 'Rp 9.900.000',
      roas: '4.11×',
      revenue: 'Rp 27.777.000',
      orders: 210,
      daysLeft: 10,
      active: true,
    },
    {
      id: 7,
      title: 'Pratinjau Matras & Kantung Tidur',
      channel: 'Kreator & Afiliasi',
      status: 'Terjadwal',
      spent: 'Rp 0',
      budget: 'Rp 8.000.000',
      roas: '4.50× (Est)',
      revenue: 'Rp 0',
      orders: 0,
      daysLeft: 90,
      active: false,
    },
    {
      id: 8,
      title: 'Uji Coba Lapangan Influencer',
      channel: 'Kreator & Afiliasi',
      status: 'Aktif',
      spent: 'Rp 4.075.000',
      budget: 'Rp 10.000.000',
      roas: '4.60×',
      revenue: 'Rp 18.752.000',
      orders: 136,
      daysLeft: 45,
      active: true,
    },
    {
      id: 9,
      title: 'Program Referral Komunitas B2B',
      channel: 'Program Referral',
      status: 'Aktif',
      spent: 'Rp 1.100.000',
      budget: 'Rp 4.000.000',
      roas: '20.5×',
      revenue: 'Rp 22.571.000',
      orders: 189,
      daysLeft: 120,
      active: true,
    },
  ]);

  const toggleCampaignStatus = (id: number) => {
    setCampaignsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextActive = !c.active;
          showToast(`Kampanye "${c.title}" ${nextActive ? 'diaktifkan kembali' : 'dijeda sementara'}`);
          return {
            ...c,
            active: nextActive,
            status: nextActive ? 'Aktif' : 'Dijeda',
          };
        }
        return c;
      })
    );
    if (selectedCampaign && selectedCampaign.id === id) {
      setSelectedCampaign((prev) =>
        prev
          ? {
              ...prev,
              active: !prev.active,
              status: !prev.active ? 'Aktif' : 'Dijeda',
            }
          : null
      );
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const budgetFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(newBudget) || 10000000);

    const newCamp: CampaignItem = {
      id: Date.now(),
      title: newTitle.trim(),
      channel: newChannel,
      status: 'Aktif',
      spent: 'Rp 0',
      budget: budgetFormatted,
      roas: `${newRoas}×`,
      revenue: 'Rp 0',
      orders: 0,
      daysLeft: Number(newDays) || 60,
      active: true,
    };

    setCampaignsList([newCamp, ...campaignsList]);
    setCreateModalOpen(false);
    setNewTitle('');
    showToast(`Kampanye "${newCamp.title}" berhasil dibuat dan mulai tayang!`);
  };

  const filtered = campaignsList.filter((c) => {
    const matchChannel =
      filterChannel === 'Semua' ||
      c.channel.toLowerCase() === filterChannel.toLowerCase();
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.channel.toLowerCase().includes(search.toLowerCase());
    return matchChannel && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border shadow-xs transition-colors ${
          isDarkMode
            ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}
      >
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
            <span>Kampanye Pemasaran Langsung</span>
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            Monitoring {campaignsList.length} kampanye aktif, alokasi anggaran, dan efisiensi ROAS blended secara real-time.
          </p>
        </div>

        <button
          onClick={() => {
            if (onPlanCampaign) {
              onPlanCampaign();
            } else {
              setCreateModalOpen(true);
            }
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition ${
            isDarkMode
              ? 'bg-zinc-100 hover:bg-white text-zinc-900'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kampanye Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border shadow-xs transition-colors ${
          isDarkMode
            ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            'Semua',
            'Pencarian Berbayar',
            'Media Sosial Berbayar',
            'Email Marketing',
            'Kreator & Afiliasi',
            'Program Referral',
          ].map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterChannel === ch
                  ? isDarkMode
                    ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kampanye atau kanal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition ${
              isDarkMode
                ? 'bg-[#151722] border-white/10 text-zinc-100 placeholder:text-zinc-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCampaign(c)}
            className={`rounded-2xl p-5 border shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 cursor-pointer group ${
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
                      ? 'bg-white/[0.06] text-zinc-300 border-white/10'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {c.channel}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                  }`}
                >
                  {c.active ? 'Aktif' : 'Dijeda'}
                </span>
              </div>
              <h3 className="font-bold text-sm truncate group-hover:text-indigo-400 transition">
                {c.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Sisa durasi: {c.daysLeft} hari
              </p>
            </div>

            <div className={`space-y-2 pt-2 border-t font-mono text-xs ${isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'}`}>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Realisasi Biaya:</span>
                <span className={`font-bold ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}>{c.spent}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Alokasi Anggaran:</span>
                <span>{c.budget}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Omset Dihasilkan:</span>
                <span className="font-bold text-emerald-500">{c.revenue}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Efisiensi ROAS:</span>
                <span className="font-black text-indigo-400">{c.roas}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-dashed border-white/10">
              <span className="text-[10px] text-slate-400 font-sans">
                Klik kartu untuk detail
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCampaignStatus(c.id);
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                  c.active
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
                title={c.active ? 'Jeda Kampanye' : 'Aktifkan Kampanye'}
              >
                {c.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{c.active ? 'Jeda' : 'Aktifkan'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MODAL DETAIL KAMPANYE INTERAKTIF
         ========================================================================= */}
      {selectedCampaign && (
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
                  {selectedCampaign.channel}
                </span>
                <h3 className="text-lg font-bold mt-1.5">{selectedCampaign.title}</h3>
                <p className="text-xs text-slate-400">ID Kampanye #{selectedCampaign.id} • Sisa {selectedCampaign.daysLeft} hari</p>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">TOTAL BIAYA TERPAKAI</span>
                <span className="text-base font-bold mt-1 block">{selectedCampaign.spent}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">dari alokasi {selectedCampaign.budget}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">OMSET HASIL IKLAN</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">{selectedCampaign.revenue}</span>
                <span className="text-[10px] text-indigo-400 font-bold block mt-0.5">ROAS {selectedCampaign.roas}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">VOLUME PESANAN</span>
                <span className="text-base font-bold mt-1 block">{selectedCampaign.orders} Pesanan</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tingkat konversi rata-rata 3,8%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">STATUS TAYANG</span>
                <span className={`text-sm font-bold mt-1 block ${selectedCampaign.active ? 'text-emerald-400' : 'text-slate-400'}`}>
                  ● {selectedCampaign.status}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pacing anggaran terpantau normal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => toggleCampaignStatus(selectedCampaign.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                  selectedCampaign.active
                    ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                }`}
              >
                {selectedCampaign.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{selectedCampaign.active ? 'Jeda Kampanye' : 'Aktifkan Kembali'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCampaign(null);
                  showToast('Pengaturan kampanye disimpan');
                }}
                className={`px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
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
          MODAL BUAT KAMPANYE BARU
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
              <h3 className="text-base font-bold">Rencanakan Kampanye Pemasaran Baru</h3>
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
                  Nama Kampanye Pemasaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Flash Sale Akhir Tahun 2026"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                    isDarkMode
                      ? 'bg-[#151722] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Pilih Kanal Pemasaran <span className="text-rose-500">*</span>
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
                  <option value="Pencarian Berbayar">Pencarian Berbayar (Google Ads)</option>
                  <option value="Media Sosial Berbayar">Media Sosial Berbayar (Meta & TikTok)</option>
                  <option value="Email Marketing">Email Marketing (Klaviyo / Mailchimp)</option>
                  <option value="Kreator & Afiliasi">Endorsement Kreator & Afiliasi</option>
                  <option value="Program Referral">Program Referral Komunitas B2B</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Anggaran Biaya (IDR)
                  </label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Target ROAS
                  </label>
                  <input
                    type="text"
                    value={newRoas}
                    onChange={(e) => setNewRoas(e.target.value)}
                    placeholder="4.5"
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
                  Terbitkan Kampanye
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
