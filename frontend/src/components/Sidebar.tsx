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
}) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
            DD
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                DailyDose 
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-200">
                OS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider font-medium">
              Sistem Operasi Bisnis Eksekutif
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-280px)]">
          {/* PEMASARAN */}
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 px-3 font-mono">
              PEMASARAN
            </p>
            <div className="space-y-1">
              {/* Ringkasan Eksekutif */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid
                    className={`w-4 h-4 ${
                      activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'
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
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone
                    className={`w-4 h-4 ${
                      activeTab === 'campaigns' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Kampanye Iklan</span>
                </div>
                <span
                  className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                    activeTab === 'campaigns'
                      ? 'bg-slate-800 text-white'
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
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className={`w-4 h-4 ${
                      activeTab === 'leads' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Prospek B2B (Leads)</span>
                </div>
                <span
                  className={`text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                    activeTab === 'leads'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  10
                </span>
              </button>

              {/* Analisis Bisnis (3D Analytics) */}
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3
                    className={`w-4 h-4 ${
                      activeTab === 'analytics' ? 'text-white' : 'text-slate-400'
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
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers
                    className={`w-4 h-4 ${
                      activeTab === 'audiences' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Target Audiens</span>
                </div>
              </button>

              {/* Laporan & Audit */}
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'reports'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText
                    className={`w-4 h-4 ${
                      activeTab === 'reports' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Laporan Keuangan</span>
                </div>
              </button>
            </div>
          </div>

          {/* KECERDASAN BUATAN (AI ADVISOR) */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                KECERDASAN BUATAN
              </p>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI COPILOT
              </span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'ai'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-indigo-700 hover:bg-indigo-50/70 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles
                    className={`w-4 h-4 ${
                      activeTab === 'ai' ? 'text-indigo-300' : 'text-indigo-600 animate-pulse'
                    }`}
                  />
                  <span>Asisten AI Eksekutif</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                  AKTIF
                </span>
              </button>
            </div>
          </div>

          {/* RUANG KERJA */}
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-2 mb-2 px-3 font-mono">
              RUANG KERJA
            </p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={`w-4 h-4 ${
                      activeTab === 'settings' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Pengaturan Sistem</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('help')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'help'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle
                    className={`w-4 h-4 ${
                      activeTab === 'help' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Pusat Bantuan</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sidebar (Kartu Realisasi Target & Profil — TANPA PostgreSQL / FastAPI) */}
      <div className="p-4 border-t border-slate-100 bg-white">
        {/* Kartu Realisasi Target */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              Realisasi Oktober
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-mono">
              85%
            </span>
          </div>

          <div className="text-base font-extrabold text-slate-900 tracking-tight font-mono">
            Rp 254,0 Jt{' '}
            <span className="text-[11px] font-normal text-slate-400 font-sans">
              dari target Rp 300 Jt
            </span>
          </div>

          {/* Progress Bar horizontal oranye/terakota terisi 85% */}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
              style={{ width: '85%' }}
            />
          </div>

          <div className="text-emerald-600 text-[11px] font-medium mt-1.5 font-mono">
            +Rp 46.841.000 di atas target
          </div>
        </div>

        {/* Profil Pengguna */}
        <div
          onClick={onOpenAccountModal}
          title="Kelola Profil Akun"
          className="p-2 -mx-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
              {currentUser.initials || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser.title || 'Direktur Utama'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            {onLogout && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                title="Keluar / Logout"
                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition"
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
