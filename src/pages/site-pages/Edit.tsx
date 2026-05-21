import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { PageBreadcrumb } from "../../components";
import QuillEditor from "../../components/QuillEditor";
import Swal from "sweetalert2";
import { getSitePage, updateSitePage } from "../../helpers/api/islamqa";

const PAGE_META: Record<string, { label: string; labelAr: string; labelRu: string }> = {
  about:   { label: "About Us",         labelAr: "من نحن",            labelRu: "Hamare Baare Mein" },
  terms:   { label: "Terms of Use",     labelAr: "شروط الاستخدام",    labelRu: "Istemal ki Shartein" },
  privacy: { label: "Privacy Policy",   labelAr: "سياسة الخصوصية",   labelRu: "Privacy Policy" },
  contact: { label: "Contact Us",       labelAr: "اتصل بنا",          labelRu: "Humse Rabta Karein" },
  donate:  { label: "Support / Donate", labelAr: "الدعم والتبرع",     labelRu: "Madad / Ata" },
};

interface SitePageFormData {
  title:      string;
  content:    string;
  title_ar:   string;
  content_ar: string;
  title_ru:   string;
  content_ru: string;
}

const SitePagesEdit = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const meta = PAGE_META[slug ?? ""] ?? { label: slug ?? "Page", labelAr: "", labelRu: "" };

  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm<SitePageFormData>({
    defaultValues: { title: "", content: "", title_ar: "", content_ar: "", title_ru: "", content_ru: "" },
  });

  useEffect(() => {
    if (!slug) return;
    getSitePage(slug)
      .then((page) => {
        reset({
          title:      page.title,
          content:    page.content,
          title_ar:   page.title_ar,
          content_ar: page.content_ar,
          title_ru:   page.title_ru ?? "",
          content_ru: page.content_ru ?? "",
        });
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load page.", "error");
        navigate("/site-pages");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const onSubmit = async (data: SitePageFormData) => {
    try {
      await updateSitePage(slug!, {
        title:      data.title,
        content:    data.content,
        title_ar:   data.title_ar,
        content_ar: data.content_ar,
        title_ru:   data.title_ru,
        content_ru: data.content_ru,
      });
      await Swal.fire({ title: "Page Saved!", icon: "success", timer: 1800, showConfirmButton: false });
      navigate("/site-pages");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to save.", "error");
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

  if (loading) return (
    <>
      <PageBreadcrumb
        title={`Edit — ${meta.label}`}
        name={meta.label}
        breadCrumbItems={["IslamQA", "Site Pages", meta.label]}
      />
      <div className="flex items-center justify-center py-20 text-gray-400">
        <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
      </div>
    </>
  );

  return (
    <>
      <PageBreadcrumb
        title={`Edit — ${meta.label}`}
        name={meta.label}
        breadCrumbItems={["IslamQA", "Site Pages", meta.label]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 space-y-5">
            {/* Language tabs */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-fit">
              {tab("en", "English")}
              {tab("ru", "Roman Urdu")}
            </div>

            {/* English tab */}
            <div className={activeLang !== "en" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{meta.label} — English</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Page Title
                  </label>
                  <input
                    {...register("title")}
                    type="text"
                    placeholder={meta.label}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Content
                  </label>
                  <Controller name="content" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} />
                  )} />
                </div>
              </div>
            </div>

            {/* Roman Urdu tab */}
            <div className={activeLang !== "ru" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">{meta.labelRu || meta.label} — Roman Urdu</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Sahfe ka Unwaan
                  </label>
                  <input
                    {...register("title_ru")}
                    type="text"
                    placeholder={meta.labelRu}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Mazmoon
                  </label>
                  <Controller name="content_ru" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} />
                  )} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Actions</h5>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn bg-primary text-white flex-1 py-2"
                >
                  {isSubmitting
                    ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span>
                    : "Save Page"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/site-pages")}
                  className="btn border text-gray-600 dark:text-gray-300 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h6 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                <i className="mgc_information_line"></i> Content Tips
              </h6>
              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5">
                <li>• Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">&lt;h2&gt;</code> for section headings</li>
                <li>• Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">&lt;p&gt;</code> for paragraphs</li>
                <li>• Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">&lt;ul&gt;&lt;li&gt;</code> for lists</li>
                <li>• Leave empty to show the default static content</li>
              </ul>
            </div>
          </div>

        </div>
      </form>
    </>
  );
};

export default SitePagesEdit;
