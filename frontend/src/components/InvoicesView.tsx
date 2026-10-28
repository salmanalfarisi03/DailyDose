'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { Customer, Invoice, InvoiceStatus } from '@/types/api';

interface InvoicesViewProps {
  invoices: Invoice[];
  customers: Customer[];
  onOpenCreate: () => void;
  onUpdateStatus: (id: number, status: InvoiceStatus) => Promise<void>;
  onDeleteInvoice: (id: number) => Promise<void>;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  customers,
  onOpenCreate,
  onUpdateStatus,
  onDeleteInvoice,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'ISSUED':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'OVERDUE':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filtered = invoices.filter((inv) => {
    const custName = customerMap.get(inv.customer_id) || '';
    const matchSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      custName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.notes && inv.notes.toLowerCase().includes(search.toLowerCase()));

    if (filterStatus !== 'all') return matchSearch && inv.status === filterStatus;
    return matchSearch;
  });

  const handleStatusChange = async (id: number, status: InvoiceStatus) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) {
      setDeletingId(id);
      try {
        await onDeleteInvoice(id);
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
              placeholder="Cari no. invoice atau pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs transition"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="all">Semua Status</option>
            <option value="DRAFT">Draf (DRAFT)</option>
            <option value="ISSUED">Terbit (ISSUED)</option>
            <option value="PAID">Lunas (PAID)</option>
            <option value="OVERDUE">Jatuh Tempo (OVERDUE)</option>
            <option value="CANCELLED">Dibatalkan (CANCELLED)</option>
          </select>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Invoice Baru</span>
        </button>
      </div>

      {/* Invoice Table Card */}
      <div className="luxury-card rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono">
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Nomor Invoice</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Pelanggan</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Status</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px]">Jatuh Tempo</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px] text-right">Total Tagihan</th>
                <th className="py-4 px-6 font-semibold uppercase text-[10px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {inv.invoice_number}
                    {inv.items && inv.items.length > 0 && (
                      <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                        {inv.items.length} item barang
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {customerMap.get(inv.customer_id) || (
                      <span className="text-slate-400">ID: #{inv.customer_id}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative inline-block">
                      <select
                        value={inv.status}
                        disabled={updatingId === inv.id}
                        onChange={(e) =>
                          handleStatusChange(inv.id, e.target.value as InvoiceStatus)
                        }
                        className={`px-3 py-1 rounded-md text-[10px] font-bold border cursor-pointer focus:outline-none appearance-none pr-6 shadow-2xs ${getStatusBadge(
                          inv.status
                        )}`}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="ISSUED">ISSUED</option>
                        <option value="PAID">PAID</option>
                        <option value="OVERDUE">OVERDUE</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {inv.due_date ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(inv.due_date).toLocaleDateString('id-ID')}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-extrabold text-slate-900 text-sm">
                    {formatCurrency(Number(inv.total_amount))}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={deletingId === inv.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-40"
                      title="Hapus tagihan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-700">Tidak ada data invoice</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik Buat Invoice Baru untuk menerbitkan tagihan pertama.
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
