'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  X,
  FileText,
  User,
  MapPin,
} from 'lucide-react';

interface LeadItem {
  id: number;
  initials: string;
  name: string;
  contact: string;
  location: string;
  phone: string;
  email: string;
  value: string;
  stage: string;
  score: number;
  scoreColor: string;
}

interface LeadsViewProps {
  isDarkMode?: boolean;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ isDarkMode = false }) => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('Semua');
  const [toast, setToast] = useState<string | null>(null);

  // Modals
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newLocation, setNewLocation] = useState('Jakarta, ID');
  const [newValue, setNewValue] = useState('25000000');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStage, setNewStage] = useState('Baru Masuk');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [leadsList, setLeadsList] = useState<LeadItem[]>([
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
      stage: 'Kualifikasi Anggaran',
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
      stage: 'Diskusi Kebutuhan',
      score: 65,
      scoreColor: 'text-slate-600 bg-slate-50 border-slate-300',
    },
    {
      id: 6,
      initials: 'SR',
      name: 'Switchback Running Club',
      contact: 'Tomás Mendez',
      location: 'Denver, CO',
      phone: '+1 (303) 555-7712',
      email: 'tomas@switchback.org',
      value: 'Rp 34.500.000',
      stage: 'Baru Masuk',
      score: 82,
      scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
  ]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContact.trim()) return;

    const valFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(newValue) || 10000000);

    const initials = newName
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newLead: LeadItem = {
      id: Date.now(),
      initials: initials || 'PB',
      name: newName.trim(),
      contact: newContact.trim(),
      location: newLocation.trim() || 'Jakarta, ID',
      phone: newPhone.trim() || '+62 811 0000 0000',
      email: newEmail.trim() || 'info@perusahaan.com',
      value: valFormatted,
      stage: newStage,
      score: Math.floor(Math.random() * 25) + 65,
      scoreColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    };

    setLeadsList([newLead, ...leadsList]);
    setCreateModalOpen(false);
    setNewName('');
    setNewContact('');
    showToast(`Prospek B2B "${newLead.name}" berhasil ditambahkan ke pipeline!`);
  };

  const handleUpdateLeadStage = (leadId: number, nextStage: string) => {
    setLeadsList((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, stage: nextStage } : null));
    }
    showToast(`Tahap prospek berhasil diperbarui menjadi "${nextStage}"`);
  };

  const filteredLeads = leadsList.filter((l) => {
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
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border shadow-xs transition-colors ${
          isDarkMode
            ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}
      >
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
            <span>Pipeline Prospek Penjualan B2B</span>
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
            {leadsList.length} prospek B2B bernilai tinggi terhubung ke pipeline penjualan kuartal ini.
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
          <span>Tambah Prospek Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border shadow-xs transition-colors ${
          isDarkMode
            ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Baru Masuk', 'Diskusi', 'Proposal', 'Negosiasi'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStage === st
                  ? isDarkMode
                    ? 'bg-zinc-100 text-zinc-900 shadow-xs'
                    : 'bg-slate-900 text-white shadow-xs'
                  : isDarkMode
                  ? 'bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]'
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
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition ${
              isDarkMode
                ? 'bg-[#151722] border-white/10 text-zinc-100 placeholder:text-zinc-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Leads List */}
      <div
        className={`rounded-2xl border shadow-xs overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-[#1e2130] border-white/[0.08] text-zinc-100'
            : 'bg-white border-slate-200/80 text-slate-900'
        }`}
      >
        <div className={`divide-y ${isDarkMode ? 'divide-white/[0.06]' : 'divide-slate-100'}`}>
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`p-4 transition flex items-center justify-between flex-wrap gap-4 cursor-pointer ${
                isDarkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-[240px]">
                <div
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-xs flex-shrink-0 ${
                    isDarkMode ? 'bg-white/10 text-white' : 'bg-slate-900 text-white'
                  }`}
                >
                  {lead.initials}
                </div>
                <div>
                  <h4 className="font-bold text-sm hover:text-indigo-400 transition">{lead.name}</h4>
                  <p className="text-xs text-slate-400">
                    {lead.contact} • {lead.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans uppercase">POTENSI DEAL</div>
                  <div className="font-extrabold text-sm">{lead.value}</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-sans uppercase">TAHAP DEAL</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold border ${
                      isDarkMode
                        ? 'bg-white/[0.06] text-zinc-200 border-white/10'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(lead.email);
                    showToast(`Email ${lead.email} disalin ke clipboard!`);
                  }}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isDarkMode
                      ? 'border-white/10 hover:bg-white/[0.08] text-zinc-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Salin & Kirim Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(lead.phone);
                    showToast(`Nomor telepon ${lead.phone} disalin ke clipboard!`);
                  }}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isDarkMode
                      ? 'border-white/10 hover:bg-white/[0.08] text-zinc-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Hubungi Telepon"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead(lead);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition ${
                    isDarkMode
                      ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Lihat Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL DETAIL PROSPEK & PROPOSAL
         ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl border space-y-5 animate-in zoom-in-95 duration-200 ${
              isDarkMode
                ? 'bg-[#1e2130] border-white/10 text-zinc-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 font-black text-sm flex items-center justify-center border border-indigo-500/30">
                  {selectedLead.initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400">
                    PIC: {selectedLead.contact} • {selectedLead.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">NILAI POTENSI DEAL</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">{selectedLead.value}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Kontrak pesanan grosir kuartal</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">SKOR PROSPEK AI</span>
                <span className="text-base font-bold text-amber-400 mt-1 block">{selectedLead.score} / 100</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Probabilitas closing 85%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">EMAIL RESMI</span>
                <span className="text-xs font-bold mt-1 block truncate">{selectedLead.email}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Terkirim penawaran PDF v2.1</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <span className="text-[10px] text-slate-400 block font-sans">NOMOR TELEPON / WA</span>
                <span className="text-xs font-bold mt-1 block">{selectedLead.phone}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Terakhir kontak: 2 hari lalu</span>
              </div>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Ubah Tahapan Pipeline Deal:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Baru Masuk', 'Diskusi Kebutuhan', 'Review Proposal', 'Negosiasi Kontrak', 'Closing (Won)'].map((stg) => (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => handleUpdateLeadStage(selectedLead.id, stg)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border text-center ${
                      selectedLead.stage === stg
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                        : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setSelectedLead(null);
                  showToast(`Proposal untuk ${selectedLead.name} telah diperbarui`);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer ${
                  isDarkMode
                    ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Simpan &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL TAMBAH PROSPEK B2B BARU
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
              <h3 className="text-base font-bold">Tambah Prospek B2B Baru</h3>
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
                  Nama Perusahaan / Akun Grosir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: PT Outdoor Gear Nusantara"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                    isDarkMode
                      ? 'bg-[#151722] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kontak PIC <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="Budi Santoso"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Kota / Lokasi
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Bandung, ID"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Estimasi Deal (IDR)
                  </label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tahapan Pipeline
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Baru Masuk">Baru Masuk</option>
                    <option value="Diskusi Kebutuhan">Diskusi Kebutuhan</option>
                    <option value="Proposal Terkirim">Proposal Terkirim</option>
                    <option value="Negosiasi Kontrak">Negosiasi Kontrak</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email PIC
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="pic@perusahaan.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
                      isDarkMode
                        ? 'bg-[#151722] border-white/10 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+62 812 3456 7890"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none ${
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
                  Daftarkan Prospek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
