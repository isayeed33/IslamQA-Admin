import { useState, useEffect } from "react";
import QuillEditor from "../../components/QuillEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PageBreadcrumb } from "../../components";
import SeoCard from "../../components/SeoCard";
import Swal from "sweetalert2";
import { getCategory, updateCategory, deleteCategory } from "../../helpers/api/islamqa";

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  sortOrder: string;
  name_ar:         string;
  description_ar:  string;
  name_ru:         string;
  description_ru:  string;
  metaTitle:       string;
  metaDescription: string;
  metaKeywords:    string;
  robots:          string;
}

const schema = yup.object().shape({
  name:           yup.string().required("Name is required"),
  description:    yup.string(),
  slug:           yup.string().required("Slug is required"),
  sortOrder:      yup.string(),
  name_ar:         yup.string(),
  description_ar:  yup.string(),
  name_ru:         yup.string(),
  description_ru:  yup.string(),
  metaTitle:       yup.string().max(60),
  metaDescription: yup.string().max(160),
  metaKeywords:    yup.string(),
  robots:          yup.string(),
});

const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const { register, handleSubmit, control, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { name: "", description: "", slug: "", sortOrder: "0", name_ar: "", description_ar: "", name_ru: "", description_ru: "", metaTitle: "", metaDescription: "", metaKeywords: "", robots: "index,follow" },
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getCategory(Number(id), "en"),
      getCategory(Number(id), "ru").catch(() => null),
    ]).then(([en, ru]) => {
      reset({
        name:            en.name,
        description:     en.description ?? "",
        slug:            en.slug,
        sortOrder:       "0",
        name_ru:         ru?.name        ?? "",
        description_ru:  ru?.description ?? "",
        metaTitle:       en.metaTitle       ?? "",
        metaDescription: en.metaDescription ?? "",
        metaKeywords:    en.metaKeywords    ?? "",
        robots:          en.robots          ?? "index,follow",
      });
    }).catch(() => {
      Swal.fire("Error", "Failed to load category.", "error");
      navigate("/categories");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    setValue("slug", slug);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategory(Number(id), {
        name:            data.name,
        description:     data.description ?? "",
        slug:            data.slug,
        language:        "en",
        metaTitle:       data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        metaKeywords:    data.metaKeywords ?? "",
        robots:          data.robots ?? "index,follow",
      });

      await updateCategory(Number(id), {
        name:        data.name_ru ?? "",
        description: data.description_ru ?? "",
        language:    "ru",
      });

      await Swal.fire({ title: "Category Updated!", text: `"${data.name}" has been saved.`, icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/categories");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to save.", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({ title: "Delete Category?", text: "All subcategories may be affected.", icon: "warning", showCancelButton: true, confirmButtonColor: "#E63535", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await deleteCategory(Number(id));
      await Swal.fire({ title: "Deleted!", icon: "success", timer: 1500, showConfirmButton: false });
      navigate("/categories");
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
        <PageBreadcrumb title={`Edit Category #${id}`} name="Edit Category" breadCrumbItems={["IslamQA", "Categories", "Edit"]} />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb title={`Edit Category #${id}`} name="Edit Category" breadCrumbItems={["IslamQA", "Categories", "Edit"]} />

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
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Category Details</h5>
                  <span className="badge bg-info/10 text-info text-xs px-2 py-0.5 rounded ms-auto">ID: {id}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Name <span className="text-danger">*</span></label>
                  <input
                    {...register("name")}
                    type="text"
                    className={`form-input w-full ${errors.name ? "border-red-500" : ""}`}
                    onChange={(e) => { register("name").onChange(e); handleNameChange(e); }}
                  />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Description</label>
                  <Controller name="description" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Brief description of what this category covers..." />
                  )} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Slug <span className="text-danger">*</span></label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-2 rounded-l border border-r-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500">islamqa.info/</span>
                    <input {...register("slug")} type="text" className={`form-input rounded-l-none flex-1 ${errors.slug ? "border-red-500" : ""}`} />
                  </div>
                  {errors.slug && <p className="text-xs text-danger mt-1">{errors.slug.message}</p>}
                </div>
              </div>
            </div>

            {/* Roman Urdu */}
            <div className={activeLang !== "ru" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Mawzoo ki Tafseelat (Roman Urdu)</h5>
                  <span className="text-xs text-gray-400 ms-auto">Ikhtiyari — Roman Urdu support ke liye</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Naam</label>
                  <input {...register("name_ru")} type="text" className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Taaruf</label>
                  <Controller name="description_ru" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Is mawzoo ka mukhtasar taaruf..." />
                  )} />
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Settings</h5>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Sort Order</label>
                <input {...register("sortOrder")} type="number" className="form-input w-full" min="0" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span> : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate("/categories")} className="btn border text-gray-600 px-4">Cancel</button>
              </div>
            </div>

            <SeoCard register={register} watch={watch} />

            <div className="card p-4 border-danger/30 bg-danger/5">
              <h6 className="text-sm font-semibold text-danger mb-2">Danger Zone</h6>
              <button type="button" onClick={handleDelete} className="btn w-full border-danger text-danger hover:bg-danger hover:text-white text-sm py-2">
                <i className="mgc_delete_2_line me-1"></i> Delete this category
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CategoryEdit;
