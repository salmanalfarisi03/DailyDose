'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Zap,
  Settings,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { Customer, Invoice, Product, Task } from '@/types/api';
import { api } from '@/lib/api';

interface AiAssistantViewProps {
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  tasks: Task[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
  isLiveLlm?: boolean;
  suggestions?: string[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  customers,
  products,
  invoices,
  tasks,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Halo Pak Aditya! Saya adalah **DailyDose AI Executive Advisor**.\n\nSaya terhubung langsung ke basis data PostgreSQL Enterprise Anda. Anda dapat menanyakan analisis performa penjualan, audit piutang/invoice, ketersediaan inventori, atau rekomendasi eksekusi tugas harian.\n\n💡 *Tip: Hubungkan API Key Google Gemini (100% Gratis) melalui tombol "Pengaturan LLM API" di atas untuk penalaran bisnis tanpa batas!*',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      provider: 'DailyDose AI Enterprise Advisor',
      isLiveLlm: false,
      suggestions: [
        'Bagaimana kondisi keuangan dan invoice saat ini?',
        'Audit stok produk yang menipis (≤ 5)',
        'Bagaimana cara mendapatkan Google Gemini API Key gratis?',
        'Rangkum akun klien dan retensi bisnis',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'groq' | 'openai'>('gemini');
  const [keySavedStatus, setKeySavedStatus] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [backendConfigured, setBackendConfigured] = useState(false);
  const [activeProviderName, setActiveProviderName] = useState('GEMINI');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved API key from localStorage and check backend status
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('dailydose_ai_api_key');
      const savedProvider = localStorage.getItem('dailydose_ai_provider') as 'gemini' | 'groq' | 'openai';
      if (savedKey) setApiKey(savedKey);
      if (savedProvider) setProvider(savedProvider);
    } catch {
      // localStorage may fail in private mode
    }

    api.getAiStatus()
      .then((res) => {
        if (res.configured_in_env) {
          setBackendConfigured(true);
          if (res.active_providers.length > 0) {
            setActiveProviderName(res.default_provider.toUpperCase());
          }
        }
      })
      .catch(() => {});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSaveConfig = () => {
    try {
      if (apiKey.trim()) {
        localStorage.setItem('dailydose_ai_api_key', apiKey.trim());
      } else {
        localStorage.removeItem('dailydose_ai_api_key');
      }
      localStorage.setItem('dailydose_ai_provider', provider);
      setKeySavedStatus(true);
      setTimeout(() => {
        setKeySavedStatus(false);
        setShowConfigModal(false);
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async (customText?: string) => {
    const userText = (customText || input).trim();
    if (!userText || isTyping) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsTyping(true);

    try {
      // Call real backend LLM API
      const historyPayload = messages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      }));

      const res = await api.chatAi({
        message: userText,
        history: historyPayload,
        api_key: apiKey.trim() || undefined,
        provider: provider,
      });

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        provider: res.provider_used,
        isLiveLlm: res.is_live_llm,
        suggestions: res.suggestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat failed:', err);
      // Friendly fallback message
      const fallbackMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: `⚠️ Maaf, terjadi kendala saat menghubungi layanan AI.\n\nNamun data PostgreSQL lokal Anda tetap aman dan berjalan normal.\n\n*Rekomendasi:* Periksa koneksi backend atau konfigurasi API Key Google Gemini Anda di menu pengaturan.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        provider: 'System Recovery Mode',
        isLiveLlm: false,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const activeSuggestions = messages[messages.length - 1]?.suggestions || [
    'Berapa total realisasi pendapatan dan invoice lunas?',
    'Cek status stok produk yang menipis (≤ 5)',
    'Rangkum akun klien dan retensi bisnis',
    'Tampilkan progres tugas prioritas operasional',
  ];

  return (
    <div className="luxury-card rounded-3xl flex flex-col h-[740px] shadow-xs overflow-hidden animate-in fade-in duration-300 relative">
      {/* Top Banner with 3D Executive Header & API Key Settings */}
      <div className="p-4.5 px-7 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl icon-3d icon-3d-indigo flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              DailyDose AI Executive Advisor
              {(apiKey.trim() || backendConfigured) ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 badge-3d flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live LLM Connected ({apiKey.trim() ? provider.toUpperCase() : activeProviderName})
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 badge-3d flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  PostgreSQL Engine
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Konsultasi kecerdasan bisnis real-time tersinkronisasi database PostgreSQL
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition shadow-2xs cursor-pointer group"
            title="Konfigurasi API Key Google Gemini / Groq"
          >
            <Key className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
            <span>{apiKey.trim() ? '⚙️ Pengaturan LLM' : '🔑 Hubungkan API Key Gratis'}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Live DB Context</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xs ${
                  isUser
                    ? 'bg-slate-900 shadow-sm icon-3d'
                    : 'icon-3d icon-3d-indigo text-indigo-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-5 h-5 text-indigo-700" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-3xl p-5 text-xs leading-relaxed space-y-2 relative group ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-sm shadow-xs'
                    : 'bg-slate-50/90 border border-slate-150 text-slate-800 rounded-tl-sm shadow-2xs'
                }`}
              >
                {/* Assistant Provider Tag */}
                {!isUser && msg.provider && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-indigo-500" />
                      {msg.provider}
                    </span>
                    <button
                      onClick={() => handleCopyMessage(msg.text, idx)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
                      title="Salin jawaban"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Formatted Markdown Content */}
                <div className="whitespace-pre-line font-medium leading-relaxed">
                  {msg.text}
                </div>

                {/* Timestamp */}
                <div
                  className={`text-[10px] text-right font-mono pt-1 ${
                    isUser ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3.5 animate-in fade-in">
            <div className="w-9 h-9 rounded-2xl icon-3d icon-3d-indigo flex items-center justify-center text-indigo-700">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-xs text-slate-600 flex items-center gap-2.5 shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <span className="font-medium">
                {apiKey.trim()
                  ? `DailyDose AI sedang menganalisis dengan ${provider === 'gemini' ? 'Google Gemini 2.0 Flash' : provider}...`
                  : 'DailyDose AI sedang mengevaluasi basis data PostgreSQL...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Suggestions Prompt Bar */}
      <div className="px-6 py-2.5 bg-slate-50/70 border-t border-slate-100 overflow-x-auto flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap flex items-center gap-1 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Rekomendasi Lanjutan:
        </span>
        {activeSuggestions.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(promptText)}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50/70 border border-slate-200/90 hover:border-indigo-200 text-[11px] text-slate-700 hover:text-indigo-700 whitespace-nowrap transition cursor-pointer shadow-2xs font-medium"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan analisis finansial, invoice outstanding, audit stok barang, atau rekomendasi eksekutif..."
            className="flex-1 px-4.5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-2xs font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 py-3.5 rounded-2xl btn-3d-primary text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Kirim</span>
          </button>
        </form>
      </div>

      {/* =======================================================================
          MODAL PENGATURAN LLM API & PANDUAN MENCARI API GRATIS
         ======================================================================= */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="luxury-card w-full max-w-lg rounded-3xl p-7 bg-white shadow-2xl border border-slate-200 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl icon-3d icon-3d-indigo flex items-center justify-center">
                  <Key className="w-5 h-5 text-indigo-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Konfigurasi LLM API Provider
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hubungkan model AI generasi terbaru ke DailyDose OS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Pilih Provider AI:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvider('gemini')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    provider === 'gemini'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-2xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Google Gemini</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      100% GRATIS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Gemini 2.0 / 1.5 Flash (Sangat Cerdas)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('groq')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                    provider === 'groq'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-2xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Groq Cloud</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      GRATIS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Llama 3.3 70B (Kecepatan Kilat)</p>
                </button>
              </div>
            </div>

            {/* Panduan Cara Mendapatkan API Key Gratis */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Cara Mendapatkan API Key Gratis:
                </span>
                {provider === 'gemini' ? (
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs"
                  >
                    Buka Google AI Studio <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs"
                  >
                    Buka Groq Console <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {provider === 'gemini' ? (
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                  <li>Buka <strong>Google AI Studio</strong> (login dengan akun Google biasa Anda).</li>
                  <li>Klik tombol <strong>&quot;Create API key&quot;</strong> (tidak perlu kartu kredit).</li>
                  <li>Salin API key berawalan <code>AIzaSy...</code> dan tempelkan pada kolom di bawah ini.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                  <li>Buka <strong>Groq Console</strong> dan daftar gratis.</li>
                  <li>Buka menu <strong>API Keys</strong> dan klik <strong>&quot;Create API Key&quot;</strong>.</li>
                  <li>Salin API key berawalan <code>gsk_...</code> dan tempelkan di bawah ini.</li>
                </ol>
              )}
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{provider === 'gemini' ? 'Google Gemini API Key:' : 'Groq API Key:'}</span>
                <button
                  type="button"
                  onClick={() => setShowKeyText(!showKeyText)}
                  className="text-slate-400 hover:text-slate-600 text-[11px] font-normal cursor-pointer"
                >
                  {showKeyText ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </label>
              <input
                type={showKeyText ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === 'gemini'
                    ? 'AIzaSy...'
                    : 'gsk_...'
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
              <p className="text-[11px] text-slate-400">
                Kunci ini disimpan secara aman di browser lokal Anda dan tidak dikirim ke pihak ketiga selain endpoint resmi LLM.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-5 py-2.5 rounded-xl btn-3d-primary text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
              >
                {keySavedStatus ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Simpan &amp; Aktifkan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
