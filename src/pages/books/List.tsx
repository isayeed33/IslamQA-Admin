import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { getBooks, deleteBook, ApiBook } from "../../helpers/api/islamqa";

const statusColor: Record<string, string> = { published: "success", draft: "warning", archived: "secondary" };

const BooksList = () => {
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBooks({ status: "all", limit: 100 });
      setBooks(res.items);
    } catch (err) {
      console.error("Failed to load books", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: number, title: string) => {
    Swal.fire({
      title: "Delete Book?",
      text: `"${title}" and its PDF file will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBook(id);
          setBooks(prev => prev.filter(b => b.id !== id));
          Swal.fire("Deleted!", "The book has been deleted.", "success");
        } catch {
          Swal.fire("Error", "Failed to delete. Please try again.", "error");
        }
      }
    });
  };

  return (
    <>
      <PageBreadcrumb title="Books" name="Books" breadCrumbItems={["IslamQA", "Knowledge Resources", "Books"]} />

      <div className="card">
        <div className="p-5 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <i className="mgc_search_line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder="Search books by title or author..." value={search}
                  onChange={e => setSearch(e.target.value)} className="form-input pl-9 w-full" />
              </div>
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select w-full md:w-36">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Link to="/books/create" className="btn bg-primary text-white whitespace-nowrap">
              <i className="mgc_add_line me-1"></i> Upload Book
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="mgc_loading_2_line animate-spin text-3xl block mb-2"></i>
              <p className="text-sm">Loading books...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Lang</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Downloads</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{b.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-9 h-12 bg-primary/10 rounded flex items-center justify-center">
                          <i className="mgc_book_2_line text-primary text-lg"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[200px]">{b.title}</p>
                          <p className="text-xs text-gray-400">{b.author || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded uppercase">{b.language}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{b.fileSize || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      <span className="flex items-center gap-1">
                        <i className="mgc_download_2_line text-sm text-primary"></i>
                        {(b.downloads ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">{b.date}</td>
                    <td className="px-4 py-3">
                      <span className={`badge bg-${statusColor[b.status] ?? "secondary"}/10 text-${statusColor[b.status] ?? "secondary"} text-xs px-2 py-0.5 rounded capitalize`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/books/edit/${b.id}`} className="text-gray-400 hover:text-primary" title="Edit">
                          <i className="mgc_edit_line text-base"></i>
                        </Link>
                        <button onClick={() => handleDelete(b.id, b.title)} className="text-gray-400 hover:text-danger" title="Delete">
                          <i className="mgc_delete_2_line text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No books found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500">
          Showing {filtered.length} of {books.length} books
        </div>
      </div>
    </>
  );
};

export default BooksList;
