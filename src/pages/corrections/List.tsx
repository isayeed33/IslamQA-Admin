import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import {
  getCorrections,
  updateCorrectionStatus,
  deleteCorrection,
  ApiCorrection,
} from "../../helpers/api/islamqa";

// ── Helpers ────────────────────────────────────────────────────────────────────

const CONTENT_TYPE_LABELS: Record<string, string> = {
  question:       "Q&A",
  article:        "Article",
  book:           "Book",
  knowledge_file: "Knowledge File",
};

const CONTENT_TYPE_ICONS: Record<string, string> = {
  question:       "mgc_question_line",
  article:        "mgc_news_line",
  book:           "mgc_book_2_line",
  knowledge_file: "mgc_folder_2_line",
};

const EDIT_PATHS: Record<string, (id: number) => string | null> = {
  question:       (id) => `/questions/edit/${id}`,
  article:        (id) => `/articles/edit/${id}`,
  book:           (id) => `/books/edit/${id}`,
  knowledge_file: () => `/knowledge-files`,
};

const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Row component ──────────────────────────────────────────────────────────────

interface RowProps {
  correction: ApiCorrection;
  onStatusChange: (id: number, status: string) => void;
  onDelete: (id: number) => void;
  onGoEdit: (correction: ApiCorrection) => void;
}

function CorrectionRow({ correction: c, onStatusChange, onDelete, onGoEdit }: RowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl mb-3 overflow-hidden">
      {/* Summary row */}
      <div className="flex items-start gap-3 p-4">
        {/* Content type badge */}
        <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
          <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <i className={`${CONTENT_TYPE_ICONS[c.contentType] ?? "mgc_document_line"} text-primary text-base`} />
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            #{c.contentId}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {CONTENT_TYPE_LABELS[c.contentType] ?? c.contentType}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
              {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
            </span>
            <span className="text-xs text-gray-400 ml-auto shrink-0">
              {formatDate(c.createdAt)}
            </span>
          </div>

          {c.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-medium">From:</span> {c.name}
              {c.email && <span className="ml-1 text-gray-400">({c.email})</span>}
            </p>
          )}

          {/* Description preview */}
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium line-clamp-1">
            {c.description}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
            <span className="font-medium text-gray-500">Suggestion:</span> {c.suggestion}
          </p>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1 ml-2">
          <button
            title="Expand / Collapse"
            onClick={() => setExpanded((v) => !v)}
            className="btn border text-gray-400 hover:text-primary px-2 py-1.5 text-xs"
          >
            <i className={`mgc_${expanded ? "up" : "down"}_line`} />
          </button>
          <button
            title="Go to Edit"
            onClick={() => onGoEdit(c)}
            className="btn border text-gray-500 hover:text-primary px-2 py-1.5 text-xs"
          >
            <i className="mgc_edit_2_line" />
          </button>
          <button
            title="Delete"
            onClick={() => onDelete(c.id)}
            className="btn border border-danger/30 text-danger hover:bg-danger hover:text-white px-2 py-1.5 text-xs transition-colors"
          >
            <i className="mgc_delete_2_line" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              What is incorrect
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {c.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Suggested correction
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {c.suggestion}
            </p>
          </div>

          {/* Status actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-400 font-medium mr-1">Mark as:</span>
            {(["pending", "reviewed", "resolved"] as const)
              .filter((s) => s !== c.status)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(c.id, s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${STATUS_COLORS[s]} border-current/20`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            <button
              onClick={() => onGoEdit(c)}
              className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
            >
              <i className="mgc_edit_2_line mr-1" />
              Go to Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── List page ──────────────────────────────────────────────────────────────────

const TABS = ["all", "pending", "reviewed", "resolved"] as const;
type Tab = typeof TABS[number];

const CorrectionList = () => {
  const navigate = useNavigate();
  const [corrections, setCorrections] = useState<ApiCorrection[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState<Tab>("pending");

  const load = (status: Tab = activeTab) => {
    setLoading(true);
    getCorrections(status)
      .then(setCorrections)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(activeTab); }, [activeTab]);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateCorrectionStatus(id, status);
      load(activeTab);
      Swal.fire({ title: "Updated!", icon: "success", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete correction?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCorrection(id);
      setCorrections((prev) => prev.filter((c) => c.id !== id));
      Swal.fire({ title: "Deleted!", icon: "success", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to delete correction.", "error");
    }
  };

  const handleGoEdit = (correction: ApiCorrection) => {
    const pathFn = EDIT_PATHS[correction.contentType];
    if (!pathFn) return;
    const path = pathFn(correction.contentId);
    if (path) navigate(path);
  };

  const tabCounts: Partial<Record<Tab, number>> = {};

  return (
    <>
      <PageBreadcrumb
        title="Corrections"
        name="Manage Corrections"
        breadCrumbItems={["IslamQA", "Corrections"]}
      />

      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h5 className="font-semibold text-gray-700 dark:text-gray-200">
            User-Submitted Corrections
          </h5>
          <span className="text-xs text-gray-400">
            {corrections.length} {activeTab === "all" ? "total" : activeTab}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto flex-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <i className="mgc_loading_2_line animate-spin text-2xl mr-2" /> Loading...
            </div>
          ) : corrections.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <i className="mgc_flag_2_line text-4xl mb-3 block" />
              <p>No {activeTab === "all" ? "" : activeTab} corrections found.</p>
            </div>
          ) : (
            corrections.map((c) => (
              <CorrectionRow
                key={c.id}
                correction={c}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onGoEdit={handleGoEdit}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CorrectionList;
