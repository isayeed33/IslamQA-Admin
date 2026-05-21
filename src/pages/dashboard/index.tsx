import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { getDashboardStats, getQuestions, ApiDashboardStats, ApiQuestion } from "../../helpers/api/islamqa";

const statusColor: Record<string, string> = {
  published: "success",
  draft: "warning",
  archived: "secondary",
};

const Dashboard = () => {
  const [stats, setStats] = useState<ApiDashboardStats | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<ApiQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getQuestions({ status: "all", limit: 5, order: "desc" }),
    ]).then(([s, q]) => {
      setStats(s);
      setRecentQuestions(q.items);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { title: "Total Questions", value: stats.totalQuestions, icon: "mgc_question_line", color: "primary", link: "/questions" },
    { title: "New This Month", value: stats.newAnswersThisMonth, icon: "mgc_add_circle_line", color: "info", link: "/questions" },
    { title: "Essential Answers", value: stats.essentialAnswers, icon: "mgc_star_line", color: "warning", link: "/questions" },
    { title: "Articles", value: stats.totalArticles, icon: "mgc_news_line", color: "primary", link: "/articles" },
    { title: "Books", value: stats.totalBooks, icon: "mgc_book_2_line", color: "success", link: "/books" },
    { title: "Knowledge Files", value: stats.totalKnowledgeFiles, icon: "mgc_folder_2_line", color: "info", link: "/knowledge-files" },
    { title: "Categories", value: stats.totalCategories, icon: "mgc_classify_2_line", color: "secondary", link: "/categories" },
    { title: "Total Views", value: stats.totalViews, icon: "mgc_eye_line", color: "success", link: "/questions" },
  ] : [];

  return (
    <>
      <PageBreadcrumb title="Dashboard" name="Dashboard" breadCrumbItems={["IslamQA", "Admin", "Dashboard"]} />

      {/* Welcome Banner */}
      <div className="card mb-6 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary to-green-600 text-white relative">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">Welcome to IslamQA Admin</h2>
            <p className="text-green-100 text-sm">Manage Islamic Q&A content, articles, books, and knowledge resources</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/questions/create" className="btn bg-white text-primary text-sm px-4 py-2 font-medium hover:bg-green-50">
                <i className="mgc_add_line me-1"></i> New Question
              </Link>
              <Link to="/articles/create" className="btn bg-green-700 text-white text-sm px-4 py-2 font-medium hover:bg-green-800">
                <i className="mgc_news_line me-1"></i> New Article
              </Link>
            </div>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-10 font-bold">☪</div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <i className="mgc_loading_2_line animate-spin text-3xl mr-2"></i> Loading stats...
        </div>
      ) : (
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-5 mb-6">
          {statCards.map((s, i) => (
            <div key={i} className="card">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</h3>
                  </div>
                  <div className={`flex items-center justify-center h-14 w-14 rounded-xl bg-${s.color}/10`}>
                    <i className={`${s.icon} text-3xl text-${s.color}`}></i>
                  </div>
                </div>
                <Link to={s.link} className="text-xs text-primary hover:underline mt-3 inline-flex items-center gap-1">
                  View all <i className="mgc_right_line text-sm"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two column layout */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Recent Questions */}
        <div className="xl:col-span-2">
          <div className="card">
            <div className="p-5 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">Recent Questions</h5>
                <Link to="/questions" className="text-sm text-primary hover:underline">View all</Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{q.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[200px]">{q.title}</p>
                        <p className="text-xs text-gray-400"><i className="mgc_eye_line me-1"></i>{q.views ?? 0} views</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="badge bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{q.category || "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">{q.date}</td>
                      <td className="px-4 py-3">
                        <span className={`badge bg-${statusColor[q.status] ?? "secondary"}/10 text-${statusColor[q.status] ?? "secondary"} text-xs px-2 py-0.5 rounded capitalize`}>{q.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/questions/edit/${q.id}`} className="text-gray-400 hover:text-primary">
                          <i className="mgc_edit_line text-base"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!loading && recentQuestions.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No questions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity + Quick Actions */}
        <div className="space-y-5">
          {stats && stats.recentActivity.length > 0 && (
            <div className="card">
              <div className="p-5 border-b dark:border-gray-700">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h5>
              </div>
              <div className="p-4 space-y-3">
                {stats.recentActivity.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="mgc_edit_line text-xs text-primary"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-200 line-clamp-1">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.action} by {a.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="p-5 border-b dark:border-gray-700">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200">Quick Actions</h5>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {[
                { label: "Add Question", icon: "mgc_question_line", link: "/questions/create", color: "primary" },
                { label: "New Article", icon: "mgc_news_line", link: "/articles/create", color: "info" },
                { label: "Upload Book", icon: "mgc_book_2_line", link: "/books/create", color: "warning" },
                { label: "Upload File", icon: "mgc_folder_2_line", link: "/knowledge-files/upload", color: "secondary" },
                { label: "Add Category", icon: "mgc_classify_2_line", link: "/categories/create", color: "primary" },
              ].map((action, i) => (
                <Link key={i} to={action.link} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg bg-${action.color}/5 hover:bg-${action.color}/10 transition-colors`}>
                  <i className={`${action.icon} text-xl text-${action.color}`}></i>
                  <span className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
