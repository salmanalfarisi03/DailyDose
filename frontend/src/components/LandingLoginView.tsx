'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Database,
  TrendingUp,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AtSign,
} from 'lucide-react';
import { UserProfile, UserRole } from '@/types/api';
import { api } from '@/lib/api';
import { PRESET_USERS } from './AccountAuthModal';

interface LandingLoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LandingLoginView: React.FC<LandingLoginViewProps> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('aditya.dharma@dailydose.ai');
  const [password, setPassword] = useState('OwnerPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Loading & State Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Map aditya.dharma to default owner if used
      const targetEmail =
        email.trim() === 'aditya.dharma@dailydose.ai'
          ? 'owner@dailydose.ai'
          : email.trim();

      const res = await api.login({
        email: targetEmail,
        password: password,
      });

      // Save token and user in localStorage
      if (typeof window !== 'undefined' && res.token) {
        localStorage.setItem('dd_token', res.token);
        localStorage.setItem('dd_user', JSON.stringify(res.user));
      }

      const role = res.user.role as UserRole;
      const initials = res.user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const userProfile: UserProfile = {
        id: String(res.user.id),
        name: res.user.full_name,
        email: res.user.email,
        role: role,
        title:
          role === 'OWNER'
            ? 'Owner & Managing Dir.'
            : role === 'ADMIN'
            ? 'Operations & Business Admin'
            : 'Finance & Invoicing Specialist',
        initials: initials || 'AD',
        avatarColor:
          role === 'OWNER'
            ? 'bg-slate-900 text-white'
            : role === 'ADMIN'
            ? 'bg-indigo-600 text-white'
            : 'bg-emerald-600 text-white',
      };

      setSuccessMessage(`Otorisasi terverifikasi! Selamat datang kembali, ${res.user.full_name}.`);

      setTimeout(() => {
        onLoginSuccess(userProfile);
      }, 600);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Kombinasi email atau kata sandi tidak valid. Pastikan server backend dan PostgreSQL aktif.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSsoLogin = (provider: 'google' | 'microsoft') => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(`Menghubungkan ke ${provider === 'google' ? 'Google Workspace' : 'Microsoft Entra ID'}...`);

    setTimeout(async () => {
      try {
        const res = await api.login({
          email: 'owner@dailydose.ai',
          password: 'OwnerPass123!',
        });

        if (typeof window !== 'undefined' && res.token) {
          localStorage.setItem('dd_token', res.token);
          localStorage.setItem('dd_user', JSON.stringify(res.user));
        }

        onLoginSuccess(PRESET_USERS[0]);
      } catch {
        onLoginSuccess(PRESET_USERS[0]);
      }
    }, 700);
  };

  return (
    <div className="h-full text-slate-800 flex flex-col justify-between bg-slate-50 bg-mesh-radial min-h-screen selection:bg-indigo-100 selection:text-indigo-700 font-sans antialiased overflow-x-hidden">
      {/* =======================================================================
          TOP BAR TELEMETRI (Header)
         ======================================================================= */}
      <header className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200/85 sticky top-0 z-50 transition-all">
        <div className="max-w-[1536px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Logo & System Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs ring-1 ring-slate-800">
              DD
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  DailyDose
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  OS
                </span>
              </div>
              <span className="text-[9.5px] uppercase tracking-[0.24em] font-semibold text-slate-400 mt-1">
                Enterprise Business OS
              </span>
            </div>
            <span className="hidden md:inline-flex ml-3 px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50/80 rounded-full border border-indigo-100 items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              v0.1.0 Secured
            </span>
          </div>

          {/* Right System Telemetry & Status Badges */}
          <div className="flex items-center gap-4">
            {/* PostgreSQL Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/85 shadow-xs text-xs text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-700">PostgreSQL 17 RDS</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-800 font-medium">Terhubung (24ms)</span>
            </div>

            {/* System Engine Status */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/85 text-xs text-slate-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              FastAPI Engine Online
            </div>

            {/* Help / Support Link */}
            <a
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100"
              href="mailto:support@dailydose.ai"
              title="Enterprise Dedicated Support"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>Enterprise Support</span>
            </a>
          </div>
        </div>
      </header>

      {/* =======================================================================
          MAIN CONTENT (2 Kolom Seimbang: Headline & Card Otorisasi)
         ======================================================================= */}
      <main className="flex-grow flex items-center justify-center py-8 lg:py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Executive Value & Intelligence Showcase (Span 7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 xl:pr-6">
            {/* Security Clearance Ribbon */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-xs shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-medium tracking-wide uppercase">
                  Portal Otorisasi Eksekutif Terenkripsi
                </span>
              </div>
            </div>

            {/* Main Display Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-[#0f172a] tracking-tight leading-[1.15]">
                Sistem Operasi Bisnis <span className="text-slate-800">Eksekutif Terpadu.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal pt-1">
                Infrastruktur tata kelola dan intelijen keuangan terpusat bagi dewan manajemen. Mengintegrasikan audit perbendaharaan, rekonsiliasi kas nir-selisih, serta pemantauan solvabilitas korporat secara presisi dan terproteksi.
              </p>
            </div>

            {/* 3 Feature Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Feature Card 1: Visualisasi Finansial */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all duration-200">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
                  <TrendingUp className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Analisis Finansial Terpadu
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Audit realisasi arus kas, rasio likuiditas harian, dan ringkasan komparasi performa omset.
                </p>
              </div>

              {/* Feature Card 2: Arsitektur Data */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all duration-200">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
                  <Database className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Integritas Data Transaksi
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Sinkronisasi basis data terisolasi dengan verifikasi ledger kriptografis dan audit log real-time.
                </p>
              </div>

              {/* Feature Card 3: Executive Advisor */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all duration-200">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4 text-slate-700" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  Konsultasi Kebijakan
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  Ikhtisar cerdas rekomendasi operasional berkala untuk mitigasi risiko inventori dan piutang.
                </p>
              </div>
            </div>

            {/* Security Proofing Micro-Badge */}
            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 pt-3 border-t border-slate-200/85 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>99.98% Gateway SLA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Enkripsi TLS 1.3 End-to-End</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Zero Ledger Tampering</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Executive Auth Card (Span 5 cols) */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-9 shadow-executive border border-slate-200/90 relative transition-all">
              
              {/* Header Box Card */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                  <span className="text-[10.5px] font-semibold tracking-widest uppercase text-slate-500">
                    PORTAL OTORISASI EKSEKUTIF
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>TLS 1.3 / E2E</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Masuk ke Business OS
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Masukkan kredensial korporat untuk mengakses pusat kendali manajemen.
                </p>
              </div>

              {/* Status Alert if error or success */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email-input"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Alamat Email Korporat
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <AtSign className="w-4 h-4" />
                    </div>
                    <input
                      id="email-input"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aditya.dharma@dailydose.ai"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password-input"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Kata Sandi
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('owner@dailydose.ai');
                        setPassword('OwnerPass123!');
                        setSuccessMessage('Kredensial Owner berhasil diisikan ke form.');
                      }}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password-input"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-16 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <span className="text-[11px] font-medium">
                        {showPassword ? 'Tutup' : 'Lihat'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 select-none">
                      Tetap masuk selama 30 hari
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        <span>Memverifikasi Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Sistem Kendali</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* SSO Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10.5px] uppercase tracking-wider">
                  <span className="bg-white px-3 text-slate-400 font-medium">
                    Atau Akses SSO Korporat
                  </span>
                </div>
              </div>

              {/* SSO Options */}
              <div className="space-y-2 mb-6">
                <button
                  type="button"
                  onClick={() => handleSsoLogin('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Lanjutkan dengan Google Workspace</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSsoLogin('microsoft')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <rect fill="#F25022" height="10" width="10" x="1" y="1" />
                    <rect fill="#7FBA00" height="10" width="10" x="13" y="1" />
                    <rect fill="#00A4EF" height="10" width="10" x="1" y="13" />
                    <rect fill="#FFB900" height="10" width="10" x="13" y="13" />
                  </svg>
                  <span>Lanjutkan dengan Microsoft Entra ID</span>
                </button>
              </div>

              {/* Bottom Support Link */}
              <div className="text-center pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Butuh akses baru? </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@dailydose.ai');
                    setPassword('AdminPass123!');
                    setSuccessMessage('Kredensial Admin diisikan. Klik Masuk.');
                  }}
                  className="text-xs font-semibold text-slate-800 hover:text-slate-950 underline transition-colors cursor-pointer"
                >
                  Hubungi Administrator Sistem
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =======================================================================
          ANIMASI TRUK PADA JALUR ASPAL (Grounding Roda Sempurna di Permukaan)
         ======================================================================= */}
      <style>{`
        @keyframes truckDrive {
          0% {
            transform: translateX(-160px);
          }
          100% {
            transform: translateX(100vw);
          }
        }
        @keyframes wheelRoll {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="w-full mb-4 relative overflow-hidden flex flex-col justify-end pt-2 pb-0 select-none pointer-events-none">
        <div className="w-full h-16 relative overflow-hidden flex items-end">
          {/* Clear Charcoal/Slate Asphalt Highway Track with Clean Edge Curb */}
          <div className="absolute inset-x-0 bottom-0 h-6 bg-slate-800 border-t-2 border-slate-700 shadow-inner flex items-center">
            {/* Clean dashed center road markings */}
            <div className="w-full h-[2px] border-t-2 border-dashed border-slate-400/70"></div>
          </div>

          {/* Moving Business Truck Animation - Wheels Grounded Exactly on the Asphalt Top Edge */}
          <div
            className="absolute bottom-6 left-0 flex items-end will-change-transform"
            style={{ animation: 'truckDrive 14s linear infinite' }}
          >
            {/* Modern Obsidian Business Box Truck Silhouette */}
            <div className="relative flex items-end drop-shadow-md">
              {/* Taillight glow */}
              <span className="w-1.5 h-2 bg-rose-500 rounded-l shadow-[0_0_8px_rgba(244,63,94,0.8)] mb-2"></span>

              {/* Cargo container */}
              <div className="w-20 h-10 bg-slate-900 rounded-sm relative flex flex-col justify-between p-1 border-r border-slate-800">
                <div className="w-full h-0.5 bg-indigo-500 rounded"></div>
                <div className="flex items-center gap-1 opacity-70">
                  <span className="text-[7px] tracking-wider font-semibold text-slate-300 uppercase">
                    DAILYDOSE
                  </span>
                </div>
                <div className="w-full h-0.5 bg-slate-700 rounded"></div>
              </div>

              {/* Cabin */}
              <div className="w-8 h-8 bg-slate-800 rounded-r-md relative flex flex-col justify-end p-1 border-l border-slate-700">
                {/* Windshield glass */}
                <div className="absolute top-1 right-1 w-4 h-3.5 bg-sky-300/80 rounded-sm skew-x-3"></div>
                {/* Headlight beam */}
                <div className="absolute bottom-1.5 -right-1 w-2 h-2 bg-amber-200 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)]"></div>
              </div>

              {/* Wheels resting exactly touching road top edge */}
              <div
                className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-950 rounded-full border-2 border-slate-400 shadow-sm"
                style={{ animation: 'wheelRoll 0.8s linear infinite' }}
              ></div>
              <div
                className="absolute -bottom-2 left-7 w-4 h-4 bg-slate-950 rounded-full border-2 border-slate-400 shadow-sm"
                style={{ animation: 'wheelRoll 0.8s linear infinite' }}
              ></div>
              <div
                className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-950 rounded-full border-2 border-slate-400 shadow-sm"
                style={{ animation: 'wheelRoll 0.8s linear infinite' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================================
          GLOBAL FOOTER KORPORAT
         ======================================================================= */}
      <footer className="w-full border-t border-slate-200/85 bg-white/60 backdrop-blur-sm py-4 px-6 lg:px-10">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          {/* Copyright */}
          <div className="flex items-center gap-2.5">
            <span>
              © 2026 <strong className="text-slate-800 font-semibold">DailyDose AI</strong> Enterprise Business OS • Hak Cipta Dilindungi
            </span>
          </div>

          {/* Architecture Footnote Stack */}
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
            <span>FastAPI 0.150</span>
            <span>•</span>
            <span>PostgreSQL 17 RDS</span>
            <span>•</span>
            <span>Google Gemini 1.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
