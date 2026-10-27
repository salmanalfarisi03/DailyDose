'use client';

import React, { useState } from 'react';
import { RotateCcw, Plus, Bell, CheckCircle2, ShieldCheck, Database, X } from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { UserProfile } from '@/types/api';

interface NavbarProps {
  activeTab: ActiveTab;
  onRefresh: () => void;
  loading: boolean;
  onQuickAction: (action: 'customer' | 'product' | 'invoice' | 'task') => void;
  currentUser?: UserProfile;
  onOpenAccountModal?: () => void;
  onOpenDiagnosticsModal?: () => void;
}

const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Ringkasan Performa & Kontrol Eksekutif',
    subtitle: 'Monitoring metrik bisnis, keuangan real-time, dan status automasi inventori',
  },
  campaigns: {
    title: 'Kampanye Pemasaran Langsung',
    subtitle: 'Pantau 9 kampanye pemasaran aktif, pacing anggaran, dan performa ROAS',
  },
  leads: {
    title: 'Pipeline Prospek Penjualan B2B',
    subtitle: 'Manajemen pipeline penjualan, skoring prospek B2B, dan kontak klien',
  },
  analytics: {
    title: 'Analisis Mendalam & Finansial',
    subtitle: 'Visualisasi 3D chart arus kas, rasio piutang, dan tren kuartal',
  },
  audiences: {
    title: 'Segmen Audiens & Penargetan Iklan',
    subtitle: 'Segmentasi pelanggan, retargeting kampanye, dan analisis kohor',
  },
  reports: {
    title: 'Laporan Keuangan & Audit Kampanye',
    subtitle: 'Rekonsiliasi invoice, audit piutang, dan ringkasan eksekutif',
  },
  settings: {
    title: 'Pengaturan Ruang Kerja',
    subtitle: 'Konfigurasi organisasi, hak akses peran, dan integrasi API',
  },
  help: {
    title: 'Pusat Bantuan & Dokumentasi',
    subtitle: 'Panduan operasional sistem dan status kesehatan infrastruktur',
  },
  customers: {
    title: 'Pelanggan & Manajemen CRM',
    subtitle: 'Kelola kontak, status keaktifan, dan profil pelanggan B2B terverifikasi',
  },
  products: {
    title: 'Katalog Produk & Inventori',
    subtitle: 'Pantau persediaan stok, SKU, dan harga produk secara berkala',
  },
  invoices: {
    title: 'Invoices & Rekap Penagihan',
    subtitle: 'Terbitkan tagihan baru, pantau status pembayaran, dan arus kas masuk',
  },
  tasks: {
    title: 'Daftar Tugas & Tindak Lanjut',
    subtitle: 'Prioritaskan pekerjaan operasional dan hubungkan dengan pelanggan',
  },
  ai: {
    title: 'DailyDose AI Business Suite',
    subtitle: 'Konsultasi cerdas, rekomendasi keuangan, dan analisis data otomatis',
  },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onRefresh,
  loading,
  onQuickAction,
  currentUser,
  onOpenAccountModal,
  onOpenDiagnosticsModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const currentTab = tabTitles[activeTab];

  return (
    <header className="h-22 border-b border-slate-200/70 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
            {currentTab.title}
          </h1>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            Q4 FY-2026
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{currentTab.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Server IP / Engine Pill (Clickable to open System Diagnostics) */}
        <button
          onClick={onOpenDiagnosticsModal}
          title="Klik untuk membuka Diagnostik Sistem & Status Database"
          className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-mono text-slate-600 transition cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>127.0.0.1:8000</span>
        </button>

        {/* User Role Badge Button */}
        {currentUser && (
          <button
            onClick={onOpenAccountModal}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 transition cursor-pointer group"
            title="Klik untuk beralih akun atau peran"
          >
            <div className="w-5 h-5 rounded-full bg-[#0f172a] text-white text-[9px] font-bold flex items-center justify-center">
              AD
            </div>
            <span className="font-semibold text-slate-800 text-xs">
              Aditya
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
              OWNER
            </span>
          </button>
        )}

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition flex items-center justify-center cursor-pointer disabled:opacity-50"
          title="Segarkan data dari database"
        >
          <RotateCcw
            className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`}
          />
        </button>

        {/* Primary Action CTA (Obsidian) */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition cursor-pointer select-none"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Tambah Data / Transaksi</span>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    onQuickAction('invoice');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Buat Invoice Baru
                </button>
                <button
                  onClick={() => {
                    onQuickAction('customer');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition font-medium flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Tambah Pelanggan
                </button>
                <button
                  onClick={() => {
                    onQuickAction('product');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition font-medium flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Tambah Produk
                </button>
                <button
                  onClick={() => {
                    onQuickAction('task');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition font-medium flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Tambah Tugas
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bell Notification Button with Interactive Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition flex items-center justify-center cursor-pointer relative"
            title="Notifikasi Sistem & Audit Realtime"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Notifikasi Sistem</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      4 Aktif
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex items-start gap-2.5">
                    <Database className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 text-[11px]">PostgreSQL 17 RDS Terhubung</p>
                      <p className="text-[10px] text-slate-500">Latensi connection pool stabil pada 24ms.</p>
                      <span className="text-[9px] text-slate-400">Baru saja</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 text-[11px]">Audit Kriptografis Ledger OK</p>
                      <p className="text-[10px] text-slate-500">Verifikasi hash SHA-256 tanpa selisih (Zero Tampering).</p>
                      <span className="text-[9px] text-slate-400">12 menit lalu</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 text-[11px]">Gateway SLA 99.98% Terpenuhi</p>
                      <p className="text-[10px] text-slate-500">Uptime seluruh router bisnis berjalan lancar.</p>
                      <span className="text-[9px] text-slate-400">1 jam lalu</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onOpenDiagnosticsModal?.();
                  }}
                  className="w-full mt-2 py-2 text-center text-[11px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition cursor-pointer border-t border-slate-100"
                >
                  Buka Diagnostik Sistem Lengkap →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
