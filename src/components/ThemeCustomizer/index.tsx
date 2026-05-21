import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { changeLayoutTheme } from "../../redux/actions";
import * as layoutConstants from "../../constants/layout";

interface ThemeCustomizerProps {
  handleRightSideBar: () => void;
}

const ThemeCustomizer = ({ handleRightSideBar }: ThemeCustomizerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { layoutTheme } = useSelector((state: RootState) => ({ layoutTheme: state.Layout.layoutTheme }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="font-semibold text-gray-700 dark:text-gray-200">Theme Settings</h5>
        <button onClick={handleRightSideBar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <i className="mgc_close_line text-xl"></i>
        </button>
      </div>

      <div className="mb-6">
        <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Color Mode</h6>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch(changeLayoutTheme(layoutConstants.LayoutTheme.THEME_LIGHT))}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${layoutTheme === 'light' ? 'border-primary text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
          >
            <i className="mgc_sun_line text-2xl"></i>
            <span className="text-xs font-medium">Light</span>
          </button>
          <button
            onClick={() => dispatch(changeLayoutTheme(layoutConstants.LayoutTheme.THEME_DARK))}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${layoutTheme === 'dark' ? 'border-primary text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
          >
            <i className="mgc_moon_line text-2xl"></i>
            <span className="text-xs font-medium">Dark</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">☪</span>
          <span className="font-semibold text-green-800 dark:text-green-300">IslamQA Admin</span>
        </div>
        <p className="text-xs text-green-600 dark:text-green-400">Manage all your Islamic Q&A content from one place.</p>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
