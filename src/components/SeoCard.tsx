import type { UseFormRegister, UseFormWatch } from "react-hook-form";

interface SeoCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
}

/**
 * Reusable SEO sidebar card.
 * Expects the parent form to have fields:
 *   metaTitle, metaDescription, metaKeywords, robots
 */
const SeoCard = ({ register, watch }: SeoCardProps) => {
  const metaTitle       = watch("metaTitle")       ?? "";
  const metaDescription = watch("metaDescription") ?? "";

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <i className="mgc_search_2_line text-primary text-base"></i>
        <h5 className="font-semibold text-gray-700 dark:text-gray-200">SEO</h5>
      </div>

      {/* Meta Title */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Meta Title</label>
          <span className={`text-xs ${metaTitle.length > 60 ? "text-danger" : "text-gray-400"}`}>
            {metaTitle.length}/60
          </span>
        </div>
        <input
          {...register("metaTitle")}
          type="text"
          maxLength={60}
          placeholder="Leave blank to use the content title"
          className="form-input w-full text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">Shown in browser tabs and search results</p>
      </div>

      {/* Meta Description */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Meta Description</label>
          <span className={`text-xs ${metaDescription.length > 160 ? "text-danger" : "text-gray-400"}`}>
            {metaDescription.length}/160
          </span>
        </div>
        <textarea
          {...register("metaDescription")}
          rows={3}
          maxLength={160}
          placeholder="Brief description for search engines…"
          className="form-input w-full text-sm resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">Appears below the title in search results</p>
      </div>

      {/* Meta Keywords */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Keywords</label>
        <input
          {...register("metaKeywords")}
          type="text"
          placeholder="islam, fiqh, prayer, …"
          className="form-input w-full text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">Comma-separated (optional)</p>
      </div>

      {/* Robots */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Robots</label>
        <select {...register("robots")} className="form-select w-full text-sm">
          <option value="index,follow">index, follow (default)</option>
          <option value="noindex,follow">noindex, follow</option>
          <option value="index,nofollow">index, nofollow</option>
          <option value="noindex,nofollow">noindex, nofollow</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">Controls how search engines crawl this page</p>
      </div>
    </div>
  );
};

export default SeoCard;
