'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  BarChart2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface CampaignsViewProps {
  onPlanCampaign?: () => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({ onPlanCampaign }) => {
  const [filterChannel, setFilterChannel] = useState('All');
  const [search, setSearch] = useState('');

  const [campaignsList, setCampaignsList] = useState([
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
      daysLeft: 80,
      active: true,
    },
  ]);

  const filtered = campaignsList.filter((c) => {
    const matchChannel = filterChannel === 'Semua' || c.channel === filterChannel;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.channel.toLowerCase().includes(search.toLowerCase());
    return matchChannel && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-indigo-600" />
            <span>Kampanye Pemasaran Langsung</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring 9 kampanye aktif, alokasi anggaran, dan efisiensi ROAS blended secara
            real-time.
          </p>
        </div>

        <button
          onClick={onPlanCampaign}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kampanye Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
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
                  ? 'bg-slate-900 text-white shadow-xs'
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
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                  {c.channel}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {c.active ? 'Aktif' : 'Dijeda'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 truncate">{c.title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Sisa durasi: {c.daysLeft} hari</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 font-mono text-xs">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Realisasi Biaya:</span>
                <span className="font-bold text-slate-800">{c.spent}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Alokasi Anggaran:</span>
                <span>{c.budget}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Omset Dihasilkan:</span>
                <span className="font-bold text-emerald-600">{c.revenue}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Efisiensi ROAS:</span>
                <span className="font-black text-indigo-600">{c.roas}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
