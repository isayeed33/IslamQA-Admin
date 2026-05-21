export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
}

const MENU_ITEMS: MenuItemTypes[] = [
  // ── Overview ──────────────────────────────────────────────────────────────
  {
    key: 'menu',
    label: 'Main',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    isTitle: false,
    icon: 'mgc_home_3_line',
    url: '/dashboard',
  },

  // ── Q&A Content ───────────────────────────────────────────────────────────
  {
    key: 'content',
    label: 'Q&A Content',
    isTitle: true,
  },
  {
    key: 'questions',
    label: 'Questions & Answers',
    isTitle: false,
    icon: 'mgc_question_line',
    children: [
      {
        key: 'questions-list',
        label: 'All Q&A',
        url: '/questions',
        parentKey: 'questions',
      },
      {
        key: 'questions-create',
        label: 'Add Q&A',
        url: '/questions/create',
        parentKey: 'questions',
      },
    ],
  },

  // ── Knowledge Resources ───────────────────────────────────────────────────
  {
    key: 'resources',
    label: 'Knowledge Resources',
    isTitle: true,
  },
  {
    key: 'articles',
    label: 'Articles',
    isTitle: false,
    icon: 'mgc_news_line',
    children: [
      {
        key: 'articles-list',
        label: 'All Articles',
        url: '/articles',
        parentKey: 'articles',
      },
      {
        key: 'articles-create',
        label: 'Add Article',
        url: '/articles/create',
        parentKey: 'articles',
      },
    ],
  },
  {
    key: 'books',
    label: 'Books',
    isTitle: false,
    icon: 'mgc_book_2_line',
    children: [
      {
        key: 'books-list',
        label: 'All Books',
        url: '/books',
        parentKey: 'books',
      },
      {
        key: 'books-create',
        label: 'Add Book',
        url: '/books/create',
        parentKey: 'books',
      },
    ],
  },

  // ── Site Pages ────────────────────────────────────────────────────────────
  {
    key: 'site-pages',
    label: 'Site Pages',
    isTitle: true,
  },
  {
    key: 'page-content',
    label: 'Page Content',
    isTitle: false,
    icon: 'mgc_document_2_line',
    children: [
      { key: 'page-content-about',   label: 'About Us',      url: '/site-pages/about/edit',   parentKey: 'page-content' },
      { key: 'page-content-terms',   label: 'Terms of Use',  url: '/site-pages/terms/edit',   parentKey: 'page-content' },
      { key: 'page-content-privacy', label: 'Privacy Policy', url: '/site-pages/privacy/edit', parentKey: 'page-content' },
      { key: 'page-content-faqs',    label: 'FAQs',          url: '/faqs',                    parentKey: 'page-content' },
    ],
  },
  {
    key: 'page-visibility',
    label: 'Page Visibility',
    isTitle: false,
    icon: 'mgc_eye_2_line',
    url: '/settings/pages',
  },

  // ── Taxonomy ──────────────────────────────────────────────────────────────
  {
    key: 'taxonomy',
    label: 'Taxonomy',
    isTitle: true,
  },
  {
    key: 'categories',
    label: 'Categories',
    isTitle: false,
    icon: 'mgc_classify_2_line',
    children: [
      {
        key: 'categories-list',
        label: 'All Categories',
        url: '/categories',
        parentKey: 'categories',
      },
      {
        key: 'categories-create',
        label: 'Add Category',
        url: '/categories/create',
        parentKey: 'categories',
      },
    ],
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  {
    key: 'admin',
    label: 'Administration',
    isTitle: true,
  },
  {
    key: 'user-questions',
    label: 'User Questions',
    isTitle: false,
    icon: 'mgc_send_line',
    url: '/user-questions',
  },
  {
    key: 'corrections',
    label: 'Corrections',
    isTitle: false,
    icon: 'mgc_flag_2_line',
    url: '/corrections',
  },
  {
    key: 'settings',
    label: 'Settings',
    isTitle: false,
    icon: 'mgc_settings_3_line',
    url: '/settings',
  },
];

export { MENU_ITEMS };
