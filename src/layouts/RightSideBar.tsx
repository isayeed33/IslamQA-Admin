import { ScrollToTop, ThemeCustomizer } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { hideRightSidebar, showRightSidebar } from "../redux/actions";
import { OffcanvasLayout } from "../components/HeadlessUI";

const RightSideBar = () => {
  const dispatch = useDispatch();
  const { isOpenRightSideBar } = useSelector((state: RootState) => ({ isOpenRightSideBar: state.Layout.isOpenRightSideBar }));

  const handleRightSideBar = () => {
    if (isOpenRightSideBar) dispatch(hideRightSidebar());
    else dispatch(showRightSidebar());
  };

  return (
    <>
      <ScrollToTop />
      <div className="fixed end-0 bottom-20">
        <button type="button" className="bg-white rounded-s-full shadow-lg p-2.5 ps-3 transition-all dark:bg-slate-800" onClick={handleRightSideBar}>
          <span className="sr-only">Settings</span>
          <span className="flex items-center justify-center">
            <i className="mgc_settings_4_line text-2xl"></i>
          </span>
        </button>
      </div>
      <OffcanvasLayout open={isOpenRightSideBar} toggleOffcanvas={handleRightSideBar} sizeClassName="w-80 max-w-xs">
        <ThemeCustomizer handleRightSideBar={handleRightSideBar} />
      </OffcanvasLayout>
    </>
  );
};

export default RightSideBar;
