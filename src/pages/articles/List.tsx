import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { getArticles, deleteArticle, ApiArticle } from "../../helpers/api/islamqa";

const statusColor: Record<string, string> = {
  published: "success",
  draft: "warning",
  archived: "secondary",
};

const ArticlesList = () => {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getArticles({ status: "all", limit: 100 });
      setArticles(res.items);
    } catch (err) {
      console.error("Failed to load articles", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.author ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: number, title: string) => {
    Swal.fire({
      title: "Delete Article?",
      text: `"${title}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteArticle(id);
          setArticles(prev => prev.filter(a => a.id !== id));
          Swal.fire("Deleted!", "The article has been deleted.", "success");
        } catch {
          Swal.fire("Error", "Failed to delete. Please try again.", "error");
        }
      }
    });
  };

  return (
    <>
      <PageBreadcrumb title="Articles" name="Articles" breadCrumbItems={["IslamQA", "Knowledge Resources", "Articles"]} />

      <div className="card">
        <div className="p-5 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <i className="mgc_search_line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder="Search articles by title or author..." value={search}
                  onChange={e => setSearch(e.target.value)} className="form-input pl-9 w-full" />
              </div>
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select w-full md:w-36">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Link to="/articles/create" className="btn bg-primary text-white whitespace-nowrap">
              <i className="mgc_add_line me-1"></i> New Article
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="mgc_loading_2_line animate-spin text-3xl block mb-2"></i>
              <p className="text-sm">Loading articles...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Lang</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{a.id}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{a.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.excerpt}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">{a.author || <span className="text-gray-400 italic text-xs">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 uppercase hidden sm:table-cell">{a.language}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      <span className="flex items-center gap-1"><i className="mgc_eye_line text-sm"></i>{(a.views ?? 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">{a.date}</td>
                    <td className="px-4 py-3">
                      <span className={`badge bg-${statusColor[a.status] ?? "secondary"}/10 text-${statusColor[a.status] ?? "secondary"} text-xs px-2 py-0.5 rounded capitalize`}>{a.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/articles/edit/${a.id}`} className="text-gray-400 hover:text-primary" title="Edit">
                          <i className="mgc_edit_line text-base"></i>
                        </Link>
                        <button onClick={() => handleDelete(a.id, a.title)} className="text-gray-400 hover:text-danger" title="Delete">
                          <i className="mgc_delete_2_line text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No articles found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filtered.length} of {articles.length} articles</span>
        </div>
      </div>
    </>
  );
};

export default ArticlesList;
