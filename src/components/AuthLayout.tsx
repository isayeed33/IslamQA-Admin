import { Link } from "react-router-dom";

interface AuthLayoutProps {
  authTitle?: string;
  helpText?: string;
  bottomLinks?: any;
  children?: any;
  hasThirdPartyLogin?: boolean;
}

const AuthLayout = ({ authTitle, helpText, bottomLinks, children, hasThirdPartyLogin }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="card overflow-hidden rounded-xl shadow-xl">
          <div className="p-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white text-xl font-bold">☪</div>
              <div>
                <div className="text-lg font-bold text-gray-800 dark:text-white leading-tight">IslamQA</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</div>
              </div>
            </Link>

            {authTitle && <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{authTitle}</h4>}
            {helpText && <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{helpText}</p>}

            {children}

            {hasThirdPartyLogin && (
              <>
                <div className="flex items-center my-5">
                  <div className="flex-auto mt-px border-t border-dashed border-gray-200 dark:border-slate-700"></div>
                  <div className="mx-4 text-xs text-gray-400">Or continue with</div>
                  <div className="flex-auto mt-px border-t border-dashed border-gray-200 dark:border-slate-700"></div>
                </div>
                <div className="flex gap-3 justify-center mb-5">
                  <button className="btn border-light text-gray-400 dark:border-slate-700 flex-1">
                    <span className="flex justify-center items-center gap-2">
                      <i className="mgc_google_line text-danger text-xl"></i>
                      <span>Google</span>
                    </span>
                  </button>
                  <button className="btn border-light text-gray-400 dark:border-slate-700 flex-1">
                    <span className="flex justify-center items-center gap-2">
                      <i className="mgc_github_line text-info text-xl"></i>
                      <span>GitHub</span>
                    </span>
                  </button>
                </div>
              </>
            )}

            {bottomLinks}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
