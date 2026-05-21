import React from "react";
import { Navigate, Route, RouteObject, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DefaultLayout from "../layouts/Default";
import VerticalLayout from "../layouts/Vertical";
import { authProtectedFlattenRoutes, publicProtectedFlattenRoutes } from ".";
import { APICore } from "../helpers/api/apiCore";

const AllRoutes = () => {
  const { Layout } = useSelector((state: RootState) => ({ Layout: state.Layout }));
  const api = new APICore();

  return (
    <React.Fragment>
      <Routes>
        <Route>
          {(publicProtectedFlattenRoutes || []).map((route: RouteObject, idx: number) => (
            <Route
              path={route.path}
              element={
                <DefaultLayout layout={Layout}>
                  {route.element}
                </DefaultLayout>
              }
              key={idx}
            />
          ))}
        </Route>

        <Route>
          {(authProtectedFlattenRoutes || []).map((route: RouteObject, idx: number) => (
            <Route
              path={route.path}
              element={
                !api.isUserAuthenticated() ? (
                  <Navigate to={{ pathname: "/auth/login", search: "next=" + route.path }} />
                ) : (
                  <VerticalLayout>{route.element}</VerticalLayout>
                )
              }
              key={idx}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default AllRoutes;
