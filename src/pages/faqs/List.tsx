import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { getFaqs, deleteFaq, updateFaq, ApiFaq } from "../../helpers/api/islamqa";

// ── Sortable row ───────────────────────────────────────────────────────────────

interface RowProps {
  faq: ApiFaq;
  index: number;
  onDelete: (id: number, question: string) => void;
}

function SortableFaqRow({ faq, index, onDelete }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "var(--ct-body-bg, #f8f9fa)" : undefined,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? ("relative" as const) : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex-shrink-0 flex items-center justify-center mt-0.5 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 touch-none"
        title="Drag to reorder"
      >
        <i className="mgc_align_justify_line text-base"></i>
      </button>

      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
          {faq.question || <em className="text-gray-400">No EN question</em>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{faq.answer?.slice(0, 120) || "—"}</p>
        {faq.question_ar && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate" dir="rtl">
            {faq.question_ar}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className={`badge text-xs px-2 py-0.5 rounded ${faq.status === "published" ? "bg-success/10 text-success" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
          {faq.status}
        </span>
        <Link to={`/faqs/${faq.id}/edit`} className="btn border text-gray-500 hover:text-primary px-3 py-1.5 text-xs">
          <i className="mgc_edit_2_line"></i>
        </Link>
        <button
          onClick={() => onDelete(faq.id, faq.question)}
          className="btn border border-danger/30 text-danger hover:bg-danger hover:text-white px-3 py-1.5 text-xs transition-colors"
        >
          <i className="mgc_delete_2_line"></i>
        </button>
      </div>
    </div>
  );
}

// ── List page ──────────────────────────────────────────────────────────────────

const FaqList = () => {
  const [faqs, setFaqs] = useState<ApiFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const load = () => {
    setLoading(true);
    getFaqs({ status: "all" })
      .then((data) => setFaqs(data.sort((a, b) => a.sortOrder - b.sortOrder)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = faqs.findIndex((f) => f.id === active.id);
    const newIndex = faqs.findIndex((f) => f.id === over.id);
    const reordered = arrayMove(faqs, oldIndex, newIndex);

    // Optimistic update
    setFaqs(reordered);

    // Persist new sortOrders
    setSaving(true);
    try {
      await Promise.all(
        reordered.map((faq, idx) =>
          faq.sortOrder !== idx ? updateFaq(faq.id, { sortOrder: idx }) : Promise.resolve(),
        ),
      );
      // Sync local sortOrder values
      setFaqs((prev) => prev.map((f, idx) => ({ ...f, sortOrder: idx })));
    } catch {
      Swal.fire("Error", "Failed to save new order.", "error");
      load(); // revert
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, question: string) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: `"${question.slice(0, 60)}..."`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E63535",
      confirmButtonText: "Delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      Swal.fire({ title: "Deleted!", icon: "success", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to delete FAQ.", "error");
    }
  };

  return (
    <>
      <PageBreadcrumb title="FAQs" name="Manage FAQs" breadCrumbItems={["IslamQA", "FAQs"]} />

      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200">Frequently Asked Questions</h5>
            {saving && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <i className="mgc_loading_2_line animate-spin"></i> Saving order…
              </span>
            )}
          </div>
          <Link to="/faqs/create" className="btn bg-primary text-white px-4 py-2 text-sm flex items-center gap-1.5">
            <i className="mgc_add_line"></i> Add FAQ
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <i className="mgc_question_line text-4xl mb-3 block"></i>
            <p>No FAQs yet.</p>
            <Link to="/faqs/create" className="btn bg-primary text-white mt-4 px-4 py-2 text-sm">
              Add your first FAQ
            </Link>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={faqs.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {faqs.map((faq, idx) => (
                  <SortableFaqRow key={faq.id} faq={faq} index={idx} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {faqs.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <i className="mgc_align_justify_line"></i>
              Drag rows to reorder — order is saved automatically.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FaqList;
