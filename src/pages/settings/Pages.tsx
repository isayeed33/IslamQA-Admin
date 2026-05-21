import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../components";
import Swal from "sweetalert2";
import { getPageSettings, updatePageSettings } from "../../helpers/api/islamqa";

interface PageEntry {
  key: string;
  label: string;
  description: string;
  icon: string;
}

const PAGE_ENTRIES: PageEntry[] = [
  { key: "page_faq_visible",     label: "FAQ",            description: "Frequently Asked Questions page", icon: "mgc_question_line" },
  { key: "page_privacy_visible", label: "Privacy Policy", description: "Privacy policy page",             icon: "mgc_shield_line" },
  { key: "page_terms_visible",   label: "Terms of Use",   description: "Terms of use page",               icon: "mgc_document_line" },
  { key: "page_about_visible",   label: "About Us",       description: "About the organisation page",     icon: "mgc_information_line" },
  { key: "page_contact_visible", label: "Contact Us",     description: "Contact page",                    icon: "mgc_mail_line" },
  { key: "page_donate_visible",  label: "Donate",         description: "Donation / payment page",         icon: "mgc_heart_line" },
];

const PageVisibility = () => {
  const [settings, setSettings] = useState<Record<string, boolean>>({});
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);

  useEffect(() => {
    getPageSettings()
      .then(setSettings)
      .catch(() => Swal.fire("Error", "Failed to load settings.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await updatePageSettings(settings);
      Swal.fire({ title: "Saved!", icon: "success", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageBreadcrumb title="Page Visibility" name="Page Visibility" breadCrumbItems={["IslamQA", "Settings", "Page Visibility"]} />

      <div className="card p-6 max-w-2xl">
        <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Show / Hide Pages in Clone</h5>
        <p className="text-sm text-gray-400 mb-6">Toggle which pages are accessible on the public website.</p>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <i className="mgc_loading_2_line animate-spin text-2xl mr-2"></i> Loading...
          </div>
        ) : (
          <div className="space-y-3">
            {PAGE_ENTRIES.map(({ key, label, description, icon }) => {
              const visible = settings[key] !== false;
              return (
                <label
                  key={key}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    visible
                      ? "border-primary/30 bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  }`}
                >
                  <span className={`flex items-center justify-center w-9 h-9 rounded-lg text-lg ${visible ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>
                    <i className={icon}></i>
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</p>
                    <p className="text-xs text-gray-400">{description}</p>
                  </div>
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={visible}
                      onChange={() => toggle(key)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${visible ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${visible ? "translate-x-5" : "translate-x-0"}`}></div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        {!loading && (
          <div className="mt-6">
            <button onClick={save} disabled={saving} className="btn bg-primary text-white px-6 py-2">
              {saving ? <span className="flex items-center gap-1.5"><i className="mgc_loading_2_line animate-spin"></i> Saving...</span> : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PageVisibility;
