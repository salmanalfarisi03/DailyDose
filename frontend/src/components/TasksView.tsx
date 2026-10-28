'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Customer, Task, TaskPriority, TaskStatus } from '@/types/api';

interface TasksViewProps {
  tasks: Task[];
  customers: Customer[];
  onOpenCreate: () => void;
  onUpdateStatus: (id: number, status: TaskStatus) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  customers,
  onOpenCreate,
  onUpdateStatus,
  onDeleteTask,
}) => {
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  const filtered = tasks.filter((t) => {
    const custName = t.customer_id ? customerMap.get(t.customer_id) || '' : '';
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
      custName.toLowerCase().includes(search.toLowerCase());

    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return matchSearch;
  });

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      setDeletingId(id);
      try {
        await onDeleteTask(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const columns: { id: TaskStatus; label: string; color: string; badge: string }[] = [
    {
      id: 'PENDING',
      label: 'Belum Dimulai',
      color: 'border-amber-200 bg-amber-50/50',
      badge: 'text-amber-800 bg-amber-100/70',
    },
    {
      id: 'IN_PROGRESS',
      label: 'Sedang Dikerjakan',
      color: 'border-blue-200 bg-blue-50/40',
      badge: 'text-blue-800 bg-blue-100/70',
    },
    {
      id: 'COMPLETED',
      label: 'Selesai',
      color: 'border-emerald-200 bg-emerald-50/40',
      badge: 'text-emerald-800 bg-emerald-100/70',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tugas berdasarkan judul atau pelanggan terkait..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs transition"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium focus:outline-none focus:border-indigo-500 shadow-2xs"
          >
            <option value="all">Semua Prioritas</option>
            <option value="LOW">Rendah (LOW)</option>
            <option value="MEDIUM">Sedang (MEDIUM)</option>
            <option value="HIGH">Tinggi (HIGH)</option>
            <option value="URGENT">Mendesak (URGENT)</option>
          </select>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tugas Baru</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`rounded-3xl border ${col.color} p-4.5 space-y-4 flex flex-col min-h-[500px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${col.badge}`}>
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((t) => {
                  const custName = t.customer_id ? customerMap.get(t.customer_id) : null;
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs transition space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            t.priority === 'URGENT' || t.priority === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : t.priority === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.priority}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={deletingId === t.id}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-snug">
                          {t.title}
                        </h4>
                        {t.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                            {t.description}
                          </p>
                        )}
                      </div>

                      {custName && (
                        <div className="text-[11px] text-blue-600 font-semibold truncate">
                          Pelanggan: {custName}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        {t.due_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(t.due_date).toLocaleDateString('id-ID')}</span>
                          </div>
                        ) : (
                          <span>Tanpa tenggat</span>
                        )}

                        {/* Status switcher button */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'PENDING' && (
                            <button
                              onClick={() => onUpdateStatus(t.id, 'PENDING')}
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
                              title="Pindahkan ke Pending"
                            >
                              &larr; Pending
                            </button>
                          )}
                          {col.id !== 'IN_PROGRESS' && (
                            <button
                              onClick={() => onUpdateStatus(t.id, 'IN_PROGRESS')}
                              className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition cursor-pointer"
                              title="Pindahkan ke Sedang Dikerjakan"
                            >
                              Progress
                            </button>
                          )}
                          {col.id !== 'COMPLETED' && (
                            <button
                              onClick={() => onUpdateStatus(t.id, 'COMPLETED')}
                              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition cursor-pointer"
                              title="Tandai Selesai"
                            >
                              Done &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada tugas dalam kolom ini
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
