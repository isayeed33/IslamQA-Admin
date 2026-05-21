import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PageBreadcrumb } from "../../components";
import QuillEditor from "../../components/QuillEditor";
import SeoCard from "../../components/SeoCard";
import Swal from "sweetalert2";
import { getCategories, createQuestion, updateQuestion, ApiCategory } from "../../helpers/api/islamqa";

interface QAFormData {
  title: string;         questionText: string;
  answerText: string;    summaryText: string;    scholarName: string;
  title_ar: string;      questionText_ar: string;
  answerText_ar: string; summaryText_ar: string; scholarName_ar: string;
  title_ru: string;      questionText_ru: string;
  answerText_ru: string; summaryText_ru: string; scholarName_ru: string;
  categoryId: number;    status: string;
  isNew: boolean;        isEssential: boolean;   isTranscript: boolean;
  videoUrl: string;
  metaTitle: string;     metaDescription: string;
  metaKeywords: string;  robots: string;
}

const schema = yup.object().shape({
  title:           yup.string().required("Question title is required"),
  questionText:    yup.string().required("Question text is required"),
  answerText:      yup.string().required("Answer text is required"),
  summaryText:     yup.string().required("Answer summary is required"),
  scholarName:     yup.string(),
  title_ar:        yup.string(),
  questionText_ar: yup.string(),
  answerText_ar:   yup.string(),
  summaryText_ar:  yup.string(),
  scholarName_ar:  yup.string(),
  title_ru:        yup.string(),
  questionText_ru: yup.string(),
  answerText_ru:   yup.string(),
  summaryText_ru:  yup.string(),
  scholarName_ru:  yup.string(),
  categoryId:      yup.number().required("Category is required").positive("Category is required"),
  status:          yup.string().required(),
  isNew:           yup.boolean(),
  isEssential:     yup.boolean(),
  isTranscript:    yup.boolean(),
  videoUrl:        yup.string().url("Must be a valid URL").nullable().notRequired().transform(v => v || ""),
  metaTitle:       yup.string().max(60),
  metaDescription: yup.string().max(160),
  metaKeywords:    yup.string(),
  robots:          yup.string(),
});

const QuestionsCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<QAFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { status: "draft", isNew: false, isEssential: false, isTranscript: false, categoryId: 0, videoUrl: "", metaTitle: "", metaDescription: "", metaKeywords: "", robots: "index,follow" },
  });

  useEffect(() => {
    getCategories("en").then(setCategories).catch(console.error);
  }, []);

  const isNew        = watch("isNew");
  const isEssential  = watch("isEssential");
  const isTranscript = watch("isTranscript");
  const status       = watch("status");

  const onSubmit = async (data: QAFormData) => {
    if (data.status === "published") {
      const ruMissing = !data.title_ru || !data.questionText_ru || !data.answerText_ru || !data.summaryText_ru;
      if (ruMissing) {
        setActiveLang("ru");
        Swal.fire("Roman Urdu Required", "Title, question, answer, and summary must all be filled in Roman Urdu before publishing.", "warning");
        return;
      }
    }

    try {
      const created = await createQuestion({
        title: data.title, questionText: data.questionText,
        answerText: data.answerText, summaryText: data.summaryText,
        scholarName: data.scholarName ?? "", categoryId: Number(data.categoryId),
        language: "en", status: data.status,
        isNew: data.isNew ?? false, isEssential: data.isEssential ?? false,
        isTranscript: data.isTranscript ?? false,
        videoUrl: data.videoUrl ?? "",
        metaTitle: data.metaTitle ?? "", metaDescription: data.metaDescription ?? "",
        metaKeywords: data.metaKeywords ?? "", robots: data.robots ?? "index,follow",
      });

      await updateQuestion(created.id, {
        title: data.title_ru ?? "", questionText: data.questionText_ru ?? "",
        answerText: data.answerText_ru ?? "", summaryText: data.summaryText_ru ?? "",
        scholarName: data.scholarName_ru ?? "", categoryId: Number(data.categoryId),
        language: "ru", status: data.status,
        isNew: data.isNew ?? false, isEssential: data.isEssential ?? false,
        isTranscript: data.isTranscript ?? false,
        videoUrl: data.videoUrl ?? "",
      });

      await Swal.fire({ title: "Q&A Created!", text: "The question and answer have been saved.", icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/questions");
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
      <PageBreadcrumb title="Add Q&A" name="Add New Question & Answer" breadCrumbItems={["IslamQA", "Q&A", "Add"]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-6">

          {/* ── Main content ─────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Language tabs */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-fit">
              {tab("en", "English")}
              {tab("ru", "Roman Urdu")}
            </div>

            {/* English */}
            <div className={activeLang !== "en" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">Q</span>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Question</h5>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Question Title <span className="text-danger">*</span></label>
                  <input {...register("title")} type="text" placeholder="Enter the question title" className={`form-input w-full ${errors.title ? "border-red-500" : ""}`} />
                  {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Full Question Text <span className="text-danger">*</span></label>
                  <textarea {...register("questionText")} rows={4} placeholder="Enter the full question text..." className={`form-input w-full ${errors.questionText ? "border-red-500" : ""}`} />
                  {errors.questionText && <p className="text-xs text-danger mt-1">{errors.questionText.message}</p>}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success text-xs font-bold">A</span>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Answer</h5>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Scholar Name</label>
                  <input {...register("scholarName")} type="text" placeholder="e.g. Sheikh Ibn Baz" className="form-input w-full" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Full Answer Text <span className="text-danger">*</span></label>
                  <Controller name="answerText" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Enter the full scholarly answer..." error={!!errors.answerText} />
                  )} />
                  {errors.answerText && <p className="text-xs text-danger mt-1">{errors.answerText.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Answer Summary <span className="text-danger">*</span></label>
                  <Controller name="summaryText" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="1–2 sentence summary..." error={!!errors.summaryText} />
                  )} />
                  {errors.summaryText && <p className="text-xs text-danger mt-1">{errors.summaryText.message}</p>}
                </div>
              </div>
            </div>

            {/* Roman Urdu */}
            <div className={activeLang !== "ru" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">S</span>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Sawal (Roman Urdu)</h5>
                  {status === "published" && <span className="text-xs text-warning ms-auto">Nashr ke liye zaroori</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Sawal ka Unwaan {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <input {...register("title_ru")} type="text" placeholder="Sawal ka unwaan likhein" className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Poora Sawal {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <textarea {...register("questionText_ru")} rows={4} placeholder="Poora sawal likhein..." className="form-input w-full" />
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success text-xs font-bold">J</span>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Jawab (Roman Urdu)</h5>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Aalim ka Naam</label>
                  <input {...register("scholarName_ru")} type="text" placeholder="Masalan: Sheikh Ibn Baz" className="form-input w-full" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Poora Jawab {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <Controller name="answerText_ru" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Poora ilmi jawab likhein..." />
                  )} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Jawab ka Khulasa {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <Controller name="summaryText_ru" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="1–2 jumlon ka khulasa..." />
                  )} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Publish Settings</h5>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Status</label>
                <select {...register("status")} className="form-select w-full">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              {status === "published" && (
                <p className="text-xs text-warning mb-3 flex items-center gap-1">
                  <i className="mgc_information_line"></i> English and Roman Urdu must all be complete to publish.
                </p>
              )}
              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span> : "Save Q&A"}
                </button>
                <button type="button" onClick={() => navigate("/questions")} className="btn border text-gray-600 dark:text-gray-300 px-4 py-2">Cancel</button>
              </div>
            </div>

            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Category</h5>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Main Category <span className="text-danger">*</span></label>
              <select {...register("categoryId")} className={`form-select w-full ${errors.categoryId ? "border-red-500" : ""}`}>
                <option value={0}>Select category...</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-danger mt-1">{errors.categoryId.message}</p>}
            </div>

            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Video (optional)</h5>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Video URL</label>
              <input
                {...register("videoUrl")}
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className={`form-input w-full ${errors.videoUrl ? "border-red-500" : ""}`}
              />
              {errors.videoUrl && <p className="text-xs text-danger mt-1">{errors.videoUrl.message as string}</p>}
              <p className="text-xs text-gray-400 mt-1.5">YouTube or any embeddable video link</p>
            </div>

            <SeoCard register={register} watch={watch} />

            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Answer Flags</h5>
              <p className="text-xs text-gray-400 mb-4">Control where this answer appears on the site</p>
              <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors mb-3 ${isNew ? "border-info/40 bg-info/5" : "border-gray-200 dark:border-gray-700"}`}>
                <input type="checkbox" {...register("isNew")} className="form-checkbox rounded text-info mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5"><i className="mgc_add_circle_line text-info text-base"></i>New Answer</span>
                  <p className="text-xs text-gray-400 mt-0.5">Shows in the "New Answers" section</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors mb-3 ${isEssential ? "border-warning/40 bg-warning/5" : "border-gray-200 dark:border-gray-700"}`}>
                <input type="checkbox" {...register("isEssential")} className="form-checkbox rounded text-warning mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5"><i className="mgc_star_line text-warning text-base"></i>Essential Answer</span>
                  <p className="text-xs text-gray-400 mt-0.5">Curated answer for beginners, shown in Essential Answers</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${isTranscript ? "border-purple-400/40 bg-purple-50 dark:bg-purple-900/10" : "border-gray-200 dark:border-gray-700"}`}>
                <input type="checkbox" {...register("isTranscript")} className="form-checkbox rounded text-purple-500 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5"><i className="mgc_file_line text-purple-500 text-base"></i>Transcripted</span>
                  <p className="text-xs text-gray-400 mt-0.5">This answer is a transcript of a video or audio</p>
                </div>
              </label>
            </div>
          </div>

        </div>
      </form>
    </>
  );
};

export default QuestionsCreate;
