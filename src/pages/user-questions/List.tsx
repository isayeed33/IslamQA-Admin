import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import {
  getUserQuestions,
  updateUserQuestion,
  deleteUserQuestion,
  ApiUserQuestion,
} from "../../helpers/api/islamqa";

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  answered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Row component ──────────────────────────────────────────────────────────────

interface RowProps {
  item:           ApiUserQuestion;
  onStatusChange: (id: number, status: string, notes?: string) => void;
  onDelete:       (id: number) => void;
}

function UserQuestionRow({ item: q, onStatusChange, onDelete }: RowProps) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes]       = useState(q.notes ?? "");

  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl mb-3 overflow-hidden">
      {/* Summary row */}
      <div className="flex items-start gap-3 p-4">
        {/* Avatar / index */}
        <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
          <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <i className="mgc_question_line text-primary text-base" />
          </span>
          <span className="text-[10px] text-gray-400 font-medium">#{q.id}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[q.status]}`}>
              {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {q.questions.length} question{q.questions.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-gray-400 ml-auto shrink-0">{formatDate(q.createdAt)}</span>
          </div>

          {q.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span className="font-medium">From:</span> {q.name}
              {q.email && <span className="ml-1 text-gray-400">({q.email})</span>}
            </p>
          )}

          {/* First question preview */}
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium line-clamp-1">
            {q.questions[0]}
          </p>
          {q.questions.length > 1 && (
            <p className="text-xs text-gray-400 mt-0.5">
              +{q.questions.length - 1} more question{q.questions.length > 2 ? "s" : ""}
            </p>
          )}
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
            title="Delete"
            onClick={() => onDelete(q.id)}
            className="btn border border-danger/30 text-danger hover:bg-danger hover:text-white px-2 py-1.5 text-xs transition-colors"
          >
            <i className="mgc_delete_2_line" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4 flex flex-col gap-4">

          {/* All questions */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Questions
            </p>
            <ol className="flex flex-col gap-2">
              {q.questions.map((question, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  <span className="shrink-0 text-xs font-bold text-gray-400 mt-0.5">{idx + 1}.</span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Admin Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes..."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Status actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-400 font-medium mr-1">Mark as:</span>
            {(["pending", "reviewed", "answered"] as const)
              .filter((s) => s !== q.status)
              .map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(q.id, s, notes)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors cursor-pointer ${STATUS_COLORS[s]} border-current/20`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            <button
              onClick={() => onStatusChange(q.id, q.status, notes)}
              className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <i className="mgc_save_2_line mr-1" />
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── List page ──────────────────────────────────────────────────────────────────

const TABS = ["all", "pending", "reviewed", "answered"] as const;
type Tab = typeof TABS[number];

const UserQuestionList = () => {
  const [items, setItems]     = useState<ApiUserQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const load = (status: Tab = activeTab) => {
    setLoading(true);
    getUserQuestions(status)
      .then((res) => setItems(res.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(activeTab); }, [activeTab]);

  const handleStatusChange = async (id: number, status: string, notes?: string) => {
    try {
      await updateUserQuestion(id, { status, ...(notes !== undefined ? { notes } : {}) });
      load(activeTab);
      Swal.fire({ title: "Updated!", icon: "success", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to update.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete this submission?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteUserQuestion(id);
      setItems((prev) => prev.filter((q) => q.id !== id));
      Swal.fire({ title: "Deleted!", icon: "success", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to delete.", "error");
    }
  };

  return (
    <>
      <PageBreadcrumb
        title="User Questions"
        name="Question Submissions"
        breadCrumbItems={["IslamQA", "User Questions"]}
      />

      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h5 className="font-semibold text-gray-700 dark:text-gray-200">User-Submitted Questions</h5>
            <p className="text-xs text-gray-400 mt-0.5">Questions submitted by visitors via the Clone website</p>
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
            {items.length} {activeTab === "all" ? "total" : activeTab}
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
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <i className="mgc_question_line text-4xl mb-3 block" />
              <p>No {activeTab === "all" ? "" : activeTab} submissions found.</p>
            </div>
          ) : (
            items.map((q) => (
              <UserQuestionRow
                key={q.id}
                item={q}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default UserQuestionList;
