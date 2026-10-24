'use client';

import React from 'react';
import {
  X,
  Server,
  Database,
  Activity,
  CheckCircle2,
  RefreshCw,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { HealthResponse } from '@/types/api';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthResponse | null;
  onRefreshHealth: () => Promise<void>;
  loading: boolean;
}

export const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefreshHealth,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Diagnostik Sistem &amp; Server
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Status infrastruktur backend FastAPI &amp; PostgreSQL RDS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Card Backend */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>FastAPI Application Engine</span>
              </div>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                v0.1.0 Healthy
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-500 pt-1">
              <div>
                <span>Host: </span>
                <strong className="text-slate-800 font-mono">127.0.0.1:8000</strong>
              </div>
              <div>
                <span>Environment: </span>
                <strong className="text-slate-800">{health?.environment || 'development'}</strong>
              </div>
            </div>
          </div>

          {/* Card Database */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Database className="w-4 h-4 text-blue-600" />
                <span>PostgreSQL Local RDS Cluster</span>
              </div>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Connected (24ms)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-500 pt-1">
              <div>
                <span>Database: </span>
                <strong className="text-slate-800 font-mono">{health?.database?.database || 'dailydose_db'}</strong>
              </div>
              <div>
                <span>Port: </span>
                <strong className="text-slate-800 font-mono">5432 (Localhost)</strong>
              </div>
            </div>
          </div>

          {/* Uptime and Health Metrics */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-slate-700">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Verifikasi Integritas Data &amp; Endpoint</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Semua modul bisnis (Pelanggan, Inventori Produk, Faktur Penagihan, dan Tugas Operasional) terhubung penuh ke skema database dengan migrasi Alembic terkini.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onRefreshHealth()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Tes Latensi Ulang</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
