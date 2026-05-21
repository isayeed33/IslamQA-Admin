/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Navigate, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// Auth Pages
const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));

// Dashboard
const Dashboard = React.lazy(() => import("../pages/dashboard"));

// Questions
const QuestionsList = React.lazy(() => import("../pages/questions/List"));
const QuestionsCreate = React.lazy(() => import("../pages/questions/Create"));
const QuestionsEdit = React.lazy(() => import("../pages/questions/Edit"));


// Articles
const ArticlesList = React.lazy(() => import("../pages/articles/List"));
const ArticlesCreate = React.lazy(() => import("../pages/articles/Create"));
const ArticlesEdit = React.lazy(() => import("../pages/articles/Edit"));

// Books
const BooksList = React.lazy(() => import("../pages/books/List"));
const BooksCreate = React.lazy(() => import("../pages/books/Create"));
const BooksEdit = React.lazy(() => import("../pages/books/Edit"));

// Knowledge Files
const KnowledgeList = React.lazy(() => import("../pages/knowledge-files/List"));
const KnowledgeUpload = React.lazy(() => import("../pages/knowledge-files/Upload"));

// Categories
const CategoriesList = React.lazy(() => import("../pages/categories/List"));
const CategoriesCreate = React.lazy(() => import("../pages/categories/Create"));
const CategoriesEdit = React.lazy(() => import("../pages/categories/Edit"));

// Error
const Error404 = React.lazy(() => import("../pages/error/Error404"));

// ─── Settings ─────────────────────────────────────────────────────────────────
const Settings        = React.lazy(() => import("../pages/settings/index"));
const PageVisibility  = React.lazy(() => import("../pages/settings/Pages"));

// ─── FAQs ──────────────────────────────────────────────────────────────────────
const FaqList   = React.lazy(() => import("../pages/faqs/List"));
const FaqCreate = React.lazy(() => import("../pages/faqs/Create"));
const FaqEdit   = React.lazy(() => import("../pages/faqs/Edit"));

// ─── Site Pages ───────────────────────────────────────────────────────────────
const SitePagesList = React.lazy(() => import("../pages/site-pages/List"));
const SitePagesEdit = React.lazy(() => import("../pages/site-pages/Edit"));

// ─── Corrections ──────────────────────────────────────────────────────────────
const CorrectionList = React.lazy(() => import("../pages/corrections/List"));

// ─── User Questions ───────────────────────────────────────────────────────────
const UserQuestionList = React.lazy(() => import("../pages/user-questions/List"));

// ─── Search ───────────────────────────────────────────────────────────────────
const SearchPage = React.lazy(() => import("../pages/search/Search"));

export interface RoutesProps {
  path: string;
  name?: string;
  element?: any;
  route?: any;
  exact?: boolean;
  roles?: string[];
  children?: RoutesProps[];
}

const dashboardRoutes: RoutesProps = {
  path: "/home",
  name: "Dashboards",
  children: [
    { path: "/", name: "Root", element: <Navigate to="/dashboard" />, route: PrivateRoute },
    { path: "/dashboard", name: "Dashboard", element: <Dashboard />, route: PrivateRoute },
  ],
};

const questionsRoutes: RoutesProps = {
  path: "/questions",
  name: "Questions",
  children: [
    { path: "/questions", element: <QuestionsList />, route: PrivateRoute },
    { path: "/questions/create", element: <QuestionsCreate />, route: PrivateRoute },
    { path: "/questions/edit/:id", element: <QuestionsEdit />, route: PrivateRoute },
  ],
};

// Redirects for legacy routes
const legacyRedirects: RoutesProps = {
  path: "/answers",
  name: "Answers (redirect)",
  children: [
    { path: "/answers", element: <Navigate to="/questions" />, route: PrivateRoute },
    { path: "/answers/create", element: <Navigate to="/questions/create" />, route: PrivateRoute },
    { path: "/answers/edit/:id", element: <Navigate to="/questions" />, route: PrivateRoute },
    { path: "/new-answers", element: <Navigate to="/questions" />, route: PrivateRoute },
    { path: "/new-answers/create", element: <Navigate to="/questions/create" />, route: PrivateRoute },
    { path: "/essential-answers", element: <Navigate to="/questions" />, route: PrivateRoute },
    { path: "/essential-answers/create", element: <Navigate to="/questions/create" />, route: PrivateRoute },
    { path: "/essential-answers/edit/:id", element: <Navigate to="/questions" />, route: PrivateRoute },
  ],
};

const articlesRoutes: RoutesProps = {
  path: "/articles",
  name: "Articles",
  children: [
    { path: "/articles", element: <ArticlesList />, route: PrivateRoute },
    { path: "/articles/create", element: <ArticlesCreate />, route: PrivateRoute },
    { path: "/articles/edit/:id", element: <ArticlesEdit />, route: PrivateRoute },
  ],
};

const booksRoutes: RoutesProps = {
  path: "/books",
  name: "Books",
  children: [
    { path: "/books", element: <BooksList />, route: PrivateRoute },
    { path: "/books/create", element: <BooksCreate />, route: PrivateRoute },
    { path: "/books/edit/:id", element: <BooksEdit />, route: PrivateRoute },
  ],
};

const knowledgeRoutes: RoutesProps = {
  path: "/knowledge-files",
  name: "Knowledge Files",
  children: [
    { path: "/knowledge-files", element: <KnowledgeList />, route: PrivateRoute },
    { path: "/knowledge-files/upload", element: <KnowledgeUpload />, route: PrivateRoute },
  ],
};

const categoriesRoutes: RoutesProps = {
  path: "/categories",
  name: "Categories",
  children: [
    { path: "/categories", element: <CategoriesList />, route: PrivateRoute },
    { path: "/categories/create", element: <CategoriesCreate />, route: PrivateRoute },
    { path: "/categories/edit/:id", element: <CategoriesEdit />, route: PrivateRoute },
  ],
};

const settingsRoutes: RoutesProps = {
  path: "/settings",
  name: "Settings",
  children: [
    { path: "/settings",       element: <Settings />,       route: PrivateRoute },
    { path: "/settings/pages", element: <PageVisibility />, route: PrivateRoute },
  ],
};

const faqRoutes: RoutesProps = {
  path: "/faqs",
  name: "FAQs",
  children: [
    { path: "/faqs",            element: <FaqList />,   route: PrivateRoute },
    { path: "/faqs/create",     element: <FaqCreate />, route: PrivateRoute },
    { path: "/faqs/:id/edit",   element: <FaqEdit />,   route: PrivateRoute },
  ],
};

const sitePageRoutes: RoutesProps = {
  path: "/site-pages",
  name: "Site Pages",
  children: [
    { path: "/site-pages",             element: <SitePagesList />, route: PrivateRoute },
    { path: "/site-pages/:slug/edit",  element: <SitePagesEdit />, route: PrivateRoute },
  ],
};

const authRoutes: RoutesProps[] = [
  { path: "/auth/login", name: "Login", element: <Login />, route: Route },
  { path: "/auth/register", name: "Register", element: <Register />, route: Route },
];

const otherPublicRoutes = [
  { path: "*", name: "Error 404", element: <Error404 />, route: Route },
];

const flattenRoutes = (routes: RoutesProps[]): RoutesProps[] => {
  let flatRoutes: RoutesProps[] = [];
  routes.forEach((item) => {
    if (item.element) flatRoutes.push(item);
    if (item.children) flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
  });
  return flatRoutes;
};

const searchRoutes: RoutesProps = {
  path: "/search",
  name: "Search",
  children: [
    { path: "/search", element: <SearchPage />, route: PrivateRoute },
  ],
};

const correctionRoutes: RoutesProps = {
  path: "/corrections",
  name: "Corrections",
  children: [
    { path: "/corrections", element: <CorrectionList />, route: PrivateRoute },
  ],
};

const userQuestionRoutes: RoutesProps = {
  path: "/user-questions",
  name: "User Questions",
  children: [
    { path: "/user-questions", element: <UserQuestionList />, route: PrivateRoute },
  ],
};

const authProtectedRoutes = [
  dashboardRoutes,
  questionsRoutes,
  legacyRedirects,
  articlesRoutes,
  booksRoutes,
  knowledgeRoutes,
  categoriesRoutes,
  settingsRoutes,
  faqRoutes,
  sitePageRoutes,
  searchRoutes,
  correctionRoutes,
  userQuestionRoutes,
];

const publicRoutes = [...authRoutes, ...otherPublicRoutes];
const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);

export { publicRoutes, authProtectedRoutes, authProtectedFlattenRoutes, publicProtectedFlattenRoutes };
