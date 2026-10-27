'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  User,
  KeyRound,
  Check,
  LogOut,
  Lock,
  ArrowRight,
  ChevronRight,
  Database,
  UserPlus,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserProfile, UserRole } from '@/types/api';
import { api } from '@/lib/api';

export const PRESET_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Aditya Dharma',
    email: 'owner@dailydose.ai',
    role: 'OWNER',
    title: 'Direktur Utama & Pemilik',
    initials: 'AD',
    avatarColor: 'bg-slate-900 text-white',
  },
  {
    id: '2',
    name: 'Siti Rahma',
    email: 'admin@dailydose.ai',
    role: 'ADMIN',
    title: 'Admin Operasional & Bisnis',
    initials: 'SR',
    avatarColor: 'bg-indigo-600 text-white',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'finance@dailydose.ai',
    role: 'FINANCE',
    title: 'Spesialis Keuangan & Faktur',
    initials: 'BS',
    avatarColor: 'bg-emerald-600 text-white',
  },
];

interface AccountAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AccountAuthModal: React.FC<AccountAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'switcher' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('owner@dailydose.ai');
  const [loginPassword, setLoginPassword] = useState('OwnerPass123!');
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('ADMIN');

  // Loading & Notifications
  const [loading, setLoading] = useState(false);
  const [dbUsers, setDbUsers] = useState<Array<Record<string, unknown>>>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadDbUsers = React.useCallback(async () => {
    setDbLoading(true);
    try {
      const users = await api.getUsers();
      setDbUsers(users);
    } catch {
      // Fallback
      setDbUsers(PRESET_USERS as unknown as Array<Record<string, unknown>>);
    } finally {
      setDbLoading(false);
    }
  }, []);

  // Load database users when modal is opened
  useEffect(() => {
    if (isOpen) {
      loadDbUsers();
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, loadDbUsers]);

  if (!isOpen) return null;

  // Real backend authentication against PostgreSQL
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      // Save token for persistent session
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

      const updatedProfile: UserProfile = {
        id: String(res.user.id),
        name: res.user.full_name,
        email: res.user.email,
        role: role,
        title:
          role === 'OWNER'
            ? 'Direktur Utama & Pemilik'
            : role === 'ADMIN'
            ? 'Admin Operasional & Bisnis'
            : 'Spesialis Keuangan & Faktur',
        initials: initials || 'AD',
        avatarColor:
          role === 'OWNER'
            ? 'bg-slate-900 text-white'
            : role === 'ADMIN'
            ? 'bg-indigo-600 text-white'
            : 'bg-emerald-600 text-white',
      };

      onSelectUser(updatedProfile);
      setSuccessMessage(res.message || `Berhasil login sebagai ${role} (${res.user.full_name})`);

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Gagal melakukan verifikasi akun. Pastikan server backend dan PostgreSQL aktif.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Register new team member to PostgreSQL (Only allowed for Owner)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.register({
        email: regEmail.trim(),
        full_name: regFullName.trim(),
        password: regPassword,
        role: regRole,
      });

      const newUser = res.user;
      setSuccessMessage(`Akun ${newUser.full_name} (${newUser.role}) berhasil disimpan di PostgreSQL!`);
      setRegFullName('');
      setRegEmail('');
      setRegPassword('');
      loadDbUsers();

      setTimeout(() => {
        setActiveTab('switcher');
      }, 900);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan saat pendaftaran');
    } finally {
      setLoading(false);
    }
  };

  // Quick switch autofill and test
  const handleSelectPredefined = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setActiveTab('login');
    setErrorMessage(null);
    setSuccessMessage(`Kredensial untuk ${email} telah disiapkan. Klik Masuk untuk memverifikasi.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Otorisasi Akun &amp; Keamanan
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1 font-mono">
                  <Database className="w-3 h-3" />
                  PostgreSQL Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Akses terproteksi: Hanya akun terdaftar di database yang dapat masuk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Masuk (Login)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('switcher');
              setErrorMessage(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'switcher'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Daftar Akun Database ({dbUsers.length})</span>
          </button>
          {currentUser.role === 'OWNER' && (
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah User Baru</span>
            </button>
          )}
        </div>

        {/* Alerts / Error Feedback */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* TAB 1: FORM LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Akun Terdaftar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Contoh: owner@dailydose.ai atau admin@dailydose.ai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Quick Preset Hint */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-600" />
                  Kredensial Default Terdaftar di PostgreSQL:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectPredefined('owner@dailydose.ai', 'OwnerPass123!')}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 cursor-pointer transition"
                  >
                    Owner (owner@dailydose.ai)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPredefined('admin@dailydose.ai', 'AdminPass123!')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 cursor-pointer transition"
                  >
                    Admin (admin@dailydose.ai)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Memverifikasi ke PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Executive Business OS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: DAFTAR AKUN DATABASE POSTGRESQL */}
          {activeTab === 'switcher' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Tabel &apos;users&apos; di PostgreSQL (dailydose_db):</span>
                {dbLoading && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
              </div>

              <div className="space-y-2">
                {dbUsers.map((u: any) => {
                  const isCurrent = currentUser.email.toLowerCase() === u.email.toLowerCase();
                  return (
                    <div
                      key={u.id}
                      onClick={() =>
                        handleSelectPredefined(
                          u.email,
                          u.role === 'OWNER' ? 'OwnerPass123!' : 'AdminPass123!'
                        )
                      }
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs ${
                            u.role === 'OWNER'
                              ? 'bg-slate-900 text-white'
                              : u.role === 'ADMIN'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {u.full_name
                            ? u.full_name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()
                            : 'US'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                              {u.full_name || u.name}
                            </h4>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                u.role === 'OWNER'
                                  ? 'bg-purple-100 text-purple-700'
                                  : u.role === 'ADMIN'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isCurrent ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-lg shadow-2xs">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 group-hover:text-indigo-600 font-medium flex items-center gap-0.5">
                            <span>Pilih</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Security Policy Reminder */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Kebijakan Keamanan Sistem:
                </span>
                <p className="text-amber-800 leading-relaxed">
                  Semua akun di atas diverifikasi melalui enkripsi kata sandi PBKDF2-HMAC-SHA256 (100.000 putaran) langsung pada PostgreSQL. Pengguna di luar daftar ini tidak diizinkan mengakses data.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER USER BARU (Owner Only) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap Anggota Tim <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Contoh: Rian Anggara"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Perusahaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rian.anggara@dailydose.ai"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Peran (Role)
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                  >
                    <option value="ADMIN">ADMIN (Operasional)</option>
                    <option value="FINANCE">FINANCE (Penagihan)</option>
                    <option value="OWNER">OWNER (Full Hak Akses)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kata Sandi Awal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mendaftarkan ke PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Simpan Akun ke Database</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('dd_token');
                localStorage.removeItem('dd_user');
              }
              onSelectUser({
                id: 'guest',
                name: 'Tamu Tidak Terotentikasi',
                email: 'unauthenticated@dailydose.ai',
                role: 'ADMIN',
                title: 'Akses Dibatasi',
                initials: 'GU',
                avatarColor: 'bg-slate-400 text-white',
              });
              setSuccessMessage('Anda telah keluar. Silakan login kembali.');
              setTimeout(() => {
                setSuccessMessage(null);
                setActiveTab('login');
              }, 600);
            }}
            className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition cursor-pointer shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
