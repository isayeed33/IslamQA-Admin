import { useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { changeHTMLAttribute } from "../utils/layout";

interface DefaultLayoutProps {
  layout: { layoutType: string; layoutWidth: string; sideBarTheme: string; sideBarType: string };
  children?: any;
}

const DefaultLayout = (props: DefaultLayoutProps) => {
  const { layoutTheme } = useSelector((state: RootState) => ({ layoutTheme: state.Layout.layoutTheme }));
  useEffect(() => { changeHTMLAttribute("data-mode", layoutTheme); }, [layoutTheme]);
  return <Suspense fallback={<div />}>{props.children ?? null}</Suspense>;
};

export default DefaultLayout;
