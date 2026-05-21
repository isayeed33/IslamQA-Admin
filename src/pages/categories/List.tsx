import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { getCategories, ApiCategory } from "../../helpers/api/islamqa";
import { APICore } from "../../helpers/api/apiCore";

const api = new APICore();

const CategoryList = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [parentFilter, setParentFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories("en");
      // Flatten: root + subcategories
      const flat: ApiCategory[] = [];
      data.forEach(cat => {
        flat.push(cat);
        (cat.subcategories ?? []).forEach((sub: any) => flat.push({ ...sub, subcategories: [], answerCount: sub.answerCount ?? 0, subcategoryCount: 0, icon: "" }));
      });
      setCategories(flat);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const rootCategories = categories.filter(c => !(c as any).parentId);

  const filtered = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    const isRoot = !(c as any).parentId;
    const matchParent =
      parentFilter === "all" ||
      (parentFilter === "root" && isRoot) ||
      (parentFilter === "sub" && !isRoot);
    return matchSearch && matchParent;
  });

  const handleDelete = (id: number, name: string) => {
    Swal.fire({
      title: "Delete Category?",
      text: `"${name}" and all its subcategories may be affected. This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Yes, delete it",
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/categories/${id}`);
          setCategories(prev => prev.filter(c => c.id !== id));
          Swal.fire("Deleted!", "The category has been deleted.", "success");
        } catch {
          Swal.fire("Error", "Failed to delete. Please try again.", "error");
        }
      }
    });
  };

  return (
    <>
      <PageBreadcrumb title="Categories" name="Categories" breadCrumbItems={["IslamQA", "Taxonomy", "Categories"]} />

      <div className="grid md:grid-cols-4 gap-4 mb-5">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Root Categories</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{rootCategories.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Categories</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{categories.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Answers</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {rootCategories.reduce((s, c) => s + (c.answerCount ?? 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Subcategories</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {rootCategories.reduce((s, c) => s + (c.subcategoryCount ?? 0), 0)}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="p-5 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <div className="relative">
                <i className="mgc_search_line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" placeholder="Search categories..." value={search}
                  onChange={e => setSearch(e.target.value)} className="form-input pl-9 w-full" />
              </div>
            </div>
            <select value={parentFilter} onChange={e => setParentFilter(e.target.value)} className="form-select w-full md:w-40">
              <option value="all">All Categories</option>
              <option value="root">Root Only</option>
              <option value="sub">Subcategories</option>
            </select>
            <Link to="/categories/create" className="btn bg-primary text-white whitespace-nowrap">
              <i className="mgc_add_line me-1"></i> Add Category
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <i className="mgc_loading_2_line animate-spin text-3xl block mb-2"></i>
              <p className="text-sm">Loading categories...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Answers</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Subcategories</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map(c => {
                  const isRoot = !(c as any).parentId;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{c.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {!isRoot && <span className="w-4 h-px bg-gray-300 dark:bg-gray-600 inline-block"></span>}
                          {c.icon && <span className="text-base">{c.icon}</span>}
                          <span className={`text-sm font-medium ${!isRoot ? 'text-gray-600 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200'}`}>{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{c.slug}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-medium">{(c.answerCount ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{c.subcategoryCount ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/categories/edit/${c.id}`} className="text-gray-400 hover:text-primary" title="Edit">
                            <i className="mgc_edit_line text-base"></i>
                          </Link>
                          <button onClick={() => handleDelete(c.id, c.name)} className="text-gray-400 hover:text-danger" title="Delete">
                            <i className="mgc_delete_2_line text-base"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No categories found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 text-sm text-gray-500">
          Showing {filtered.length} of {categories.length} categories
        </div>
      </div>
    </>
  );
};

export default CategoryList;
