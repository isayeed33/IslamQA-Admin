import { APICore } from './apiCore';
import axios from 'axios';
import config from '../../config';

const api = new APICore();

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  answerCount: number;
  subcategoryCount: number;
  subcategories: { id: number; name: string; slug: string; answerCount: number; parentId: number }[];
}

export interface ApiQuestion {
  id: number;
  title: string;
  excerpt: string;
  questionText: string;
  answerText: string;
  summaryText: string;
  scholarName: string;
  date: string;
  views: number;
  category: string;
  categoryId: number;
  slug: string;
  categoryBreadcrumb: string[];
  status: string;
  language: string;
  isNew: boolean;
  isEssential: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
  views: number;
  toc: string[];
  sections: { heading: string; paragraphs: string[] }[];
  author: string;
  status: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBook {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  author: string;
  image: string;
  pdfUrl: string;
  fileSize: string;
  downloads: number;
  date: string;
  slug: string;
  status: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKnowledgeFile {
  id: number;
  name: string;
  description: string;
  fileType: string;
  fileSize: string;
  url: string;
  categoryId: number;
  categoryName: string;
  downloads: number;
  status: string;
  language: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface ApiDashboardStats {
  totalQuestions: number;
  totalAnswers: number;
  newAnswersThisMonth: number;
  essentialAnswers: number;
  totalArticles: number;
  totalBooks: number;
  totalKnowledgeFiles: number;
  totalCategories: number;
  totalViews: number;
  recentActivity: { id: number; type: string; title: string; action: string; timestamp: string; user: string }[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export const getDashboardStats = (): Promise<ApiDashboardStats> =>
  api.get('/dashboard/stats', {}).then((r: any) => r.data);

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategories = (lang = 'en'): Promise<ApiCategory[]> =>
  api.get('/categories', { lang }).then((r: any) => r.data);

export const getCategory = (id: number, lang = 'en'): Promise<ApiCategory> =>
  api.get(`/categories/${id}`, { lang }).then((r: any) => r.data);

export const createCategory = (data: Record<string, any>): Promise<ApiCategory> =>
  api.create('/categories', data).then((r: any) => r.data);

export const updateCategory = (id: number, data: Record<string, any>): Promise<ApiCategory> =>
  api.updatePatch(`/categories/${id}`, data).then((r: any) => r.data);

export const deleteCategory = (id: number): Promise<void> =>
  api.delete(`/categories/${id}`).then(() => {});

// ── Questions ─────────────────────────────────────────────────────────────────

export const getQuestions = (params?: Record<string, any>): Promise<PaginatedResponse<ApiQuestion>> =>
  api.get('/questions', { lang: 'en', status: 'all', limit: 50, ...params }).then((r: any) => r.data);

export const getQuestion = (id: number, lang = 'en'): Promise<ApiQuestion> =>
  api.get(`/questions/${id}`, { lang }).then((r: any) => r.data);

export const createQuestion = (data: Record<string, any>): Promise<ApiQuestion> =>
  api.create('/questions', data).then((r: any) => r.data);

export const updateQuestion = (id: number, data: Record<string, any>): Promise<ApiQuestion> =>
  api.updatePatch(`/questions/${id}`, data).then((r: any) => r.data);

export const deleteQuestion = (id: number): Promise<void> =>
  api.delete(`/questions/${id}`).then(() => {});

// ── Articles ──────────────────────────────────────────────────────────────────

export const getArticles = (params?: Record<string, any>): Promise<PaginatedResponse<ApiArticle>> =>
  api.get('/articles', { lang: 'en', status: 'all', limit: 50, ...params }).then((r: any) => r.data);

export const getArticle = (id: number, lang = 'en'): Promise<ApiArticle> =>
  api.get(`/articles/${id}`, { lang }).then((r: any) => r.data);

export const createArticle = (data: Record<string, any>): Promise<ApiArticle> =>
  api.create('/articles', data).then((r: any) => r.data);

export const updateArticle = (id: number, data: Record<string, any>): Promise<ApiArticle> =>
  api.updatePatch(`/articles/${id}`, data).then((r: any) => r.data);

export const deleteArticle = (id: number): Promise<void> =>
  api.delete(`/articles/${id}`).then(() => {});

// ── Books ─────────────────────────────────────────────────────────────────────

export const getBooks = (params?: Record<string, any>): Promise<PaginatedResponse<ApiBook>> =>
  api.get('/books', { lang: 'en', status: 'all', limit: 50, ...params }).then((r: any) => r.data);

export const getBook = (id: number, lang = 'en'): Promise<ApiBook> =>
  api.get(`/books/${id}`, { lang }).then((r: any) => r.data);

export const createBook = (data: Record<string, any>): Promise<ApiBook> =>
  api.createWithFile('/books', data).then((r: any) => r.data);

export const updateBook = (id: number, data: Record<string, any>): Promise<ApiBook> =>
  api.updatePatch(`/books/${id}`, data).then((r: any) => r.data);

export const deleteBook = (id: number): Promise<void> =>
  api.delete(`/books/${id}`).then(() => {});

// ── Knowledge Files ───────────────────────────────────────────────────────────

export const getKnowledgeFiles = (params?: Record<string, any>): Promise<PaginatedResponse<ApiKnowledgeFile>> =>
  api.get('/knowledge-files', { lang: 'en', status: 'all', limit: 100, ...params }).then((r: any) => r.data);

export const uploadKnowledgeFile = (data: Record<string, any>): Promise<ApiKnowledgeFile> =>
  api.createWithFile('/knowledge-files/upload', data).then((r: any) => r.data);

export const deleteKnowledgeFile = (id: number): Promise<void> =>
  api.delete(`/knowledge-files/${id}`).then(() => {});

// ── FAQs ──────────────────────────────────────────────────────────────────────

export interface ApiFaq {
  id: number;
  sortOrder: number;
  status: string;
  question: string;
  answer: string;
  question_ar: string;
  answer_ar: string;
  question_ru: string;
  answer_ru: string;
}

export const getFaqs = (params?: Record<string, any>): Promise<ApiFaq[]> =>
  api.get('/faqs', { lang: 'en', status: 'all', ...params }).then((r: any) => r.data);

export const getFaq = (id: number): Promise<ApiFaq> =>
  api.get(`/faqs/${id}`, {}).then((r: any) => r.data);

export const createFaq = (data: Record<string, any>): Promise<ApiFaq> =>
  api.create('/faqs', data).then((r: any) => r.data);

export const updateFaq = (id: number, data: Record<string, any>): Promise<ApiFaq> =>
  api.updatePatch(`/faqs/${id}`, data).then((r: any) => r.data);

export const deleteFaq = (id: number): Promise<void> =>
  api.delete(`/faqs/${id}`).then(() => {});

// ── Site Settings ─────────────────────────────────────────────────────────────

export const getPageSettings = (): Promise<Record<string, boolean>> =>
  api.get('/settings/pages', {}).then((r: any) => r.data);

export const updatePageSettings = (data: Record<string, boolean>): Promise<void> =>
  api.updatePatch('/settings/pages', data).then(() => {});

// ── Site Pages ────────────────────────────────────────────────────────────────

export interface ApiSitePage {
  id: number;
  slug: string;
  updatedAt: string;
  title: string;
  content: string;
  title_ar: string;
  content_ar: string;
  title_ru: string;
  content_ru: string;
}

export const getSitePages = (): Promise<ApiSitePage[]> =>
  api.get('/site-pages', {}).then((r: any) => r.data);

export const getSitePage = (slug: string): Promise<ApiSitePage> =>
  api.get(`/site-pages/${slug}`, {}).then((r: any) => r.data);

export const updateSitePage = (slug: string, data: Record<string, any>): Promise<ApiSitePage> =>
  api.updatePatch(`/site-pages/${slug}`, data).then((r: any) => r.data);

// ── Corrections ───────────────────────────────────────────────────────────────

export interface ApiCorrection {
  id: number;
  contentType: string;
  contentId: number;
  name: string;
  email: string;
  description: string;
  suggestion: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export const getCorrections = (status?: string): Promise<ApiCorrection[]> =>
  api.get('/corrections', { status: status ?? 'all' }).then((r: any) => r.data);

export const updateCorrectionStatus = (id: number, status: string): Promise<ApiCorrection> =>
  api.updatePatch(`/corrections/${id}`, { status }).then((r: any) => r.data);

export const deleteCorrection = (id: number): Promise<void> =>
  api.delete(`/corrections/${id}`).then(() => {});

// ── User Questions ────────────────────────────────────────────────────────────

export interface ApiUserQuestion {
  id:        number;
  name:      string;
  email:     string;
  questions: string[];
  status:    "pending" | "reviewed" | "answered";
  notes:     string;
  createdAt: string;
  updatedAt: string;
}

export const getUserQuestions = (status?: string): Promise<PaginatedResponse<ApiUserQuestion>> =>
  api.get('/user-questions', { status: status ?? 'all', limit: 100 }).then((r: any) => r.data);

export const updateUserQuestion = (id: number, data: { status?: string; notes?: string }): Promise<ApiUserQuestion> =>
  api.updatePatch(`/user-questions/${id}`, data).then((r: any) => r.data);

export const deleteUserQuestion = (id: number): Promise<void> =>
  api.delete(`/user-questions/${id}`).then(() => {});
