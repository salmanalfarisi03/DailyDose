'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Customer } from '@/types/api';

interface CustomersViewProps {
  customers: Customer[];
  onOpenCreate: () => void;
  onDeleteCustomer: (id: number) => Promise<void>;
  onToggleActive: (id: number, currentStatus: boolean) => Promise<void>;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onOpenCreate,
  onDeleteCustomer,
  onToggleActive,
}) => {
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));

    if (filterActive === 'active') return matchSearch && c.is_active;
    if (filterActive === 'inactive') return matchSearch && !c.is_active;
    return matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      setDeletingId(id);
      try {
        await onDeleteCustomer(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pelanggan berdasarkan nama, email, atau no. telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs transition"
            />
          </div>

          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* Customer Table Card */}
      <div className="luxury-card rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono">
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Nama Pelanggan</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Kontak</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Alamat</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Status</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ID: #{c.id}
                    </div>
                  </td>
                  <td className="py-4 px-6 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{c.email}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 max-w-xs truncate text-slate-500">
                    {c.address ? (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{c.address}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => onToggleActive(c.id, c.is_active)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                        c.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/60'
                      }`}
                    >
                      {c.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Aktif</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Nonaktif</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-40"
                      title="Hapus pelanggan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-14 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">Tidak ada data pelanggan yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? 'Coba ubah kata kunci pencarian Anda' : 'Klik Tambah Pelanggan untuk mulai'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
