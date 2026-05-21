// ─── Core IslamQA Data Models ────────────────────────────────────────────────

export type ContentStatus = 'draft' | 'published' | 'archived';
export type LanguageCode = 'en' | 'id' | 'tr' | 'fr' | 'ur' | 'bn' | 'ru' | 'es' | 'fa' | 'hi' | 'de' | 'pt' | 'zh';

// ─── Question / Answer ───────────────────────────────────────────────────────

export interface Question {
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
  status: ContentStatus;
  language: LanguageCode;
  isNew: boolean;
  isEssential: boolean;
  isTranscript: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: number;
  questionId: number;
  questionTitle: string;
  answerText: string;
  summaryText: string;
  scholarName: string;
  date: string;
  views: number;
  category: string;
  categoryId: number;
  slug: string;
  status: ContentStatus;
  language: LanguageCode;
  isEssential: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Subcategory {
  id: number;
  name: string;
  answerCount: number;
  slug: string;
  parentId: number;
}

export interface Category {
  id: number;
  name: string;
  answerCount: number;
  subcategoryCount: number;
  icon: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
  language: LanguageCode;
  status: ContentStatus;
}

// ─── Essential Answers ───────────────────────────────────────────────────────

export interface EssentialQuestion {
  id: number;
  title: string;
  slug: string;
  questionText: string;
  summaryText: string;
  categoryId: number;
  level: 1 | 2;
  status: ContentStatus;
  language: LanguageCode;
}

export interface EssentialCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  questionCount: number;
  status: ContentStatus;
}

// ─── Article ──────────────────────────────────────────────────────────────────

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
  views: number;
  toc: string[];
  sections: ArticleSection[];
  author: string;
  status: ContentStatus;
  language: LanguageCode;
  createdAt: string;
  updatedAt: string;
}

// ─── Book ─────────────────────────────────────────────────────────────────────

export interface Book {
  id: number;
  title: string;
  description: string;
  excerpt: string;
  downloads: number;
  image: string;
  slug: string;
  date: string;
  fileSize: string;
  pdfUrl: string;
  author: string;
  status: ContentStatus;
  language: LanguageCode;
  createdAt: string;
  updatedAt: string;
}

// ─── Knowledge File ───────────────────────────────────────────────────────────

export interface KnowledgeFile {
  id: number;
  name: string;
  description: string;
  fileType: string;
  fileSize: string;
  url: string;
  categoryId: number;
  categoryName: string;
  downloads: number;
  status: ContentStatus;
  language: LanguageCode;
  uploadedAt: string;
  updatedAt: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalQuestions: number;
  totalAnswers: number;
  newAnswersThisMonth: number;
  essentialAnswers: number;
  totalArticles: number;
  totalBooks: number;
  totalKnowledgeFiles: number;
  totalCategories: number;
  totalViews: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'question' | 'answer' | 'article' | 'book' | 'file';
  title: string;
  action: 'created' | 'updated' | 'published' | 'archived';
  timestamp: string;
  user: string;
}
