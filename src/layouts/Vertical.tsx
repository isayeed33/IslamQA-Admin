import React, { ReactNode, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import * as layoutConstants from "../constants/layout";
import { useViewPort } from "../hooks";
import { changeHTMLAttribute } from "../utils/layout";
import { changeSideBarType } from "../redux/actions";
import { Preloader } from "../components";

const Topbar = React.lazy(() => import("./Topbar"));
const LeftSideBar = React.lazy(() => import("./LeftSideBar"));
const Footer = React.lazy(() => import("./Footer"));
const RightSideBar = React.lazy(() => import("./RightSideBar"));

interface VerticalLayoutProps {
  children?: ReactNode;
}

const VerticalLayout = ({ children }: VerticalLayoutProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useViewPort();

  const { layoutTheme, layoutDirection, layoutWidth, topBarTheme, sideBarTheme, sideBarType, layoutPosition } = useSelector((state: RootState) => ({
    layoutTheme: state.Layout.layoutTheme,
    layoutDirection: state.Layout.layoutDirection,
    layoutWidth: state.Layout.layoutWidth,
    topBarTheme: state.Layout.topBarTheme,
    sideBarTheme: state.Layout.sideBarTheme,
    sideBarType: state.Layout.sideBarType,
    layoutPosition: state.Layout.layoutPosition,
  }));

  useEffect(() => { changeHTMLAttribute('data-mode', layoutTheme); }, [layoutTheme]);
  useEffect(() => { changeHTMLAttribute('dir', layoutDirection); }, [layoutDirection]);
  useEffect(() => { changeHTMLAttribute('data-layout-width', layoutWidth); }, [layoutWidth]);
  useEffect(() => { changeHTMLAttribute('data-topbar-color', topBarTheme); }, [topBarTheme]);
  useEffect(() => { changeHTMLAttribute('data-menu-color', sideBarTheme); }, [sideBarTheme]);
  useEffect(() => { changeHTMLAttribute('data-sidenav-view', sideBarType); }, [sideBarType]);
  useEffect(() => { changeHTMLAttribute('data-layout-position', layoutPosition); }, [layoutPosition]);
  useEffect(() => { document.getElementsByTagName('html')[0].removeAttribute('data-layout'); }, []);

  useEffect(() => {
    if (width <= 1140) {
      dispatch(changeSideBarType(layoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_MOBILE));
    } else if (width > 1140) {
      dispatch(changeSideBarType(layoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_DEFAULT));
    }
  }, [width, dispatch]);

  const isCondensed = sideBarType === layoutConstants.SideBarType.LEFT_SIDEBAR_TYPE_SMALL;
  const isLight = sideBarTheme === layoutConstants.SideBarTheme.LEFT_SIDEBAR_THEME_LIGHT;

  return (
    <Suspense fallback={<div />}>
      <div className="flex wrapper">
        <Suspense fallback={<div />}>
          <LeftSideBar isCondensed={isCondensed} isLight={isLight} />
        </Suspense>

        <div className="page-content">
          <Suspense fallback={<div />}>
            <Topbar />
          </Suspense>

          <main className="flex-grow p-6">
            <Suspense fallback={<Preloader />}>
              {children}
            </Suspense>
          </main>

          <Footer />
        </div>
      </div>

      <Suspense fallback={<div />}>
        <RightSideBar />
      </Suspense>
    </Suspense>
  );
};

export default VerticalLayout;
