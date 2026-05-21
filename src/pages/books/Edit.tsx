import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuillEditor from "../../components/QuillEditor";
import { useForm, Controller } from "react-hook-form";
import { PageBreadcrumb } from "../../components";
import SeoCard from "../../components/SeoCard";
import Swal from "sweetalert2";
import { getBook, updateBook, deleteBook } from "../../helpers/api/islamqa";

interface BookFormData {
  title: string;
  author: string;
  description: string;
  status: string;
  pdfUrl: string;
  title_ar:        string;
  author_ar:       string;
  description_ar:  string;
  metaTitle:       string;
  metaDescription: string;
  metaKeywords:    string;
  robots:          string;
}

const BooksEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<"en">("en");

  const { register, handleSubmit, control, watch, reset, formState: { isSubmitting } } = useForm<BookFormData>({
    defaultValues: { status: "draft", metaTitle: "", metaDescription: "", metaKeywords: "", robots: "index,follow" },
  });

  const status = watch("status");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getBook(Number(id), "en"),
    ]).then(([en]) => {
      reset({
        title:           en.title,
        author:          en.author,
        description:     en.description,
        status:          en.status,
        pdfUrl:          en.pdfUrl       ?? "",
        metaTitle:       en.metaTitle       ?? "",
        metaDescription: en.metaDescription ?? "",
        metaKeywords:    en.metaKeywords    ?? "",
        robots:          en.robots          ?? "index,follow",
      });
    }).catch(() => {
      Swal.fire("Error", "Failed to load book.", "error");
      navigate("/books");
    }).finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: BookFormData) => {
    try {
      await updateBook(Number(id), {
        title:           data.title,
        author:          data.author,
        description:     data.description,
        language:        "en",
        status:          data.status,
        pdfUrl:          data.pdfUrl ?? "",
        metaTitle:       data.metaTitle ?? "",
        metaDescription: data.metaDescription ?? "",
        metaKeywords:    data.metaKeywords ?? "",
        robots:          data.robots ?? "index,follow",
      });

      await Swal.fire({ title: "Book Updated!", icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/books");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to save.", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({ title: "Delete Book?", text: "The book and its PDF file will be permanently removed.", icon: "warning", showCancelButton: true, confirmButtonColor: "#E63535", confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await deleteBook(Number(id));
      await Swal.fire({ title: "Deleted!", icon: "success", timer: 1500, showConfirmButton: false });
      navigate("/books");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to delete.", "error");
    }
  };

  const tab = (lang: "en", label: string) => (
    <button
      type="button"
      onClick={() => setActiveLang(lang)}
      className={`px-5 py-2 text-sm font-medium transition-colors ${
        activeLang === lang
          ? "bg-primary text-white"
          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <>
        <PageBreadcrumb title={`Edit Book #${id}`} name={`Edit Book #${id}`} breadCrumbItems={["IslamQA", "Books", "Edit"]} />
        <div className="flex items-center justify-center py-20 text-gray-400">
          <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb title={`Edit Book #${id}`} name={`Edit Book #${id}`} breadCrumbItems={["IslamQA", "Books", "Edit"]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">

            {/* Language tabs */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-fit">
              {tab("en", "English")}
            </div>

            {/* English */}
            <div className="space-y-5">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200">Book Information</h5>
                  <span className="badge bg-info/10 text-info text-xs px-2 py-0.5 rounded ms-auto">ID: {id}</span>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Book Title</label>
                  <input {...register("title")} type="text" className="form-input w-full" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Author</label>
                  <input {...register("author")} type="text" className="form-input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Description</label>
                  <Controller name="description" control={control} render={({ field }) => (
                    <QuillEditor value={field.value || ""} onChange={field.onChange} />
                  )} />
                </div>
              </div>

              <div className="card p-5">
                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Files</h5>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Archive URL</label>
                <input
                  {...register("pdfUrl")}
                  type="url"
                  className="form-input w-full"
                  placeholder="https://archive.org/download/..."
                />
                <p className="text-xs text-gray-400 mt-1">Paste the Archive.org or any direct PDF link. This URL will be used as the Download button in the Clone.</p>
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
                  <i className="mgc_information_line"></i> English must be complete to publish.
                </p>
              )}
              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span> : "Save Changes"}
                </button>
                <button type="button" onClick={() => navigate("/books")} className="btn border text-gray-600 px-4">Cancel</button>
              </div>
            </div>

            <SeoCard register={register} watch={watch} />

            <div className="card p-4 bg-danger/5 border-danger/20">
              <h6 className="text-sm font-semibold text-danger mb-2">Danger Zone</h6>
              <button type="button" onClick={handleDelete} className="btn w-full border-danger text-danger hover:bg-danger hover:text-white text-sm py-2">
                <i className="mgc_delete_2_line me-1"></i> Delete Book
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default BooksEdit;
