'use client';

import React from 'react';
import {
  LayoutGrid,
  Megaphone,
  Users,
  BarChart3,
  Layers,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '@/types/api';

export type ActiveTab =
  | 'dashboard'
  | 'campaigns'
  | 'leads'
  | 'analytics'
  | 'audiences'
  | 'reports'
  | 'ai'
  | 'settings'
  | 'help'
  | 'customers'
  | 'products'
  | 'invoices'
  | 'tasks';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser?: UserProfile;
  onOpenAccountModal?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser = {
    id: 'user-1',
    name: 'Aditya Dharma',
    email: 'aditya.dharma@dailydose.ai',
    role: 'OWNER',
    title: 'Direktur Utama',
    initials: 'AD',
    avatarColor: 'bg-slate-900 text-white',
  },
  onOpenAccountModal,
  onLogout,
  isDarkMode = false,
}) => {
  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 z-20 select-none transition-colors duration-200 ${
        isDarkMode
          ? 'bg-[#0c0d11] border-r border-white/[0.06] text-zinc-100'
          : 'bg-white border-r border-slate-200/80 text-slate-900'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`h-20 flex items-center px-6 gap-3 ${
            isDarkMode ? 'border-b border-white/[0.06]' : 'border-b border-slate-100'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center flex-shrink-0 ${
              isDarkMode
                ? 'bg-white/[0.08] text-white border border-white/10'
                : 'bg-slate-900 text-white shadow-xs'
            }`}
          >
            DD
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold text-base tracking-tight ${
                  isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                }`}
              >
                DailyDose 
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                  isDarkMode
                    ? 'bg-white/[0.06] text-zinc-300 border-white/10'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                OS
              </span>
            </div>
            <p
              className={`text-[10px] tracking-wider font-medium ${
                isDarkMode ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              Sistem Operasi Bisnis Eksekutif
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-280px)]">
          {/* PEMASARAN */}
          <div>
            <p
              className={`text-[10px] uppercase font-bold tracking-wider mb-2 px-3 font-mono ${
                isDarkMode ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              PEMASARAN
            </p>
            <div className="space-y-1">
              {/* Ringkasan Eksekutif */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid
                    className={`w-4 h-4 ${
                      activeTab === 'dashboard'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Ringkasan Eksekutif</span>
                </div>
              </button>

              {/* Kampanye Iklan */}
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'campaigns'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone
                    className={`w-4 h-4 ${
                      activeTab === 'campaigns'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Kampanye Iklan</span>
                </div>
                <span
                  className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                    activeTab === 'campaigns'
                      ? isDarkMode
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-white'
                      : isDarkMode
                      ? 'bg-white/[0.06] text-zinc-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  9
                </span>
              </button>

              {/* Prospek Penjualan (Leads) */}
              <button
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'leads'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className={`w-4 h-4 ${
                      activeTab === 'leads'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Prospek B2B (Leads)</span>
                </div>
                <span
                  className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                    activeTab === 'leads'
                      ? isDarkMode
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-white'
                      : isDarkMode
                      ? 'bg-white/[0.06] text-zinc-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  10
                </span>
              </button>

              {/* Analisis Bisnis */}
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3
                    className={`w-4 h-4 ${
                      activeTab === 'analytics'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Analisis Finansial</span>
                </div>
              </button>

              {/* Target Audiens */}
              <button
                onClick={() => setActiveTab('audiences')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'audiences'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers
                    className={`w-4 h-4 ${
                      activeTab === 'audiences'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Target Audiens</span>
                </div>
              </button>

              {/* Laporan Keuangan */}
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'reports'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className={`w-4 h-4 ${
                      activeTab === 'reports'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Laporan Keuangan</span>
                </div>
              </button>
            </div>
          </div>

          {/* KECERDASAN BUATAN */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p
                className={`text-[10px] uppercase font-bold tracking-wider font-mono ${
                  isDarkMode ? 'text-zinc-500' : 'text-slate-400'
                }`}
              >
                KECERDASAN BUATAN
              </p>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                  isDarkMode
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                AI COPILOT
              </span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'ai'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-indigo-400 hover:bg-white/[0.04] font-medium'
                    : 'text-indigo-700 hover:bg-indigo-50/70 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles
                    className={`w-4 h-4 ${
                      activeTab === 'ai'
                        ? isDarkMode
                          ? 'text-white'
                          : 'text-indigo-300'
                        : 'text-indigo-500 animate-pulse'
                    }`}
                  />
                  <span>Asisten AI Eksekutif</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isDarkMode
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  AKTIF
                </span>
              </button>
            </div>
          </div>

          {/* RUANG KERJA */}
          <div>
            <p
              className={`text-[10px] uppercase font-bold tracking-wider mt-2 mb-2 px-3 font-mono ${
                isDarkMode ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              RUANG KERJA
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={`w-4 h-4 ${
                      activeTab === 'settings'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Pengaturan Sistem</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('help')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'help'
                    ? isDarkMode
                      ? 'bg-white/[0.09] text-white shadow-xs border border-white/[0.08]'
                      : 'bg-slate-900 text-white shadow-xs'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className={`w-4 h-4 ${
                      activeTab === 'help'
                        ? 'text-white'
                        : isDarkMode
                        ? 'text-zinc-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>Pusat Bantuan</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sidebar */}
      <div
        className={`p-4 border-t transition-colors ${
          isDarkMode
            ? 'border-white/[0.06] bg-[#0c0d11]'
            : 'border-slate-100 bg-white'
        }`}
      >
        {/* Kartu Realisasi Target */}
        <div
          className={`rounded-xl p-3 mb-3 shadow-2xs border ${
            isDarkMode
              ? 'bg-[#13151b] border-white/[0.08] text-zinc-300'
              : 'bg-slate-50 border-slate-200/80 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span
              className={`flex items-center gap-1.5 font-semibold text-[11px] ${
                isDarkMode ? 'text-zinc-200' : 'text-slate-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Realisasi Oktober
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono border ${
                isDarkMode
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
              }`}
            >
              85%
            </span>
          </div>

          <div
            className={`text-base font-extrabold tracking-tight font-mono ${
              isDarkMode ? 'text-zinc-100' : 'text-slate-900'
            }`}
          >
            Rp 254,0 Jt{' '}
            <span
              className={`text-[11px] font-normal font-sans ${
                isDarkMode ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              dari target Rp 300 Jt
            </span>
          </div>

          {/* Progress Bar horizontal solid tanpa gradasi */}
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${
              isDarkMode ? 'bg-white/[0.08]' : 'bg-slate-200'
            }`}
          >
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: '85%' }}
            />
          </div>

          <div className="text-emerald-500 text-[11px] font-medium mt-1.5 font-mono">
            +Rp 46.841.000 di atas target
          </div>
        </div>

        {/* Profil Pengguna */}
        <div
          onClick={onOpenAccountModal}
          title="Kelola Profil Akun"
          className={`p-2 -mx-1 rounded-xl border border-transparent transition cursor-pointer flex items-center justify-between group ${
            isDarkMode
              ? 'hover:bg-white/[0.04] hover:border-white/[0.06]'
              : 'hover:bg-slate-50 hover:border-slate-200/60'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                isDarkMode
                  ? 'bg-white/[0.1] text-white border border-white/10'
                  : 'bg-slate-900 text-white shadow-xs'
              }`}
            >
              {currentUser.initials || 'AD'}
            </div>
            <div className="min-w-0">
              <p
                className={`text-xs font-semibold truncate ${
                  isDarkMode ? 'text-zinc-100' : 'text-slate-900'
                }`}
              >
                {currentUser.name}
              </p>
              <p
                className={`text-[10px] truncate ${
                  isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                }`}
              >
                {currentUser.title || 'Direktur Utama'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ChevronDown
              className={`w-4 h-4 ${
                isDarkMode
                  ? 'text-zinc-500 group-hover:text-zinc-300'
                  : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            {onLogout && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                title="Keluar / Logout"
                className={`p-1 rounded transition ${
                  isDarkMode
                    ? 'text-zinc-500 hover:text-rose-400 hover:bg-white/[0.06]'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
