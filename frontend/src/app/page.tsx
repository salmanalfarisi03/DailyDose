'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Customer,
  Product,
  Invoice,
  Task,
  HealthResponse,
  InvoiceStatus,
  CustomerCreate,
  ProductCreate,
  InvoiceCreate,
  TaskCreate,
  TaskStatus,
  UserProfile,
} from '@/types/api';
import { ActiveTab, Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { DashboardView } from '@/components/DashboardView';
import { CustomersView } from '@/components/CustomersView';
import { ProductsView } from '@/components/ProductsView';
import { InvoicesView } from '@/components/InvoicesView';
import { TasksView } from '@/components/TasksView';
import { AiAssistantView } from '@/components/AiAssistantView';
import { CreateCustomerModal } from '@/components/CreateCustomerModal';
import { CreateProductModal } from '@/components/CreateProductModal';
import { CreateInvoiceModal } from '@/components/CreateInvoiceModal';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { AccountAuthModal, PRESET_USERS } from '@/components/AccountAuthModal';
import { SystemDiagnosticsModal } from '@/components/SystemDiagnosticsModal';
import { AnalyticsDeepDiveModal } from '@/components/AnalyticsDeepDiveModal';
import { LandingLoginView } from '@/components/LandingLoginView';
import { ExecutivePerformanceDashboard } from '@/components/ExecutivePerformanceDashboard';
import { CampaignsView } from '@/components/CampaignsView';
import { LeadsView } from '@/components/LeadsView';
import { AudiencesView } from '@/components/AudiencesView';
import { ReportsView } from '@/components/ReportsView';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Business Data States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [healthLoading, setHealthLoading] = useState(true);
  const [seedingLoading, setSeedingLoading] = useState(false);

  // Modals
  const [modalCustomer, setModalCustomer] = useState(false);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalInvoice, setModalInvoice] = useState(false);
  const [modalTask, setModalTask] = useState(false);
  const [modalAccountAuth, setModalAccountAuth] = useState(false);
  const [modalDiagnostics, setModalDiagnostics] = useState(false);
  const [modalDeepDive, setModalDeepDive] = useState(false);

  // User Profile & Role State (Defaults to Owner)
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[0]);

  // Dark Mode State with LocalStorage Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dd_theme');
      if (savedTheme) return savedTheme === 'dark';
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dd_theme', next ? 'dark' : 'light');
      }
      return next;
    });
  };

  // Fetch Health Status
  const fetchHealth = useCallback(async () => {
    try {
      const res = await api.getHealth();
      setHealth(res);
    } catch {
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  // Fetch All Business Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [custRes, prodRes, invRes, taskRes] = await Promise.allSettled([
        api.getCustomers({ page_size: 100 }),
        api.getProducts({ page_size: 100 }),
        api.getInvoices({ page_size: 100 }),
        api.getTasks({ page_size: 100 }),
      ]);

      if (custRes.status === 'fulfilled') setCustomers(custRes.value.items || []);
      if (prodRes.status === 'fulfilled') setProducts(prodRes.value.items || []);
      if (invRes.status === 'fulfilled') setInvoices(invRes.value.items || []);
      if (taskRes.status === 'fulfilled') setTasks(taskRes.value.items || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Restore authenticated session from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dd_user');
      const savedToken = localStorage.getItem('dd_token');

      if (savedUser && savedToken) {
        try {
          const parsed = JSON.parse(savedUser);
          const role = parsed.role || 'OWNER';
          const initials = parsed.full_name
            ? parsed.full_name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            : 'AD';

          setCurrentUser({
            id: String(parsed.id),
            name: parsed.full_name,
            email: parsed.email,
            role: role,
            title:
              role === 'OWNER'
                ? 'Direktur Utama & Pemilik'
                : role === 'ADMIN'
                ? 'Admin Operasional & Bisnis'
                : 'Spesialis Keuangan & Faktur',
            initials: initials,
            avatarColor:
              role === 'OWNER'
                ? 'bg-slate-900 text-white'
                : role === 'ADMIN'
                ? 'bg-indigo-600 text-white'
                : 'bg-emerald-600 text-white',
          });
          setIsAuthenticated(true);
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dd_token');
      localStorage.removeItem('dd_user');
    }
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetchHealth();
    fetchData();

    // Auto health check polling every 15s
    const timer = setInterval(() => {
      fetchHealth();
    }, 15000);

    return () => clearInterval(timer);
  }, [fetchHealth, fetchData]);

  // Seed sample demonstration data
  const handleSeedDemoData = async () => {
    setSeedingLoading(true);
    try {
      // Refresh current records first to prevent duplicates
      const currentCust = (await api.getCustomers({ page_size: 100 })).items;
      const currentProd = (await api.getProducts({ page_size: 100 })).items;

      // 1. Ensure Sample Customers exist
      let c1 = currentCust.find((c) => c.email === 'finance@nusantaradigital.co.id');
      if (!c1) {
        c1 = await api.createCustomer({
          name: 'PT Nusantara Digital Solusi',
          email: 'finance@nusantaradigital.co.id',
          phone: '+62 811 9876 5432',
          address: 'Sudirman Central Business District (SCBD) Lot 9, Jakarta',
          is_active: true,
        });
      }

      let c2 = currentCust.find((c) => c.email === 'kontak@berkahmandiri.com');
      if (!c2) {
        c2 = await api.createCustomer({
          name: 'CV Berkah Mandiri Abadi',
          email: 'kontak@berkahmandiri.com',
          phone: '+62 812 5555 4321',
          address: 'Jl. Riau No. 88, Bandung',
          is_active: true,
        });
      }

      // 2. Ensure Sample Products exist
      let p1 = currentProd.find((p) => p.sku === 'SRV-CLOUD-01');
      if (!p1) {
        p1 = await api.createProduct({
          sku: 'SRV-CLOUD-01',
          name: 'Langganan Cloud Server Enterprise',
          description: 'Server private cloud dengan 16 vCPU, 32GB RAM, dan backup harian.',
          price: 3500000,
          stock: 50,
          is_active: true,
        });
      }

      let p2 = currentProd.find((p) => p.sku === 'SRV-AI-API');
      if (!p2) {
        p2 = await api.createProduct({
          sku: 'SRV-AI-API',
          name: 'Paket API AI Business Assistant',
          description: 'Kuota 1.000.000 token AI untuk analitik dokumen dan operasional bisnis.',
          price: 1850000,
          stock: 100,
          is_active: true,
        });
      }

      let p3 = currentProd.find((p) => p.sku === 'HDW-ROUTER-5G');
      if (!p3) {
        p3 = await api.createProduct({
          sku: 'HDW-ROUTER-5G',
          name: 'Industrial 5G Gateway Router',
          description: 'Perangkat router enterprise berkecepatan tinggi dengan failover multi-WAN.',
          price: 4750000,
          stock: 3, // Low stock alert demo
          is_active: true,
        });
      }

      // 3. Create Sample Invoices if none exist
      const currentInvoices = (await api.getInvoices({ page_size: 10 })).items;
      if (currentInvoices.length === 0) {
        const inv1Number = `INV-${Date.now().toString().slice(-4)}-001`;
        await api.createInvoice({
          customer_id: c1.id,
          invoice_number: inv1Number,
          tax_amount: 385000,
          discount_amount: 0,
          notes: 'Pembayaran termin 1 via transfer Mandiri.',
          items: [
            {
              product_id: p1.id,
              description: p1.name,
              quantity: 1,
              unit_price: 3500000,
            },
          ],
        });

        const inv2Number = `INV-${Date.now().toString().slice(-4)}-002`;
        const inv2 = await api.createInvoice({
          customer_id: c2.id,
          invoice_number: inv2Number,
          tax_amount: 203500,
          discount_amount: 50000,
          notes: 'Faktur tagihan layanan API AI bulanan.',
          items: [
            {
              product_id: p2.id,
              description: p2.name,
              quantity: 1,
              unit_price: 1850000,
            },
          ],
        });
        // Mark inv2 as PAID for total revenue KPI
        await api.updateInvoiceStatus(inv2.id, 'PAID');
      }

      // 4. Create Sample Tasks if none exist
      const currentTasks = (await api.getTasks({ page_size: 10 })).items;
      if (currentTasks.length === 0) {
        await api.createTask({
          title: 'Kirim kontrak perpanjangan tahunan ke PT Nusantara Digital',
          description: 'Siapkan draft SLA terbaru dan kirim via email legal.',
          priority: 'HIGH',
          status: 'PENDING',
          customer_id: c1.id,
        });

        await api.createTask({
          title: 'Restock unit Industrial 5G Gateway Router',
          description: 'Sisa stok tinggal 3 unit di gudang, segera kontak distributor pusat.',
          priority: 'URGENT',
          status: 'IN_PROGRESS',
        });

        await api.createTask({
          title: 'Review laporan keuangan kuartal pertama',
          description: 'Periksa seluruh rekonsiliasi invoice dan pembayaran masuk.',
          priority: 'MEDIUM',
          status: 'PENDING',
        });
      }

      // Refresh all views
      await fetchData();
    } catch (err: unknown) {
      console.error('Failed to seed demo data:', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal membuat data demo: ${msg}`);
    } finally {
      setSeedingLoading(false);
    }
  };

  // CRUD Handlers
  const handleCreateCustomer = async (data: CustomerCreate) => {
    await api.createCustomer(data);
    await fetchData();
  };

  const handleDeleteCustomer = async (id: number) => {
    await api.deleteCustomer(id);
    await fetchData();
  };

  const handleToggleCustomerActive = async (id: number, current: boolean) => {
    await api.updateCustomer(id, { is_active: !current });
    await fetchData();
  };

  const handleCreateProduct = async (data: ProductCreate) => {
    await api.createProduct(data);
    await fetchData();
  };

  const handleDeleteProduct = async (id: number) => {
    await api.deleteProduct(id);
    await fetchData();
  };

  const handleCreateInvoice = async (data: InvoiceCreate) => {
    await api.createInvoice(data);
    await fetchData();
  };

  const handleUpdateInvoiceStatus = async (id: number, status: InvoiceStatus) => {
    await api.updateInvoiceStatus(id, status);
    await fetchData();
  };

  const handleDeleteInvoice = async (id: number) => {
    await api.deleteInvoice(id);
    await fetchData();
  };

  const handleCreateTask = async (data: TaskCreate) => {
    await api.createTask(data);
    await fetchData();
  };

  const handleUpdateTaskStatus = async (id: number, status: TaskStatus) => {
    await api.updateTask(id, { status });
    await fetchData();
  };

  const handleDeleteTask = async (id: number) => {
    await api.deleteTask(id);
    await fetchData();
  };

  const handleQuickAction = (action: 'customer' | 'product' | 'invoice' | 'task') => {
    switch (action) {
      case 'customer':
        setModalCustomer(true);
        break;
      case 'product':
        setModalProduct(true);
        break;
      case 'invoice':
        setModalInvoice(true);
        break;
      case 'task':
        setModalTask(true);
        break;
    }
  };

  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse icon-3d">
            <span className="text-xl font-black">D</span>
          </div>
          <p className="text-xs font-mono font-medium text-slate-400">
            DailyDose  • Memeriksa Otorisasi Sesi...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div
      className={`min-h-screen flex ${
        isDarkMode ? 'bg-[#151722] text-zinc-100' : 'bg-[#faf8f5] text-slate-900'
      } antialiased font-sans selection:bg-slate-900 selection:text-white`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAccountModal={() => setModalAccountAuth(true)}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${isDarkMode ? 'bg-[#151722]' : 'bg-[#faf8f5]'}`}>
        {activeTab === 'dashboard' ? (
          <ExecutivePerformanceDashboard
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onPlanCampaign={() => handleQuickAction('task')}
            onOpenLeads={() => setActiveTab('leads')}
            onOpenCampaigns={() => setActiveTab('campaigns')}
            onOpenAnalytics={() => setActiveTab('analytics')}
          />
        ) : (
          <>
            <Navbar
              activeTab={activeTab}
              onRefresh={fetchData}
              loading={loading}
              onQuickAction={handleQuickAction}
              currentUser={currentUser}
              onOpenAccountModal={() => setModalAccountAuth(true)}
              onOpenDiagnosticsModal={() => setModalDiagnostics(true)}
            />

            <main className="p-8 max-w-[1536px] w-full mx-auto flex-1">
              {activeTab === 'campaigns' && (
                <CampaignsView onPlanCampaign={() => handleQuickAction('task')} />
              )}

              {activeTab === 'leads' && <LeadsView />}

              {activeTab === 'audiences' && <AudiencesView />}

              {activeTab === 'reports' && <ReportsView invoices={invoices} />}

              {activeTab === 'customers' && (
                <CustomersView
                  customers={customers}
                  onOpenCreate={() => setModalCustomer(true)}
                  onDeleteCustomer={handleDeleteCustomer}
                  onToggleActive={handleToggleCustomerActive}
                />
              )}

              {activeTab === 'products' && (
                <ProductsView
                  products={products}
                  onOpenCreate={() => setModalProduct(true)}
                  onDeleteProduct={handleDeleteProduct}
                />
              )}

              {activeTab === 'invoices' && (
                <InvoicesView
                  invoices={invoices}
                  customers={customers}
                  onOpenCreate={() => setModalInvoice(true)}
                  onUpdateStatus={handleUpdateInvoiceStatus}
                  onDeleteInvoice={handleDeleteInvoice}
                />
              )}

              {activeTab === 'tasks' && (
                <TasksView
                  tasks={tasks}
                  customers={customers}
                  onOpenCreate={() => setModalTask(true)}
                  onUpdateStatus={handleUpdateTaskStatus}
                  onDeleteTask={handleDeleteTask}
                />
              )}

              {activeTab === 'analytics' && (
                <DashboardView
                  customers={customers}
                  products={products}
                  invoices={invoices}
                  tasks={tasks}
                  onNavigate={setActiveTab}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onSeedSampleData={handleSeedDemoData}
                  seedingLoading={seedingLoading}
                  onOpenDeepDiveModal={() => setModalDeepDive(true)}
                  onOpenDiagnosticsModal={() => setModalDiagnostics(true)}
                />
              )}

              {activeTab === 'ai' && (
                <AiAssistantView
                  customers={customers}
                  products={products}
                  invoices={invoices}
                  tasks={tasks}
                />
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Pengaturan Ruang Kerja
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Konfigurasi identitas perusahaan, otorisasi peran, dan integrasi API
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => setModalAccountAuth(true)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-900">
                          Manajemen Akun &amp; Tim Eksekutif
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Kelola akun peran (Direktur Utama, Admin, Keuangan) tersimpan di PostgreSQL
                        </div>
                      </div>
                      <span className="text-xs text-indigo-600 font-semibold">Buka →</span>
                    </button>
                    <button
                      onClick={() => setModalDiagnostics(true)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-xs text-slate-900">
                          Diagnostik Infrastruktur &amp; Cloud Database
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Periksa status latency FastAPI, koneksi Neon PostgreSQL, dan telemetry
                        </div>
                      </div>
                      <span className="text-xs text-indigo-600 font-semibold">Buka →</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-4">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Pusat Bantuan &amp; Dokumentasi
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Selamat datang di DailyDose  — Sistem Operasi Bisnis Eksekutif. Untuk melihat
                    arsitektur lengkap, silakan lihat file <code>BLUEPRINT.md</code> dan{' '}
                    <code>README.md</code> pada workspace Anda.
                  </p>
                  <button
                    onClick={() => setModalDiagnostics(true)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Buka Diagnostik Sistem
                  </button>
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateCustomerModal
        isOpen={modalCustomer}
        onClose={() => setModalCustomer(false)}
        onSubmit={handleCreateCustomer}
      />

      <CreateProductModal
        isOpen={modalProduct}
        onClose={() => setModalProduct(false)}
        onSubmit={handleCreateProduct}
      />

      <CreateInvoiceModal
        isOpen={modalInvoice}
        onClose={() => setModalInvoice(false)}
        customers={customers}
        products={products}
        onSubmit={handleCreateInvoice}
      />

      <CreateTaskModal
        isOpen={modalTask}
        onClose={() => setModalTask(false)}
        customers={customers}
        onSubmit={handleCreateTask}
      />

      {/* Account & Role Authentication Modal */}
      <AccountAuthModal
        isOpen={modalAccountAuth}
        onClose={() => setModalAccountAuth(false)}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
      />

      {/* System & Database Diagnostics Modal */}
      <SystemDiagnosticsModal
        isOpen={modalDiagnostics}
        onClose={() => setModalDiagnostics(false)}
        health={health}
        onRefreshHealth={fetchHealth}
        loading={healthLoading}
      />

      {/* Financial & Analytics Deep-dive Modal */}
      <AnalyticsDeepDiveModal
        isOpen={modalDeepDive}
        onClose={() => setModalDeepDive(false)}
        totalRevenue={invoices
          .filter((i) => i.status === 'PAID')
          .reduce((sum, i) => sum + Number(i.total_amount), 0)}
      />
    </div>
  );
}
