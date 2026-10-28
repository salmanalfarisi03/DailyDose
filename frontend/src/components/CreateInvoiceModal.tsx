'use client';

import React, { useState } from 'react';
import { X, Receipt, Plus, Trash2, Loader2 } from 'lucide-react';
import { Customer, InvoiceCreate, Product } from '@/types/api';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  onSubmit: (data: InvoiceCreate) => Promise<void>;
}

interface ItemRow {
  product_id: number;
  description: string;
  quantity: number;
  unit_price: number;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  customers,
  products,
  onSubmit,
}) => {
  const [customerId, setCustomerId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [taxAmount, setTaxAmount] = useState('0');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const addItemRow = () => {
    if (products.length === 0) return;
    const defaultProduct = products[0];
    setItems((prev) => [
      ...prev,
      {
        product_id: defaultProduct.id,
        description: defaultProduct.name,
        quantity: 1,
        unit_price: Number(defaultProduct.price),
      },
    ]);
  };

  const removeItemRow = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItemProduct = (idx: number, productId: number) => {
    const prod = products.find((p) => p.id === productId);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            product_id: productId,
            description: prod ? prod.name : item.description,
            unit_price: prod ? Number(prod.price) : item.unit_price,
          };
        }
        return item;
      })
    );
  };

  const updateItemQty = (idx: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const updateItemPrice = (idx: number, price: number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, unit_price: Math.max(0, price) } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const tax = parseFloat(taxAmount) || 0;
  const discount = parseFloat(discountAmount) || 0;
  const total = Math.max(0, subtotal + tax - discount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError('Pilih pelanggan terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        customer_id: parseInt(customerId, 10),
        invoice_number: invoiceNumber.trim() || undefined,
        due_date: dueDate ? `${dueDate}T00:00:00Z` : undefined,
        tax_amount: tax,
        discount_amount: discount,
        notes: notes.trim() || undefined,
        items: items.map((it) => ({
          product_id: it.product_id,
          description: it.description || 'Item tagihan',
          quantity: it.quantity,
          unit_price: it.unit_price,
        })),
      });

      setCustomerId('');
      setInvoiceNumber('');
      setDueDate('');
      setNotes('');
      setTaxAmount('0');
      setDiscountAmount('0');
      setItems([]);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal membuat invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-150 shadow-2xl p-7 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Buat Tagihan (Invoice) Baru</h3>
              <p className="text-xs text-slate-400">Penerbitan faktur pembayaran digital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Klien / Pelanggan <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="">Pilih Klien B2B...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Invoice (Opsional)
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Otomatis jika kosong (cth: INV-2026-001)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tenggat Jatuh Tempo
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pajak PPN (IDR)
              </label>
              <input
                type="number"
                min="0"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Diskon Penjualan (IDR)
              </label>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Item Barang / Jasa
              </label>
              <button
                type="button"
                onClick={addItemRow}
                disabled={products.length === 0}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris</span>
              </button>
            </div>

            {items.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <select
                  value={row.product_id}
                  onChange={(e) => updateItemProduct(idx, parseInt(e.target.value, 10))}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>

                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => updateItemQty(idx, parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-center font-mono font-bold"
                    title="Jumlah Kuantitas"
                  />
                </div>

                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    value={row.unit_price}
                    onChange={(e) => updateItemPrice(idx, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-right font-mono"
                    title="Harga Satuan"
                  />
                </div>

                <div className="w-28 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(row.quantity * row.unit_price)}
                </div>

                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">
                Belum ada item ditambahkan. Klik &apos;Tambah Baris&apos; untuk memilih produk.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Catatan / Instruksi Pembayaran
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi transfer rekening BCA/Mandiri, termin pembayaran..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Total summary bar */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5 text-xs text-slate-500">
              <div>Subtotal: <span className="font-mono font-bold text-slate-800">{formatCurrency(subtotal)}</span></div>
              <div>Pajak: <span className="font-mono text-slate-700">+{formatCurrency(tax)}</span> | Diskon: <span className="font-mono text-slate-700">-{formatCurrency(discount)}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                TOTAL PEMBAYARAN
              </div>
              <div className="text-xl font-extrabold font-mono text-emerald-600 mt-0.5">
                {formatCurrency(total)}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Terbitkan Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
