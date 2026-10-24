'use client';

import React from 'react';
import {
  LayoutGrid,
  Users,
  Package,
  Receipt,
  CheckSquare,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { HealthResponse, UserProfile } from '@/types/api';

export type ActiveTab =
  | 'dashboard'
  | 'customers'
  | 'products'
  | 'invoices'
  | 'tasks'
  | 'ai';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  health: HealthResponse | null;
  healthLoading: boolean;
  lowStockCount?: number;
  currentUser?: UserProfile;
  onOpenAccountModal?: () => void;
  onOpenDiagnosticsModal?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  health,
  healthLoading,
  lowStockCount = 1,
  currentUser = {
    id: 'user-1',
    name: 'Aditya Dharma',
    email: 'aditya.dharma@dailydose.ai',
    role: 'OWNER',
    title: 'Managing Director',
    initials: 'AD',
    avatarColor: 'bg-[#0f172a] text-white',
  },
  onOpenAccountModal,
  onOpenDiagnosticsModal,
  onLogout,
}) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white/80 backdrop-blur-md border-r border-slate-200/70 flex flex-col justify-between h-screen sticky top-0 z-20 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-20 flex items-center px-6 gap-3.5 border-b border-slate-100/80">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm ring-1 ring-slate-800 flex-shrink-0">
            DD
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                DailyDose
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                OS
              </span>
            </div>
            <p className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-slate-400 mt-0.5">
              ENTERPRISE BUSINESS OS
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6">
          {/* CORE WORKBENCH */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2 font-mono">
              CORE WORKBENCH
            </p>
            <div className="space-y-1">
              {/* Executive Dashboard */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#0f172a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid
                    className={`w-4 h-4 ${
                      activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Executive Dashboard</span>
                </div>
                {activeTab === 'dashboard' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              {/* Pelanggan / CRM */}
              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-[#0f172a] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users
                    className={`w-4 h-4 ${
                      activeTab === 'customers' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Pelanggan / CRM</span>
                </div>
                {activeTab === 'customers' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              {/* Katalog Produk */}
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#0f172a] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package
                    className={`w-4 h-4 ${
                      activeTab === 'products' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Katalog Produk</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60">
                  LOW
                </span>
              </button>

              {/* Invoices & Billing */}
              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-[#0f172a] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt
                    className={`w-4 h-4 ${
                      activeTab === 'invoices' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Invoices &amp; Billing</span>
                </div>
                {activeTab === 'invoices' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              {/* Tugas & Follow-up */}
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  activeTab === 'tasks'
                    ? 'bg-[#0f172a] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare
                    className={`w-4 h-4 ${
                      activeTab === 'tasks' ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span>Tugas &amp; Follow-up</span>
                </div>
                {activeTab === 'tasks' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>
          </div>

          {/* INTELLIGENCE */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                INTELLIGENCE
              </p>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                PRO ENGINE
              </span>
            </div>
            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-[#0f172a] text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles
                  className={`w-4 h-4 ${
                    activeTab === 'ai' ? 'text-indigo-400' : 'text-indigo-500'
                  }`}
                />
                <span>AI Business Suite</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Server Telemetry & User Profile */}
      <div className="p-4 border-t border-slate-100 bg-white/50 space-y-3">
        {/* Server Telemetry Widget */}
        <div
          onClick={onOpenDiagnosticsModal}
          title="Klik untuk melihat Diagnostik Sistem"
          className="p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 space-y-2 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>FastAPI Engine</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              v0.1.0
            </span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>PostgreSQL RDS</span>
            <span className="text-slate-600 font-medium">24ms ping</span>
          </div>

          {/* Thin Horizontal Progress Bar */}
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-emerald-400 rounded-full" />
          </div>
        </div>

        {/* User Profile */}
        <div
          onClick={onOpenAccountModal}
          title="Klik untuk mengelola akun"
          className="p-2 -mx-1 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200/70 transition cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#0f172a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                Aditya Dharma
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Managing Director
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              title="Keluar / Logout"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
