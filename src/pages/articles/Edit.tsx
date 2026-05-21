import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import QuillEditor from "../../components/QuillEditor";
import { PageBreadcrumb } from "../../components";
import SeoCard from "../../components/SeoCard";
import Swal from "sweetalert2";
import { getArticle, updateArticle, deleteArticle } from "../../helpers/api/islamqa";

interface ArticleSection { heading: string; body: string; }
interface ArticleFormData {
  title: string;
  excerpt: string;
  author: string;
  status: string;
  sections:        ArticleSection[];
  title_ar:        string;
  excerpt_ar:      string;
  author_ar:       string;
  sections_ar:     ArticleSection[];
  title_ru:        string;
  excerpt_ru:      string;
  author_ru:       string;
  sections_ru:     ArticleSection[];
  metaTitle:       string;
  metaDescription: string;
  metaKeywords:    string;
  robots:          string;
}

const ArticlesEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } = useForm<ArticleFormData>({
    defaultValues: {
      status: "draft",
      sections:    [],
      sections_ar: [],
      sections_ru: [],
      metaTitle: "", metaDescription: "", metaKeywords: "", robots: "index,follow",
    },
  });

  const { fields: enFields, append: appendEn, remove: removeEn } = useFieldArray({ control, name: "sections" });
  const { fields: ruFields, append: appendRu, remove: removeRu } = useFieldArray({ control, name: "sections_ru" });

  const status = watch("status");

  const mapSections = (sections: any[]) =>
    (sections ?? []).map((s: any) => ({
      heading: s.heading ?? "",
      body:    Array.isArray(s.paragraphs) ? s.paragraphs.join("\n\n") : (s.body ?? ""),
    }));

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getArticle(Number(id), "en"),
      getArticle(Number(id), "ru").catch(() => null),
    ]).then(([en, ru]) => {
      reset({
        title:    en.title,
        excerpt:  en.excerpt,
        author:   en.author,
        status:   en.status,
        sections:        mapSections(en.sections),
        metaTitle:       en.metaTitle       ?? "",
        metaDescription: en.metaDescription ?? "",
        metaKeywords:    en.metaKeywords    ?? "",
        robots:          en.robots          ?? "index,follow",
        title_ru:    ru?.title    ?? "",
        excerpt_ru:  ru?.excerpt  ?? "",
        author_ru:   ru?.author   ?? "",
        sections_ru: ru ? mapSections(ru.sections) : [{ heading: "", body: "" }],
      });
    }).catch(() => {
      Swal.fire("Error", "Failed to load article.", "error");
      navigate("/articles");
    }).finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: ArticleFormData) => {
    if (data.status === "published") {
      const ruMissing = !data.title_ru || !data.excerpt_ru;
      if (ruMissing) {
        setActiveLang("ru");
        Swal.fire("Roman Urdu Required", "Title and excerpt must be filled in Roman Urdu before publishing.", "warning");
        return;
      }
    }

    try {
      await updateArticle(Number(id), {
        title:           data.title,
        excerpt:         data.excerpt,
        author:          data.author,
        language:        "en",
        status:          data.status,
        sections:        JSON.stringify(data.sections.map(s => ({ heading: s.heading, paragraphs: [s.body] }))),
        toc:             JSON.stringify(data.sections.map(s => s.heading).filter(Boolean)),
        metaTitle:       data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        metaKeywords:    data.metaKeywords ?? "",
        robots:          data.robots ?? "index,follow",
      });

      await updateArticle(Number(id), {
        title:    data.title_ru ?? "",
        excerpt:  data.excerpt_ru ?? "",
        author:   data.author_ru ?? "",
        language: "ru",
        status:   data.status,
        sections: JSON.stringify(data.sections_ru.filter(s => s.heading || s.body).map(s => ({ heading: s.heading, paragraphs: [s.body] }))),
        toc:      JSON.stringify(data.sections_ru.map(s => s.heading).filter(Boolean)),
      });

      await Swal.fire({ title: "Article Updated!", icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/articles");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to save.", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({ title: "Delete Article?", text: "This action cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonColor: "#E63535", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await deleteArticle(Number(id));
      await Swal.fire({ title: "Deleted!", icon: "success", timer: 1500, showConfirmButton: false });
      navigate("/articles");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to delete.", "error");
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

  if (loading) {
    return (
      <>
        <PageBreadcrumb title={`Edit Article #${id}`} name={`Edit Article #${id}`} breadCrumbItems={["IslamQA", "Articles", "Edit"]} />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb title={`Edit Article #${id}`} name={`Edit Article #${id}`} breadCrumbItems={["IslamQA", "Articles", "Edit"]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-6">
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
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Article Content</h5>
                  <span className="badge bg-info/10 text-info text-xs px-2 py-0.5 rounded ms-auto">ID: {id}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Title</label>
                  <input {...register("title")} type="text" className="form-input w-full" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Excerpt / Introduction</label>
                  <textarea {...register("excerpt")} rows={3} className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Author</label>
                  <input {...register("author")} type="text" className="form-input w-full" />
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Article Sections</h5>
                  <button type="button" onClick={() => appendEn({ heading: "", body: "" })} className="btn bg-primary/10 text-primary text-sm px-3 py-1.5">
                    <i className="mgc_add_line me-1"></i> Add Section
                  </button>
                </div>
                <div className="space-y-4">
                  {enFields.map((field, index) => (
                    <div key={field.id} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Section {index + 1}</span>
                        {enFields.length > 1 && (
                          <button type="button" onClick={() => removeEn(index)} className="text-danger hover:text-red-700 text-sm">
                            <i className="mgc_delete_2_line"></i>
                          </button>
                        )}
                      </div>
                      <div className="mb-3">
                        <input {...register(`sections.${index}.heading`)} type="text" className="form-input w-full" placeholder="Section heading..." />
                      </div>
                      <Controller name={`sections.${index}.body`} control={control} render={({ field }) => (
                        <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Section content..." />
                      )} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Roman Urdu */}
            <div className={activeLang !== "ru" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Maqale ka Mazmoon (Roman Urdu)</h5>
                  {status === "published" && <span className="text-xs text-warning ms-auto">Nashr ke liye zaroori</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Unwaan {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <input {...register("title_ru")} type="text" className="form-input w-full" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Iqtibas / Muqaddima {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <textarea {...register("excerpt_ru")} rows={3} className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Musannif</label>
                  <input {...register("author_ru")} type="text" className="form-input w-full" />
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Maqale ke Hisse</h5>
                  <button type="button" onClick={() => appendRu({ heading: "", body: "" })} className="btn bg-primary/10 text-primary text-sm px-3 py-1.5">
                    <i className="mgc_add_line me-1"></i> Hissa Add Karein
                  </button>
                </div>
                <div className="space-y-4">
                  {ruFields.map((field, index) => (
                    <div key={field.id} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Hissa {index + 1}</span>
                        {ruFields.length > 1 && (
                          <button type="button" onClick={() => removeRu(index)} className="text-danger hover:text-red-700 text-sm">
                            <i className="mgc_delete_2_line"></i>
                          </button>
                        )}
                      </div>
                      <div className="mb-3">
                        <input {...register(`sections_ru.${index}.heading`)} type="text" className="form-input w-full" placeholder="Hisse ka unwaan..." />
                      </div>
                      <Controller name={`sections_ru.${index}.body`} control={control} render={({ field }) => (
                        <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Hisse ka mazmoon..." />
                      )} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Publish Settings</h5>
              <div className="mb-3">
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
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span> : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate("/articles")} className="btn border text-gray-600 px-4">Cancel</button>
              </div>
            </div>

            <SeoCard register={register} watch={watch} />

            <div className="card p-4 bg-danger/5 border-danger/20">
              <h6 className="text-sm font-semibold text-danger mb-2">Danger Zone</h6>
              <button type="button" onClick={handleDelete} className="btn w-full border-danger text-danger hover:bg-danger hover:text-white text-sm py-2">
                <i className="mgc_delete_2_line me-1"></i> Delete Article
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ArticlesEdit;
