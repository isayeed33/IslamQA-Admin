import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PageBreadcrumb } from "../../components";
import QuillEditor from "../../components/QuillEditor";
import Swal from "sweetalert2";
import { createFaq } from "../../helpers/api/islamqa";

interface FaqFormData {
  question: string;
  answer: string;
  question_ar: string;
  answer_ar: string;
  question_ru: string;
  answer_ru: string;
  sortOrder: number;
  status: string;
}

const schema = yup.object().shape({
  question:    yup.string().required("Question (EN) is required"),
  answer:      yup.string().required("Answer (EN) is required"),
  question_ar: yup.string(),
  answer_ar:   yup.string(),
  question_ru: yup.string(),
  answer_ru:   yup.string(),
  sortOrder:   yup.number().min(0).default(0),
  status:      yup.string().required(),
});

const FaqCreate = () => {
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<FaqFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { status: "published", sortOrder: 0 },
  });

  const status = watch("status");

  const onSubmit = async (data: FaqFormData) => {
    if (data.status === "published") {
      const ruMissing = !data.question_ru || !data.answer_ru;
      if (ruMissing) {
        setActiveLang("ru");
        Swal.fire("Roman Urdu Required", "Question and answer must be filled in Roman Urdu before publishing.", "warning");
        return;
      }
    }

    try {
      await createFaq({
        question:    data.question,
        answer:      data.answer,
        question_ar: data.question_ar ?? "",
        answer_ar:   data.answer_ar ?? "",
        question_ru: data.question_ru ?? "",
        answer_ru:   data.answer_ru ?? "",
        sortOrder:   Number(data.sortOrder ?? 0),
        status:      data.status,
      });
      await Swal.fire({ title: "FAQ Created!", icon: "success", timer: 1800, showConfirmButton: false });
      navigate("/faqs");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to save. Please try again.", "error");
    }
  };

  const tab = (lang: "en" | "ru", label: string) => (
    <button
      type="button"
      onClick={() => setActiveLang(lang)}
      className={`px-5 py-2 text-sm font-medium transition-colors ${
        activeLang === lang
          ? "bg-primary text-white"
          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
      } ${lang !== "en" ? "border-l border-gray-200 dark:border-gray-700" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <PageBreadcrumb title="Add FAQ" name="Add FAQ" breadCrumbItems={["IslamQA", "FAQs", "Add"]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 space-y-5">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-fit">
              {tab("en", "English")}
              {tab("ru", "Roman Urdu")}
            </div>

            {/* English */}
            <div className={activeLang !== "en" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Question & Answer (English)</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Question <span className="text-danger">*</span></label>
                  <input {...register("question")} type="text" placeholder="Enter the question..." className={`form-input w-full ${errors.question ? "border-red-500" : ""}`} />
                  {errors.question && <p className="text-xs text-danger mt-1">{errors.question.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Answer <span className="text-danger">*</span></label>
                  <Controller name="answer" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter the answer..." error={!!errors.answer} />
                  )} />
                  {errors.answer && <p className="text-xs text-danger mt-1">{errors.answer.message}</p>}
                </div>
              </div>
            </div>

            {/* Roman Urdu */}
            <div className={activeLang !== "ru" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Sawal aur Jawab (Roman Urdu)</h5>
                  {status === "published" && <span className="text-xs text-warning ms-auto">Nashr ke liye zaroori</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Sawal {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <input {...register("question_ru")} type="text" placeholder="Sawal likhein..." className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Jawab {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <Controller name="answer_ru" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Jawab likhein..." />
                  )} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Settings</h5>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Status</label>
                <select {...register("status")} className="form-select w-full">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {status === "published" && (
                <p className="text-xs text-warning mb-3 flex items-center gap-1">
                  <i className="mgc_information_line"></i> English and Roman Urdu must all be complete to publish.
                </p>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Sort Order</label>
                <input {...register("sortOrder")} type="number" min={0} className="form-input w-full" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span> : "Save FAQ"}
                </button>
                <button type="button" onClick={() => navigate("/faqs")} className="btn border text-gray-600 dark:text-gray-300 px-4 py-2">Cancel</button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  );
};

export default FaqCreate;
