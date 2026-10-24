'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  Boxes,
} from 'lucide-react';
import { Product } from '@/types/api';

interface ProductsViewProps {
  products: Product[];
  onOpenCreate: () => void;
  onDeleteProduct: (id: number) => Promise<void>;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onOpenCreate,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    if (lowStockOnly) return matchSearch && p.stock <= 5;
    return matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setDeletingId(id);
      try {
        await onDeleteProduct(id);
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
              placeholder="Cari produk berdasarkan SKU, nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs transition"
            />
          </div>

          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
              lowStockOnly
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Stok Rendah (&le;5)</span>
          </button>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const isLowStock = p.stock <= 5;
          return (
            <div
              key={p.id}
              className="luxury-card luxury-card-hover rounded-3xl p-6 space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-[11px] text-indigo-700 font-bold">
                      {p.sku}
                    </span>
                    {isLowStock && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Stok Rendah
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100 disabled:opacity-40"
                    title="Hapus produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {p.description || 'Tidak ada deskripsi'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                    HARGA JUAL
                  </div>
                  <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                    {formatCurrency(Number(p.price))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
                    SISA STOK
                  </div>
                  <div
                    className={`text-sm font-bold font-mono mt-0.5 ${
                      isLowStock ? 'text-rose-600 font-extrabold' : 'text-emerald-600'
                    }`}
                  >
                    {p.stock} unit
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 luxury-card rounded-3xl">
            <Boxes className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada produk ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              Tambahkan produk katalog Anda atau ubah filter pencarian.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
