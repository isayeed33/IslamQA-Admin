import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { PageBreadcrumb } from "../../components";
import { getPageSettings, updatePageSettings } from "../../helpers/api/islamqa";
import Swal from "sweetalert2";

interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  defaultLanguage: string;
  questionsPerPage: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
}

interface NotificationSettings {
  emailNewQuestion: boolean;
  emailNewAnswer: boolean;
  emailWeeklyReport: boolean;
  notifyOnPublish: boolean;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
}

const languages = ["en", "id", "tr", "fr", "ur", "bn"];

const Settings = () => {
  const { register: regGeneral, handleSubmit: handleGeneral, formState: { isSubmitting: isSavingGeneral } } = useForm<GeneralSettings>({
    defaultValues: {
      siteName: "IslamQA",
      siteUrl: "https://islamqa.info",
      defaultLanguage: "en",
      questionsPerPage: "20",
      allowRegistration: false,
      maintenanceMode: false,
    },
  });

  const { register: regNotif, handleSubmit: handleNotif, formState: { isSubmitting: isSavingNotif } } = useForm<NotificationSettings>({
    defaultValues: {
      emailNewQuestion: true,
      emailNewAnswer: false,
      emailWeeklyReport: true,
      notifyOnPublish: true,
    },
  });

  const { register: regSEO, handleSubmit: handleSEO, formState: { isSubmitting: isSavingSEO } } = useForm<SEOSettings>({
    defaultValues: {
      metaTitle: "IslamQA — Islamic Q&A Resource",
      metaDescription: "Find answers to your Islamic questions based on Quran and Sunnah from IslamQA, the world's leading Islamic Q&A website.",
      googleAnalyticsId: "",
    },
  });

  const saveSettings = async (section: string) => {
    await new Promise(r => setTimeout(r, 600));
    await Swal.fire({ title: `${section} Saved!`, icon: "success", timer: 1800, showConfirmButton: false });
  };

  // ── Content Sections (newsletter + app download) — real API ──────────────────
  const [sections, setSections] = useState({
    section_newsletter_visible: true,
    section_app_download_visible: true,
  });
  const [savingSections, setSavingSections] = useState(false);

  useEffect(() => {
    getPageSettings()
      .then((data) => {
        setSections({
          section_newsletter_visible:   data.section_newsletter_visible   ?? true,
          section_app_download_visible: data.section_app_download_visible ?? true,
        });
      })
      .catch(() => {}); // silently keep defaults if API is down
  }, []);

  const saveContentSections = async () => {
    setSavingSections(true);
    try {
      await updatePageSettings(sections);
      await Swal.fire({ title: "Content Sections Saved!", icon: "success", timer: 1800, showConfirmButton: false });
    } catch {
      Swal.fire("Error", "Failed to save. Please try again.", "error");
    } finally {
      setSavingSections(false);
    }
  };

  return (
    <>
      <PageBreadcrumb title="Settings" name="Settings" breadCrumbItems={["IslamQA", "Administration", "Settings"]} />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {/* General Settings */}
          <div className="card p-5">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <i className="mgc_settings_2_line text-primary"></i>
              General Settings
            </h5>

            <form onSubmit={handleGeneral((data) => saveSettings("General Settings"))}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Site Name</label>
                <input {...regGeneral("siteName")} type="text" className="form-input w-full" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Site URL</label>
                <input {...regGeneral("siteUrl")} type="url" className="form-input w-full" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Default Language</label>
                <select {...regGeneral("defaultLanguage")} className="form-select w-full">
                  {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Questions Per Page</label>
                <select {...regGeneral("questionsPerPage")} className="form-select w-full">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Allow Public Registration</p>
                  <p className="text-xs text-gray-400 mt-0.5">Let users sign up to ask questions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input {...regGeneral("allowRegistration")} type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="mb-5 flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Maintenance Mode</p>
                  <p className="text-xs text-gray-400 mt-0.5">Show maintenance page to visitors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input {...regGeneral("maintenanceMode")} type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:bg-warning after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <button type="submit" disabled={isSavingGeneral} className="btn bg-primary text-white px-5 py-2">
                {isSavingGeneral ? 'Saving...' : 'Save General Settings'}
              </button>
            </form>
          </div>

          {/* SEO Settings */}
          <div className="card p-5">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <i className="mgc_search_line text-info"></i>
              SEO Settings
            </h5>

            <form onSubmit={handleSEO((data) => saveSettings("SEO Settings"))}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Default Meta Title</label>
                <input {...regSEO("metaTitle")} type="text" className="form-input w-full" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Default Meta Description</label>
                <textarea {...regSEO("metaDescription")} rows={3} className="form-input w-full" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">Google Analytics ID</label>
                <input {...regSEO("googleAnalyticsId")} type="text" className="form-input w-full" placeholder="G-XXXXXXXXXX" />
              </div>

              <button type="submit" disabled={isSavingSEO} className="btn bg-info text-white px-5 py-2">
                {isSavingSEO ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="card p-5">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
              <i className="mgc_notification_line text-warning"></i>
              Notification Settings
            </h5>

            <form onSubmit={handleNotif((data) => saveSettings("Notification Settings"))}>
              <div className="space-y-3 mb-5">
                {[
                  { field: "emailNewQuestion" as const, label: "Email on New Question", desc: "Get notified when a new question is submitted" },
                  { field: "emailNewAnswer" as const, label: "Email on New Answer", desc: "Get notified when a new answer is added" },
                  { field: "emailWeeklyReport" as const, label: "Weekly Report Email", desc: "Receive a weekly summary of site activity" },
                  { field: "notifyOnPublish" as const, label: "Notify on Content Publish", desc: "Dashboard notification when content goes live" },
                ].map(({ field, label, desc }) => (
                  <div key={field} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input {...regNotif(field)} type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={isSavingNotif} className="btn bg-warning text-white px-5 py-2">
                {isSavingNotif ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </form>
          </div>
          {/* Content Sections */}
          <div className="card p-5">
            <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
              <i className="mgc_layout_2_line text-success"></i>
              Content Sections
            </h5>
            <p className="text-xs text-gray-400 mb-4">Toggle homepage footer sections on or off for the clone site.</p>

            <div className="space-y-3 mb-5">
              {[
                {
                  key: "section_newsletter_visible" as const,
                  label: "Newsletter Section",
                  desc: "Show the email newsletter sign-up card in the footer",
                  icon: "mgc_mail_line",
                },
                {
                  key: "section_app_download_visible" as const,
                  label: "Mobile App Download Section",
                  desc: "Show the App Store / Google Play download card in the footer",
                  icon: "mgc_cellphone_line",
                },
              ].map(({ key, label, desc, icon }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-start gap-3">
                    <i className={`${icon} text-success text-lg mt-0.5`}></i>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ms-4 shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={sections[key]}
                      onChange={(e) => setSections(prev => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:bg-success after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={saveContentSections}
              disabled={savingSections}
              className="btn bg-success text-white px-5 py-2"
            >
              {savingSections ? 'Saving...' : 'Save Content Sections'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Admin Info */}
          <div className="card p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-3xl">☪</span>
              </div>
              <h5 className="font-semibold text-gray-700 dark:text-gray-200">IslamQA Admin</h5>
              <p className="text-xs text-gray-400 mt-1">admin@islamqa.info</p>
              <span className="badge bg-primary/10 text-primary text-xs px-3 py-1 rounded-full mt-2">Super Admin</span>
            </div>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-medium text-gray-700 dark:text-gray-200">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="font-medium text-gray-700 dark:text-gray-200">2026-04-17</span>
              </div>
              <div className="flex justify-between">
                <span>Environment</span>
                <span className="badge bg-success/10 text-success text-xs px-2 py-0.5 rounded">Production</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-5">
            <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Database Overview</h6>
            <div className="space-y-2">
              {[
                { label: "Questions", value: "475,508", color: "primary" },
                { label: "Answers", value: "452,316", color: "success" },
                { label: "Essential Answers", value: "1,847", color: "warning" },
                { label: "Articles", value: "312", color: "info" },
                { label: "Books", value: "87", color: "secondary" },
                { label: "Knowledge Files", value: "1,204", color: "danger" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold text-${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card p-5 bg-danger/5 border-danger/20">
            <h6 className="text-sm font-semibold text-danger mb-3">Danger Zone</h6>
            <div className="space-y-2">
              <button
                onClick={() => Swal.fire({ title: "Clear Cache?", text: "This will clear all cached data.", icon: "warning", showCancelButton: true, confirmButtonColor: "#E63535" })}
                className="btn w-full border-danger text-danger hover:bg-danger hover:text-white text-xs py-2"
              >
                <i className="mgc_delete_2_line me-1"></i> Clear System Cache
              </button>
              <button
                onClick={() => Swal.fire({ title: "Reset Settings?", text: "All settings will be reverted to defaults.", icon: "warning", showCancelButton: true, confirmButtonColor: "#E63535" })}
                className="btn w-full border-danger text-danger hover:bg-danger hover:text-white text-xs py-2"
              >
                <i className="mgc_refresh_1_line me-1"></i> Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
