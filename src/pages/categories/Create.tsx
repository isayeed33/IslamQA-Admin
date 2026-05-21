import { useState, useEffect } from "react";
import QuillEditor from "../../components/QuillEditor";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PageBreadcrumb } from "../../components";
import SeoCard from "../../components/SeoCard";
import Swal from "sweetalert2";
import { createCategory, updateCategory, getCategories, ApiCategory } from "../../helpers/api/islamqa";

interface CategoryFormData {
  name: string;
  description: string;
  parentId: string;
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
  parentId:       yup.string(),
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

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [rootCategories, setRootCategories] = useState<ApiCategory[]>([]);
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { name: "", description: "", parentId: "", sortOrder: "0", name_ar: "", description_ar: "", name_ru: "", description_ru: "", metaTitle: "", metaDescription: "", metaKeywords: "", robots: "index,follow" },
  });

  useEffect(() => {
    getCategories("en").then(setRootCategories).catch(console.error);
  }, []);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const created = await createCategory({
        name:            data.name,
        description:     data.description ?? "",
        language:        "en",
        sortOrder:       Number(data.sortOrder) || 0,
        ...(data.parentId ? { parentId: Number(data.parentId) } : {}),
        metaTitle:       data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        metaKeywords:    data.metaKeywords ?? "",
        robots:          data.robots ?? "index,follow",
      });

      if (data.name_ru) {
        await updateCategory(created.id, {
          name:        data.name_ru,
          description: data.description_ru ?? "",
          language:    "ru",
        });
      }

      await Swal.fire({ title: "Category Created!", text: `"${data.name}" has been added.`, icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/categories");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to create. Please try again.", "error");
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
      <PageBreadcrumb title="Create Category" name="Create Category" breadCrumbItems={["IslamQA", "Categories", "Create"]} />

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
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Category Details</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Name <span className="text-danger">*</span></label>
                  <input
                    {...register("name")}
                    type="text"
                    className={`form-input w-full ${errors.name ? "border-red-500" : ""}`}
                    placeholder="e.g. Worship & Prayer"
                  />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Description</label>
                  <Controller name="description" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Brief description of what this category covers..." />
                  )} />
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
                  <input {...register("name_ru")} type="text" className="form-input w-full" placeholder="Masalan: Ibadat aur Namaz" />
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

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Parent Category</label>
                <select {...register("parentId")} className="form-select w-full">
                  <option value="">— Root (no parent) —</option>
                  {rootCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Leave empty to create a root category</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Sort Order</label>
                <input {...register("sortOrder")} type="number" className="form-input w-full" min="0" placeholder="0" />
                <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Creating...</span> : "Create Category"}
                </button>
                <button type="button" onClick={() => navigate("/categories")} className="btn border text-gray-600 px-4">Cancel</button>
              </div>
            </div>

            <SeoCard register={register} watch={watch} />

            <div className="card p-4 bg-primary/5 border-primary/20">
              <h6 className="text-sm font-semibold text-primary mb-2"><i className="mgc_information_line me-1"></i>Tips</h6>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Root categories appear in the main navigation</li>
                <li>• Subcategories help organize questions within a root</li>
                <li>• Slugs are auto-generated from the name</li>
                <li>• Adding Arabic and Roman Urdu helps multilingual users</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CategoryCreate;
