import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  getQuestions, getArticles, getBooks, getCategories,
  getFaqs, getKnowledgeFiles,
  type ApiQuestion, type ApiArticle, type ApiBook,
  type ApiCategory, type ApiFaq, type ApiKnowledgeFile,
} from "../../helpers/api/islamqa";
import { PageBreadcrumb } from "../../components";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || !text) return <>{text ?? ""}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text.slice(0, 180)}{text.length > 180 ? "…" : ""}</>;
  const start  = Math.max(0, idx - 40);
  const end    = Math.min(text.length, idx + query.length + 100);
  const before = (start > 0 ? "…" : "") + text.slice(start, idx);
  const match  = text.slice(idx, idx + query.length);
  const after  = text.slice(idx + query.length, end) + (end < text.length ? "…" : "");
  return (
    <>
      {before}
      <mark className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 rounded px-0.5 not-italic font-semibold">
        {match}
      </mark>
      {after}
    </>
  );
}

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft:     "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  archived:  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[status] ?? STATUS_COLORS.draft}`}>
      {status}
    </span>
  );
}

// ── Section component ─────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  icon: string;
  count: number;
  loading: boolean;
  children: React.ReactNode;
}

function Section({ title, icon, count, loading, children }: SectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <i className={`${icon} text-primary text-lg`}></i>
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-[15px]">{title}</h2>
        {!loading && (
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-medium">
            {count} result{count !== 1 ? "s" : ""}
          </span>
        )}
        {loading && <span className="ml-auto text-xs text-gray-400 animate-pulse">Loading…</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [questions, setQuestions]   = useState<ApiQuestion[]>([]);
  const [articles,  setArticles]    = useState<ApiArticle[]>([]);
  const [books,     setBooks]       = useState<ApiBook[]>([]);
  const [categories,setCategories]  = useState<ApiCategory[]>([]);
  const [faqs,      setFaqs]        = useState<ApiFaq[]>([]);
  const [files,     setFiles]       = useState<ApiKnowledgeFile[]>([]);
  const [loading,   setLoading]     = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);

    Promise.allSettled([
      getQuestions({ search: q, limit: 20, status: "all" }),
      getArticles({ search: q, limit: 20, status: "all" }),
      getBooks({ search: q, limit: 20, status: "all" }),
      getCategories(),
      getFaqs({ status: "all" }),
      getKnowledgeFiles({ limit: 100 }),
    ]).then(([qRes, aRes, bRes, cRes, fRes, kRes]) => {
      if (qRes.status === "fulfilled") setQuestions(qRes.value.items ?? []);
      if (aRes.status === "fulfilled") setArticles(aRes.value.items ?? []);
      if (bRes.status === "fulfilled") setBooks(bRes.value.items ?? []);
      if (cRes.status === "fulfilled") {
        const ql = q.toLowerCase();
        setCategories((cRes.value as ApiCategory[]).filter((c) => c.name.toLowerCase().includes(ql)));
      }
      if (fRes.status === "fulfilled") {
        const ql = q.toLowerCase();
        setFaqs((fRes.value as ApiFaq[]).filter((f) =>
          f.question.toLowerCase().includes(ql) || f.answer.toLowerCase().includes(ql)
        ));
      }
      if (kRes.status === "fulfilled") {
        const ql = q.toLowerCase();
        setFiles((kRes.value.items ?? []).filter((f) =>
          f.name.toLowerCase().includes(ql) || (f.description ?? "").toLowerCase().includes(ql)
        ));
      }
      setLoading(false);
    });
  }, [q]);

  const totalResults = questions.length + articles.length + books.length + categories.length + faqs.length + files.length;

  return (
    <>
      <PageBreadcrumb title="Search" />

      <div className="px-6 py-4 max-w-4xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {q ? (
              <>Search results for &ldquo;<span className="text-primary">{q}</span>&rdquo;</>
            ) : (
              "Search"
            )}
          </h1>
          {q && !loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {totalResults} result{totalResults !== 1 ? "s" : ""} across all sections
            </p>
          )}
        </div>

        {!q.trim() && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <i className="mgc_search_line text-5xl mb-3 block"></i>
            <p className="text-sm">Use the search bar above to find anything in the admin panel.</p>
          </div>
        )}

        {q.trim() && (
          <div className="flex flex-col gap-5">

            {/* Questions */}
            <Section title="Questions & Answers" icon="mgc_question_line" count={questions.length} loading={loading}>
              {questions.length === 0 && !loading
                ? <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-600">No questions found.</p>
                : questions.map((q_) => (
                    <div key={q_.id} className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <StatusBadge status={q_.status} />
                          {q_.isNew       && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">New</span>}
                          {q_.isEssential && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Essential</span>}
                          <span className="text-[11px] text-gray-400">{q_.category}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1">
                          <Highlight text={q_.title} query={q} />
                        </p>
                        {q_.excerpt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                            <Highlight text={q_.excerpt} query={q} />
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/questions/edit/${q_.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
            </Section>

            {/* Articles */}
            <Section title="Articles" icon="mgc_file_line" count={articles.length} loading={loading}>
              {articles.length === 0 && !loading
                ? <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-600">No articles found.</p>
                : articles.map((a) => (
                    <div key={a.id} className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={a.status} />
                          <span className="text-[11px] text-gray-400">{a.author}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1">
                          <Highlight text={a.title} query={q} />
                        </p>
                        {a.excerpt && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                            <Highlight text={a.excerpt} query={q} />
                          </p>
                        )}
                      </div>
                      <Link to={`/articles/edit/${a.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium shrink-0">
                        Edit
                      </Link>
                    </div>
                  ))}
            </Section>

            {/* Books */}
            <Section title="Books" icon="mgc_book_2_line" count={books.length} loading={loading}>
              {books.length === 0 && !loading
                ? <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-600">No books found.</p>
                : books.map((b) => (
                    <div key={b.id} className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={b.status} />
                          {b.author && <span className="text-[11px] text-gray-400">{b.author}</span>}
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1">
                          <Highlight text={b.title} query={q} />
                        </p>
                        {b.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                            <Highlight text={b.description} query={q} />
                          </p>
                        )}
                      </div>
                      <Link to={`/books/edit/${b.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium shrink-0">
                        Edit
                      </Link>
                    </div>
                  ))}
            </Section>

            {/* Categories */}
            <Section title="Categories" icon="mgc_grid_line" count={categories.length} loading={loading}>
              {categories.length === 0 && !loading
                ? <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-600">No categories found.</p>
                : categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <i className="mgc_grid_line text-gray-400"></i>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            <Highlight text={c.name} query={q} />
                          </p>
                          <p className="text-[11px] text-gray-400">{c.answerCount} answers · {c.subcategoryCount} subcategories</p>
                        </div>
                      </div>
                      <Link to={`/categories/edit/${c.id}`} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium shrink-0">
                        Edit
                      </Link>
                    </div>
                  ))}
            </Section>

            {/* FAQs */}
            <Section title="FAQs" icon="mgc_comment_line" count={faqs.length} loading={loading}>
              {faqs.length === 0 && !loading
                ? <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-600">No FAQs found.</p>
                : faqs.map((f) => (
                    <div key={f.id} className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={f.status} />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1">
                          <Highlight text={f.question} query={q} />
                        </p>
                        {f.answer && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                            <Highlight text={f.answer} query={q} />
                          </p>
                        )}
                      </div>
                      <Link to={`/faqs/${f.id}/edit`} className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium shrink-0">
                        Edit
                      </Link>
                    </div>
                  ))}
            </Section>

            {/* Knowledge Files */}
            <Section title="Knowledge Files" icon="mgc_folder_line" count={files.length} loading={loading}>
              {files.length === 0 && !loading
                ? <p className="px-5 py-4 text-sm text-gray-400 dark:text-gray-600">No knowledge files found.</p>
                : files.map((f) => (
                    <div key={f.id} className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={f.status} />
                          <span className="text-[11px] text-gray-400 uppercase">{f.fileType}</span>
                          <span className="text-[11px] text-gray-400">{f.fileSize}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1">
                          <Highlight text={f.name} query={q} />
                        </p>
                        {f.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                            <Highlight text={f.description} query={q} />
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">{f.categoryName}</span>
                    </div>
                  ))}
            </Section>

          </div>
        )}
      </div>
    </>
  );
};

export default Search;
