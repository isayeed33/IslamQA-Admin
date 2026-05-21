import { useRef, useState, useEffect } from "react";
import RichTextarea from "../../components/RichTextarea";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { uploadKnowledgeFile, getCategories, ApiCategory } from "../../helpers/api/islamqa";

interface UploadFormData {
  name: string;
  description: string;
  categoryId: string;
  language: string;
  status: string;
}

const schema = yup.object().shape({
  name:        yup.string().required("File name is required"),
  description: yup.string(),
  categoryId:  yup.string(),
  language:    yup.string().required(),
  status:      yup.string().required(),
});

const languages = ["en", "id", "tr", "fr", "ur", "bn"];

const KnowledgeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UploadFormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "", categoryId: "", language: "en", status: "published" },
  });

  useEffect(() => {
    getCategories("en").then(setCategories).catch(console.error);
  }, []);

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      Swal.fire("Missing File", "Please select a file to upload.", "warning");
      return;
    }
    try {
      await uploadKnowledgeFile({
        file:        selectedFile,
        name:        data.name,
        description: data.description ?? "",
        language:    data.language,
        status:      data.status,
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      });
      await Swal.fire({ title: "File Uploaded!", text: "The knowledge file has been added successfully.", icon: "success", timer: 2000, showConfirmButton: false });
      navigate("/knowledge-files");
    } catch (err: any) {
      Swal.fire("Error", err?.message ?? "Failed to upload. Please try again.", "error");
    }
  };

  return (
    <>
      <PageBreadcrumb title="Upload Knowledge File" name="Upload File" breadCrumbItems={["IslamQA", "Knowledge Files", "Upload"]} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Select File</h5>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors group ${selectedFile ? 'border-success/50 bg-success/5' : 'border-gray-200 dark:border-gray-600 hover:border-primary/60'}`}
              >
                {selectedFile ? (
                  <>
                    <i className="mgc_file_line text-4xl text-success mb-3 block"></i>
                    <p className="text-sm font-medium text-success">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setSelectedFile(null); }} className="text-xs text-danger mt-2 hover:underline">Remove</button>
                  </>
                ) : (
                  <>
                    <i className="mgc_upload_2_line text-4xl text-gray-300 group-hover:text-primary mb-3 block transition-colors"></i>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Click to select a file</p>
                    <p className="text-xs text-gray-400">PDF, DOCX, XLSX, PPTX — Max 50MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx,.pptx" className="hidden"
                  onChange={e => setSelectedFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>

            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">File Details</h5>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Display Name <span className="text-danger">*</span></label>
                <input {...register("name")} type="text" className={`form-input w-full ${errors.name ? 'border-red-500' : ''}`} placeholder="e.g. Zakat Calculation Guide 2026" />
                {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Description</label>
                <RichTextarea {...register("description")} rows={3} className="form-input w-full" placeholder="Brief description of what this file contains..." />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Publish Settings</h5>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Status</label>
                <select {...register("status")} className="form-select w-full">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Language</label>
                <select {...register("language")} className="form-select w-full">
                  {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Category</label>
                <select {...register("categoryId")} className="form-select w-full">
                  <option value="">— None —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="btn bg-primary text-white flex-1 py-2">
                  {isSubmitting ? <span className="flex items-center justify-center gap-1"><i className="mgc_loading_2_line animate-spin"></i> Uploading...</span> : 'Upload File'}
                </button>
                <button type="button" onClick={() => navigate("/knowledge-files")} className="btn border text-gray-600 px-4">Cancel</button>
              </div>
            </div>

            <div className="card p-4 bg-warning/5 border-warning/20">
              <h6 className="text-sm font-semibold text-warning mb-2"><i className="mgc_warning_line me-1"></i>Guidelines</h6>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Only upload authentic Islamic resources</li>
                <li>• Ensure copyright permission before uploading</li>
                <li>• PDF format preferred for documents</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default KnowledgeUpload;
