'use client';

import React from 'react';
import {
  X,
  FileText,
  Printer,
  CheckCircle2,
  Calendar,
  User,
  CreditCard,
  Building,
} from 'lucide-react';
import { Customer, Invoice } from '@/types/api';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  customer?: Customer;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  invoice,
  customer,
}) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ISSUED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'OVERDUE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  {invoice.invoice_number}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Faktur resmi transaksi Enterprise Business OS
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

        {/* Invoice Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Ditagihkan Kepada:</span>
              <p className="font-bold text-slate-900 mt-1">
                {customer?.name || `Customer ID #${invoice.customer_id}`}
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                {customer?.email || 'N/A'} • {customer?.phone || '-'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium">Tanggal Diterbitkan:</span>
              <p className="font-bold text-slate-900 mt-1">
                {new Date(invoice.issue_date || invoice.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              {invoice.due_date && (
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Jatuh Tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID')}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Rincian Item Pembelian
            </h4>
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5">Deskripsi Produk</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Harga Satuan</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {item.description}
                        </td>
                        <td className="px-3 py-3 text-center text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-3 text-right text-slate-600">
                          {formatCurrency(Number(item.unit_price))}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {formatCurrency(Number(item.total_price))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-slate-400">
                        Rincian item tidak tersedia.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(Number(invoice.subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Pajak (PPN):</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(Number(invoice.tax_amount))}
              </span>
            </div>
            {Number(invoice.discount_amount) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon Khusus:</span>
                <span className="font-semibold">
                  -{formatCurrency(Number(invoice.discount_amount))}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Tagihan:</span>
              <span className="text-base text-indigo-600">
                {formatCurrency(Number(invoice.total_amount))}
              </span>
            </div>
          </div>

          {invoice.notes && (
            <div className="text-xs text-slate-500 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700">Catatan: </span>
              {invoice.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Faktur (Print)</span>
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
