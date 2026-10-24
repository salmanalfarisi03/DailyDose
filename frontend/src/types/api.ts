export interface HealthResponse {
  app_status?: string;
  database_status?: string;
  status: string;
  database: {
    status: string;
    connected: boolean;
    database: string;
  };
  environment: string;
  version: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  is_active?: boolean;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  sku: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  is_active?: boolean;
}

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED' | 'OVERDUE';

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id: number | null;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface InvoiceItemCreate {
  product_id?: number | null;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes: string | null;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceCreate {
  customer_id: number;
  invoice_number?: string | null;
  issue_date?: string | null;
  due_date?: string | null;
  notes?: string | null;
  tax_amount?: number;
  discount_amount?: number;
  items?: InvoiceItemCreate[];
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  customer_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  customer_id?: number | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'FINANCE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  initials: string;
  avatarColor: string;
}

export interface UserDbResponse {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface LoginApiResponse {
  user: UserDbResponse;
  token: string;
  message: string;
}

export interface AiChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AiChatRequest {
  message: string;
  history?: AiChatMessage[];
  api_key?: string;
  provider?: 'gemini' | 'groq' | 'openai';
}

export interface AiChatResponse {
  reply: string;
  provider_used: string;
  is_live_llm: boolean;
  suggestions: string[];
}

export interface AiStatusResponse {
  configured_in_env: boolean;
  active_providers: string[];
  default_provider: string;
  free_api_guides: Record<string, {
    name: string;
    tier: string;
    model: string;
    url: string;
    instructions: string;
  }>;
}


