import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import { useViewPort } from "../hooks";
import { changeLayoutTheme, changeSideBarType } from "../redux/actions";
import { LayoutTheme, SideBarType } from "../constants/layout";
import { TopBarSearch, MaximizeScreen, NotificationDropdown, ProfileDropDown } from "../components";
import type { NotificationItem } from "../components/NotificationDropDown";
import type { ProfileMenuItem } from "../components/ProfileDropDown";

const notifications: NotificationItem[] = [
  { id: 1, text: 'New Question Submitted', subText: 'A user submitted a new question for review', icon: 'mgc_question_line text-lg', bgColor: 'primary', createdAt: new Date(Date.now() - 15 * 60000) },
  { id: 2, text: 'Answer Published', subText: 'Q#475508 answer was published successfully', icon: 'mgc_check_circle_line text-lg', bgColor: 'success', createdAt: new Date(Date.now() - 90 * 60000) },
  { id: 3, text: 'Article Needs Review', subText: 'New article pending editorial review', icon: 'mgc_news_line text-lg', bgColor: 'warning', createdAt: new Date(Date.now() - 180 * 60000) },
];

const profileMenus: ProfileMenuItem[] = [
  { label: 'My Profile', icon: 'mgc_user_3_line me-2', redirectTo: '/settings' },
  { label: 'Settings', icon: 'mgc_settings_3_line me-2', redirectTo: '/settings' },
];

const Topbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useViewPort();
  const { layoutTheme, sideBarType } = useSelector((state: RootState) => ({ layoutTheme: state.Layout.layoutTheme, sideBarType: state.Layout.sideBarType }));

  const handleLeftMenuCallBack = () => {
    if (width < 1140) {
      if (sideBarType === SideBarType.LEFT_SIDEBAR_TYPE_MOBILE) {
        showLeftSideBarBackdrop();
        document.getElementsByTagName('html')[0].classList.add('sidenav-enable');
      } else {
        dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
      }
    } else if (sideBarType === SideBarType.LEFT_SIDEBAR_TYPE_SMALL) {
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_DEFAULT));
    } else {
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_SMALL));
    }
  };

  function showLeftSideBarBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'backdrop';
    backdrop.className = 'transition-all fixed inset-0 z-40 bg-gray-900 bg-opacity-50 dark:bg-opacity-80';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', function () {
      document.getElementsByTagName('html')[0].classList.remove('sidenav-enable');
      dispatch(changeSideBarType(SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
      const el = document.getElementById('backdrop');
      if (el) document.body.removeChild(el);
    });
  }

  const toggleDarkMode = () => {
    dispatch(changeLayoutTheme(layoutTheme === 'dark' ? LayoutTheme.THEME_LIGHT : LayoutTheme.THEME_DARK));
  };

  return (
    <header className="app-header flex items-center px-4 gap-3">
      <button id="button-toggle-menu" className="nav-link p-2" onClick={handleLeftMenuCallBack}>
        <span className="sr-only">Menu Toggle</span>
        <span className="flex items-center justify-center h-6 w-6">
          <i className="mgc_menu_line text-xl"></i>
        </span>
      </button>

      {/* Brand on mobile */}
      <Link to="/" className="logo-box lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">☪</div>
          <span className="font-bold text-gray-800 dark:text-white">IslamQA</span>
        </div>
      </Link>

      <TopBarSearch />

      <div className="flex items-center ms-auto gap-1">
        <MaximizeScreen />

        <button id="light-dark-mode" type="button" className="nav-link p-2" onClick={toggleDarkMode}>
          <span className="sr-only">Toggle Dark Mode</span>
          <span className="flex items-center justify-center h-6 w-6">
            <i className={`mgc_${layoutTheme === 'dark' ? 'sun' : 'moon'}_line text-xl`}></i>
          </span>
        </button>

        <NotificationDropdown notifications={notifications} />

        <ProfileDropDown menuItems={profileMenus} />
      </div>
    </header>
  );
};

export default Topbar;
