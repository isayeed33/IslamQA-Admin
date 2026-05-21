import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageBreadcrumb } from "../../components";
import { getSitePages, getFaqs, ApiSitePage, ApiFaq } from "../../helpers/api/islamqa";

const PAGE_META: Record<string, { label: string; icon: string; description: string }> = {
  about:   { label: "About Us",       icon: "mgc_information_line", description: "Information about the website and its mission" },
  terms:   { label: "Terms of Use",   icon: "mgc_document_2_line",  description: "Legal terms governing use of the website" },
  privacy: { label: "Privacy Policy", icon: "mgc_shield_line",      description: "How we collect and protect user data" },
};

const SitePagesList = () => {
  const [pages, setPages] = useState<ApiSitePage[]>([]);
  const [faqCount, setFaqCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSitePages(),
      getFaqs({ status: "all" }),
    ])
      .then(([p, faqs]) => { setPages(p); setFaqCount(faqs.length); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageBreadcrumb title="Site Pages" name="Page Content" breadCrumbItems={["IslamQA", "Site Pages"]} />

      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h5 className="font-semibold text-gray-700 dark:text-gray-200">Page Content</h5>
            <p className="text-xs text-gray-400 mt-0.5">Edit the content for static pages across the website</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {pages.map((page) => {
              const meta = PAGE_META[page.slug] ?? { label: page.slug, icon: "mgc_document_2_line", description: "" };
              const hasAr = !!page.title_ar;
              const hasEn = !!page.title;
              return (
                <div key={page.slug} className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <i className={`${meta.icon} text-lg`}></i>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{meta.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{meta.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
                    <span className={`badge text-xs px-2 py-0.5 rounded ${hasEn ? "bg-success/10 text-success" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
                      EN {hasEn ? "✓" : "empty"}
                    </span>
                    <span className={`badge text-xs px-2 py-0.5 rounded ${hasAr ? "bg-success/10 text-success" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
                      AR {hasAr ? "✓" : "empty"}
                    </span>
                    <Link
                      to={`/site-pages/${page.slug}/edit`}
                      className="btn bg-primary text-white px-4 py-1.5 text-xs flex items-center gap-1"
                    >
                      <i className="mgc_edit_2_line"></i> Edit
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* FAQs row */}
            <div className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <i className="mgc_question_line text-lg"></i>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">FAQs</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Frequently asked questions — {faqCount !== null ? `${faqCount} entries` : "loading..."}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to="/faqs/create" className="btn border text-gray-500 hover:text-primary px-3 py-1.5 text-xs flex items-center gap-1">
                  <i className="mgc_add_line"></i> Add
                </Link>
                <Link to="/faqs" className="btn bg-primary text-white px-4 py-1.5 text-xs flex items-center gap-1">
                  <i className="mgc_list_check_line"></i> Manage
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SitePagesList;
