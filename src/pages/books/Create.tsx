import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuillEditor from "../../components/QuillEditor";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PageBreadcrumb } from "../../components";
import SeoCard from "../../components/SeoCard";
import Swal from "sweetalert2";
import { createBook, updateBook } from "../../helpers/api/islamqa";

interface BookFormData {
  title: string;
  author: string;
  description: string;
  status: string;
  pdfUrl: string;
  title_ar:        string;
  author_ar:       string;
  description_ar:  string;
  title_ru:        string;
  author_ru:       string;
  description_ru:  string;
  metaTitle:       string;
  metaDescription: string;
  metaKeywords:    string;
  robots:          string;
}

const schema = yup.object().shape({
  title:          yup.string().required("Book title is required"),
  author:         yup.string().required("Author is required"),
  description:    yup.string().required("Description is required"),
  status:         yup.string().required(),
  pdfUrl:         yup.string().url("Must be a valid URL").required("Archive URL is required"),
  title_ar:        yup.string(),
  author_ar:       yup.string(),
  description_ar:  yup.string(),
  title_ru:        yup.string(),
  author_ru:       yup.string(),
  description_ru:  yup.string(),
  metaTitle:       yup.string().max(60),
  metaDescription: yup.string().max(160),
  metaKeywords:    yup.string(),
  robots:          yup.string(),
});

const BooksCreate = () => {
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [activeLang, setActiveLang] = useState<"en" | "ru">("en");

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<BookFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { status: "draft", pdfUrl: "", metaTitle: "", metaDescription: "", metaKeywords: "", robots: "index,follow" },
  });

  const status = watch("status");

  const onSubmit = async (data: BookFormData) => {
    if (data.status === "published") {
      const ruMissing = !data.title_ru || !data.description_ru;
      if (ruMissing) {
        setActiveLang("ru");
        Swal.fire("Roman Urdu Required", "Title and description must be filled in Roman Urdu before publishing.", "warning");
        return;
      }
    }

    try {
      const created = await createBook({
        title:           data.title,
        author:          data.author,
        description:     data.description,
        language:        "en",
        status:          data.status,
        pdfUrl:          data.pdfUrl,
        ...(coverFile ? { cover: coverFile } : {}),
        metaTitle:       data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        metaKeywords:    data.metaKeywords ?? "",
        robots:          data.robots ?? "index,follow",
      });

      if (data.title_ru || data.description_ru) {
        await updateBook(created.id, {
          title:       data.title_ru ?? "",
          author:      data.author_ru ?? "",
          description: data.description_ru ?? "",
          language:    "ru",
          status:      data.status,
        });
      }

      await Swal.fire({ title: "Book Uploaded!", text: "The book has been added to the library.", icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/books");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to upload. Please try again.", "error");
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
      <PageBreadcrumb title="Upload Book" name="Upload Book" breadCrumbItems={["IslamQA", "Books", "Upload"]} />

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
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Book Information</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Book Title <span className="text-danger">*</span></label>
                  <input {...register("title")} type="text" className={`form-input w-full ${errors.title ? "border-red-500" : ""}`} placeholder="e.g. Riyad as-Salihin" />
                  {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Author <span className="text-danger">*</span></label>
                  <input {...register("author")} type="text" className={`form-input w-full ${errors.author ? "border-red-500" : ""}`} placeholder="Author name..." />
                  {errors.author && <p className="text-xs text-danger mt-1">{errors.author.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Description <span className="text-danger">*</span></label>
                  <Controller name="description" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Brief description of the book..." error={!!errors.description} />
                  )} />
                  {errors.description && <p className="text-xs text-danger mt-1">{errors.description.message}</p>}
                </div>
              </div>

              <div className="card p-5">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Files</h5>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Archive URL <span className="text-danger">*</span>
                  </label>
                  <input
                    {...register("pdfUrl")}
                    type="url"
                    className={`form-input w-full ${errors.pdfUrl ? "border-red-500" : ""}`}
                    placeholder="https://archive.org/download/..."
                  />
                  {errors.pdfUrl && <p className="text-xs text-danger mt-1">{errors.pdfUrl.message}</p>}
                  <p className="text-xs text-gray-400 mt-1">Paste the Archive.org or any direct PDF link. This URL will be used as the Download button in the Clone.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Cover Image <span className="text-gray-400 text-xs">(optional)</span></label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${coverFile ? "border-success/50 bg-success/5" : "border-gray-200 dark:border-gray-600 hover:border-primary/50"}`}
                  >
                    {coverFile ? (
                      <>
                        <i className="mgc_image_line text-3xl text-success mb-2 block"></i>
                        <p className="text-sm font-medium text-success">{coverFile.name}</p>
                      </>
                    ) : (
                      <>
                        <i className="mgc_image_line text-3xl text-gray-400 mb-2 block"></i>
                        <p className="text-sm text-gray-500">Click to select cover image</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                      </>
                    )}
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] ?? null)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Roman Urdu */}
            <div className={activeLang !== "ru" ? "hidden" : "space-y-5"}>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Kitab ki Malumat (Roman Urdu)</h5>
                  {status === "published" && <span className="text-xs text-warning ms-auto">Nashr ke liye zaroori</span>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Kitab ka Naam {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <input {...register("title_ru")} type="text" className="form-input w-full" placeholder="Masalan: Riyad as-Salihin" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Musannif</label>
                  <input {...register("author_ru")} type="text" className="form-input w-full" placeholder="Musannif ka naam..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    Taaruf {status === "published" && <span className="text-danger">*</span>}
                  </label>
                  <Controller name="description_ru" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} placeholder="Kitab ka mukhtasar taaruf..." />
                  )} />
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
                </select>
              </div>
              {status === "published" && (
                <p className="text-xs text-warning mb-3 flex items-center gap-1">
                  <i className="mgc_information_line"></i> English and Roman Urdu must all be complete to publish.
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Uploading...</span> : "Upload Book"}
                </button>
                <button type="button" onClick={() => navigate("/books")} className="btn border text-gray-600 px-4">Cancel</button>
              </div>
            </div>

            <SeoCard register={register} watch={watch} />
          </div>
        </div>
      </form>
    </>
  );
};

export default BooksCreate;
