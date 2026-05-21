import { Navigate } from "react-router-dom";
import { APICore } from "../helpers/api/apiCore";

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => {
  const api = new APICore();
  if (!api.isUserAuthenticated()) {
    return <Navigate to="/auth/login" />;
  }
  return Component ? <Component {...rest} /> : rest.element;
};

export default PrivateRoute;
