import React from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { changeSideBarType } from "../redux/actions";
import * as LayoutConstants from "../constants/layout";
import AppMenu from "./Menu";
import { getMenuItems } from "../helpers/menu";

const IslamQALogo = ({ condensed }: { condensed?: boolean }) => (
  <div className={`flex items-center gap-2.5 ${condensed ? 'justify-center' : ''}`}>
    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-primary text-white font-bold text-lg shadow-sm">
      ☪
    </div>
    {!condensed && (
      <div className="overflow-hidden">
        <div className="text-base font-bold text-gray-800 dark:text-white leading-tight whitespace-nowrap">IslamQA</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Admin Panel</div>
      </div>
    )}
  </div>
);

const HoverMenuToggler = () => {
  const { sideBarType } = useSelector((state: RootState) => ({ sideBarType: state.Layout.sideBarType }));
  const dispatch = useDispatch<AppDispatch>();

  function toggleHoverMenu() {
    if (sideBarType === LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVER) {
      dispatch(changeSideBarType(LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVERACTIVE));
    } else if (sideBarType === LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVERACTIVE) {
      dispatch(changeSideBarType(LayoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_HOVER));
    }
  }

  return (
    <button id="button-hover-toggle" className="absolute top-5 end-2 rounded-full p-1.5" onClick={toggleHoverMenu}>
      <span className="sr-only">Menu Toggle Button</span>
      <i className="mgc_round_line text-xl"></i>
    </button>
  );
};

interface LeftSideBarProps {
  isCondensed: boolean;
  isLight?: boolean;
  hideLogo?: boolean;
}

const LeftSideBar = ({ isCondensed }: LeftSideBarProps) => {
  return (
    <React.Fragment>
      <div className="app-menu">
        <Link to="/" className="logo-box">
          <div className="logo-light">
            <IslamQALogo condensed={isCondensed} />
          </div>
          <div className="logo-dark">
            <IslamQALogo condensed={isCondensed} />
          </div>
        </Link>

        <HoverMenuToggler />

        <SimpleBar className="srcollbar" id="leftside-menu-container">
          <AppMenu menuItems={getMenuItems()} />

          <div className="my-8 mx-4">
            <div className="help-box p-4 bg-primary/10 text-center rounded-lg">
              <div className="text-2xl mb-2">☪</div>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">IslamQA Admin</h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Manage Islamic knowledge content</p>
              <a href="https://islamqa.info" target="_blank" rel="noreferrer" className="btn btn-sm bg-primary text-white text-xs">Visit Site</a>
            </div>
          </div>
        </SimpleBar>
      </div>
    </React.Fragment>
  );
};

export default LeftSideBar;
