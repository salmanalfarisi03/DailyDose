'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Flame,
  Building,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const LeadsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const leads = [
    {
      id: 1,
      initials: 'GL',
      name: 'Northfork Outfitters',
      contact: 'Grace Liang',
      location: 'Missoula, MT',
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
      contact: 'Rachel Stein',
      location: 'Boise, ID',
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
      contact: 'Noah Fischer',
      location: 'Seattle, WA',
      phone: '+1 (206) 555-9271',
      email: 'noah@brightline.io',
      value: 'Rp 18.900.000',
      stage: 'Kualifikasi Budget',
      score: 70,
      scoreColor: 'text-amber-700 bg-amber-50 border-amber-300',
    },
    {
      id: 4,
      initials: 'HO',
      name: 'Cascade Basecamp Supply',
      contact: 'Hannah Okafor',
      location: 'Bend, OR',
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
      contact: 'Freya Lindqvist',
      location: 'Ketchum, ID',
      phone: '+1 (208) 555-3920',
      email: 'freya@alderandash.com',
      value: 'Rp 17.400.000',
      stage: 'Discovery Call',
      score: 65,
      scoreColor: 'text-slate-600 bg-slate-50 border-slate-300',
    },
    {
      id: 6,
      initials: 'TK',
      name: 'Switchback Running Club',
      contact: 'Tomás K.',
      location: 'Portland, OR',
      phone: '+1 (503) 555-7721',
      email: 'tomas@switchbackrun.org',
      value: 'Rp 14.500.000',
      stage: 'Baru Masuk',
      score: 82,
      scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
    {
      id: 7,
      initials: 'HR',
      name: 'Highmoor Retail Collective',
      contact: 'David Vance',
      location: 'Denver, CO',
      phone: '+1 (303) 555-9901',
      email: 'david@highmoor.com',
      value: 'Rp 36.000.000',
      stage: 'Negosiasi Kontrak',
      score: 75,
      scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
    {
      id: 8,
      initials: 'PT',
      name: 'Peak Trail Outpost',
      contact: 'Sarah Jenkins',
      location: 'Salt Lake City, UT',
      phone: '+1 (801) 555-4123',
      email: 'sarah@peaktrail.com',
      value: 'Rp 22.800.000',
      stage: 'Review Proposal',
      score: 69,
      scoreColor: 'text-slate-600 bg-slate-50 border-slate-300',
    },
    {
      id: 9,
      initials: 'TG',
      name: 'Tahoma Gear Co.',
      contact: 'Markus Reid',
      location: 'Tacoma, WA',
      phone: '+1 (253) 555-6677',
      email: 'm.reid@tahomagear.com',
      value: 'Rp 12.300.000',
      stage: 'Discovery Call',
      score: 64,
      scoreColor: 'text-slate-600 bg-slate-50 border-slate-300',
    },
    {
      id: 10,
      initials: 'SV',
      name: 'Sun Valley Sports Resort',
      contact: 'Elena Rostova',
      location: 'Ketchum, ID',
      phone: '+1 (208) 555-2211',
      email: 'elena@sunvalleysports.com',
      value: 'Rp 29.500.000',
      stage: 'Proposal Terkirim',
      score: 74,
      scoreColor: 'text-amber-700 bg-amber-50 border-amber-300',
    },
  ];

  const filteredLeads = leads.filter((l) => {
    const matchStage = selectedStage === 'Semua' || l.stage.includes(selectedStage);
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

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
            <Flame className="w-6 h-6 text-amber-500" />
            <span>Pipeline Prospek Penjualan B2B</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            10 prospek B2B bernilai tinggi terhubung ke pipeline penjualan kuartal ini.
          </p>
        </div>

        <button
          onClick={() => showToast('Membuka form pendaftaran prospek B2B baru...')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prospek Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Baru Masuk', 'Discovery Call', 'Proposal', 'Negosiasi'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStage === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama prospek atau kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 hover:bg-slate-50/80 transition flex items-center justify-between flex-wrap gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-[240px]">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {lead.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{lead.name}</h4>
                  <p className="text-xs text-slate-500">
                    {lead.contact} • {lead.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans uppercase">POTENSI DEAL</div>
                  <div className="font-extrabold text-slate-900 text-sm">{lead.value}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-sans uppercase">TAHAP DEAL</div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-sans font-semibold">
                    {lead.stage}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-sans uppercase">SKOR PROSPEK</div>
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-bold ${lead.scoreColor}`}
                  >
                    {lead.score}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast(`Mengirim email ke ${lead.email}...`)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                  title="Kirim Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast(`Menghubungi nomor ${lead.phone}...`)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                  title="Hubungi Telepon"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => showToast(`Membuka berkas proposal untuk ${lead.name}...`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Lihat Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
