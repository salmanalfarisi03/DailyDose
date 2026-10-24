'use client';

import React, { useState } from 'react';
import { X, Package, Loader2 } from 'lucide-react';
import { ProductCreate } from '@/types/api';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreate) => Promise<void>;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || !price) {
      setError('SKU, Nama, dan Harga wajib diisi');
      return;
    }

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock, 10);

    if (isNaN(numericPrice) || numericPrice < 0) {
      setError('Harga harus berupa angka positif');
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      setError('Stok harus berupa angka bulat non-negatif');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || null,
        price: numericPrice,
        stock: numericStock,
        is_active: true,
      });
      setSku('');
      setName('');
      setDescription('');
      setPrice('');
      setStock('10');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-150 shadow-2xl p-7 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Tambah Produk Baru</h3>
              <p className="text-xs text-slate-400">Inventori &amp; katalog penjualan</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="PROD-001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 uppercase font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Stok Awal <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Produk / Layanan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Paket Konsultasi AI Enterprise"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Harga Satuan (IDR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="1000"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1850000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spesifikasi atau cakupan fitur..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
            />
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
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Produk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
