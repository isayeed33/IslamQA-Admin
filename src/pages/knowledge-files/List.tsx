import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { getKnowledgeFiles, deleteKnowledgeFile, ApiKnowledgeFile } from "../../helpers/api/islamqa";

const statusColor: Record<string, string> = { published: "success", draft: "warning" };

const KnowledgeList = () => {
  const [files, setFiles] = useState<ApiKnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getKnowledgeFiles({ status: "all", limit: 100 });
      setFiles(res.items);
    } catch (err) {
      console.error("Failed to load knowledge files", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = (id: number, name: string) => {
    Swal.fire({
      title: "Delete File?",
      text: `"${name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Yes, delete it",
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await deleteKnowledgeFile(id);
          setFiles(prev => prev.filter(f => f.id !== id));
          Swal.fire("Deleted!", "The file has been deleted.", "success");
        } catch {
          Swal.fire("Error", "Failed to delete. Please try again.", "error");
        }
      }
    });
  };

  const totalDownloads = filtered.reduce((sum, f) => sum + (f.downloads ?? 0), 0);

  return (
    <>
      <PageBreadcrumb title="Knowledge Files" name="Knowledge Files" breadCrumbItems={["IslamQA", "Knowledge Resources", "Knowledge Files"]} />

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <i className="mgc_folder_2_line text-xl text-primary"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Files</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{files.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <i className="mgc_download_2_line text-xl text-success"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Downloads</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <i className="mgc_file_line text-xl text-info"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Published</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{files.filter(f => f.status === "published").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-5 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <i className="mgc_search_line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder="Search files..." value={search}
                  onChange={e => setSearch(e.target.value)} className="form-input pl-9 w-full" />
              </div>
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select w-full md:w-36">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Link to="/knowledge-files/upload" className="btn bg-primary text-white whitespace-nowrap">
              <i className="mgc_upload_2_line me-1"></i> Upload File
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="mgc_loading_2_line animate-spin text-3xl block mb-2"></i>
              <p className="text-sm">Loading files...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Lang</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Downloads</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Uploaded</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <i className="mgc_file_line text-xl text-secondary"></i>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[200px]">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="badge bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded uppercase">{f.fileType.split("/").pop()}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">{f.categoryName || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 uppercase hidden sm:table-cell">{f.language}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{f.fileSize}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                      <span className="flex items-center gap-1">
                        <i className="mgc_download_2_line text-sm text-success"></i>
                        {(f.downloads ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap hidden sm:table-cell">
                      {new Date(f.uploadedAt).toISOString().slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge bg-${statusColor[f.status] ?? "secondary"}/10 text-${statusColor[f.status] ?? "secondary"} text-xs px-2 py-0.5 rounded capitalize`}>{f.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {f.url && (
                          <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary" title="Download">
                            <i className="mgc_download_2_line text-base"></i>
                          </a>
                        )}
                        <button onClick={() => handleDelete(f.id, f.name)} className="text-gray-400 hover:text-danger" title="Delete">
                          <i className="mgc_delete_2_line text-base"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No files found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500">
          Showing {filtered.length} of {files.length} files
        </div>
      </div>
    </>
  );
};

export default KnowledgeList;
