import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { Question } from "../../types/islamqa";
import Swal from "sweetalert2";
import { getQuestions, deleteQuestion } from "../../helpers/api/islamqa";

const statusBadge: Record<string, string> = {
  published: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-secondary/10 text-secondary",
};

type FlagFilter = "all" | "new" | "essential";

const QuestionsList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flagFilter, setFlagFilter] = useState<FlagFilter>("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getQuestions({ status: "all", limit: 100 });
      setQuestions(res.items as unknown as Question[]);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      (q.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesFlag =
      flagFilter === "all" ||
      (flagFilter === "new" && q.isNew) ||
      (flagFilter === "essential" && q.isEssential);
    return matchesSearch && matchesStatus && matchesFlag;
  });

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Delete Q&A?",
      text: "This will permanently delete the question and its answer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      cancelButtonColor: "#68625D",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteQuestion(id);
          setQuestions(prev => prev.filter(q => q.id !== id));
          Swal.fire("Deleted!", "The Q&A has been deleted.", "success");
        } catch {
          Swal.fire("Error", "Failed to delete. Please try again.", "error");
        }
      }
    });
  };

  const newCount = questions.filter(q => q.isNew).length;
  const essentialCount = questions.filter(q => q.isEssential).length;

  return (
    <>
      <PageBreadcrumb title="Questions & Answers" name="Q&A" breadCrumbItems={["IslamQA", "Content", "Q&A"]} />

      {/* Flag filter tabs */}
      <div className="flex items-center gap-1 mb-4 border-b dark:border-gray-700 overflow-x-auto">
        <button
          onClick={() => setFlagFilter("all")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${flagFilter === "all" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          All Q&A
          <span className="ms-1.5 badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-1.5 py-0.5 rounded-full">{questions.length}</span>
        </button>
        <button
          onClick={() => setFlagFilter("new")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${flagFilter === "new" ? "border-info text-info" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          <i className="mgc_add_circle_line me-1 text-sm"></i>
          New Answers
          <span className="ms-1.5 badge bg-info/10 text-info text-xs px-1.5 py-0.5 rounded-full">{newCount}</span>
        </button>
        <button
          onClick={() => setFlagFilter("essential")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${flagFilter === "essential" ? "border-warning text-warning" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
        >
          <i className="mgc_star_line me-1 text-sm"></i>
          Essential Answers
          <span className="ms-1.5 badge bg-warning/10 text-warning text-xs px-1.5 py-0.5 rounded-full">{essentialCount}</span>
        </button>
      </div>

      <div className="card">
        {/* Header */}
        <div className="p-5 border-b dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <i className="mgc_search_line absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Q&A..." className="form-input ps-9 py-2 text-sm w-full sm:w-64" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select py-2 text-sm">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Link to="/questions/create" className="btn bg-primary text-white text-sm px-4 py-2">
              <i className="mgc_add_line me-1"></i> Add Q&A
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="mgc_loading_2_line animate-spin text-3xl block mb-2"></i>
              <p className="text-sm">Loading Q&A...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Scholar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Lang</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Flags</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Views</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">#{q.id}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{q.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{q.excerpt}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap hidden md:table-cell">
                      {q.scholarName || <span className="text-gray-400 italic text-xs">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{q.category || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 uppercase hidden sm:table-cell">{q.language}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {q.isNew && (
                          <span className="badge bg-info/10 text-info text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            <i className="mgc_add_circle_line me-1 text-xs"></i>New
                          </span>
                        )}
                        {q.isEssential && (
                          <span className="badge bg-warning/10 text-warning text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            <i className="mgc_star_line me-1 text-xs"></i>Essential
                          </span>
                        )}
                        {(q as any).isTranscript && (
                          <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-0.5 rounded whitespace-nowrap">
                            <i className="mgc_file_line me-1 text-xs"></i>Transcript
                          </span>
                        )}
                        {!q.isNew && !q.isEssential && !(q as any).isTranscript && <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{(q.views ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">{q.date}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs px-2 py-0.5 rounded capitalize ${statusBadge[q.status] ?? ""}`}>{q.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/questions/edit/${q.id}`} className="btn btn-sm bg-primary/10 text-primary hover:bg-primary hover:text-white p-1.5" title="Edit">
                          <i className="mgc_edit_line text-base"></i>
                        </Link>
                        <button onClick={() => handleDelete(q.id)} className="btn btn-sm bg-danger/10 text-danger hover:bg-danger hover:text-white p-1.5" title="Delete">
                          <i className="mgc_delete_2_line text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <i className="mgc_question_line text-4xl mb-3 block"></i>
              <p>No Q&A found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t dark:border-gray-700 flex items-center justify-between text-sm">
          <p className="text-gray-500">Showing {filtered.length} of {questions.length} Q&A</p>
        </div>
      </div>
    </>
  );
};

export default QuestionsList;
