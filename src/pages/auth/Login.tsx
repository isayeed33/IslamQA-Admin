import { useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { loginUser, resetAuth } from "../../redux/actions";
import { VerticalForm, FormInput, AuthLayout, PageBreadcrumb } from "../../components";

interface UserData { username: string; password: string; }

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, userLoggedIn, loading, error } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    loading: state.Auth.loading,
    userLoggedIn: state.Auth.userLoggedIn,
    error: state.Auth.error,
  }));

  useEffect(() => { dispatch(resetAuth()); }, [dispatch]);

  const schemaResolver = yupResolver(yup.object().shape({
    username: yup.string().required("Please enter your email"),
    password: yup.string().required("Please enter your password"),
  }));

  const onSubmit = (formData: UserData) => {
    dispatch(loginUser(formData.username, formData.password));
  };

  const location = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get("next") || "/dashboard";

  return (
    <>
      {userLoggedIn && <Navigate to={redirectUrl} />}
      <PageBreadcrumb title="Login" />
      <AuthLayout
        authTitle="Welcome Back"
        helpText="Sign in to access the IslamQA Admin Dashboard."
        bottomLinks={
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            Need an account? <Link to="/auth/register" className="text-primary font-semibold">Register</Link>
          </p>
        }
      >
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {typeof error === "string" ? error : "Login failed. Please check your credentials and try again."}
            </p>
          </div>
        )}

        <VerticalForm<UserData> onSubmit={onSubmit} resolver={schemaResolver} defaultValues={{ username: "admin@islamqa.info", password: "admin123" }}>
          <FormInput
            label="Email Address"
            type="text"
            name="username"
            placeholder="admin@islamqa.info"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass="mb-4"
            className="form-input"
            labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
          />
          <div className="flex items-center justify-between mb-5">
            <FormInput
              label="Remember me"
              type="checkbox"
              name="checkbox"
              containerClass="flex items-center"
              labelClassName="ms-2 text-sm text-gray-600 dark:text-gray-400"
              className="form-checkbox rounded"
            />
            <Link to="/auth/recover-password" className="text-sm text-primary border-b border-dashed border-primary">Forgot Password?</Link>
          </div>
          <button className="btn w-full text-white bg-primary hover:bg-primary/90 py-2.5" type="submit" disabled={loading}>
            {loading ? <span className="flex items-center justify-center gap-2"><i className="mgc_loading_2_line animate-spin"></i> Signing In...</span> : 'Sign In'}
          </button>
        </VerticalForm>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs text-gray-500 dark:text-gray-400">
          <p className="font-medium mb-1">Demo credentials:</p>
          <p>Email: <code>admin@islamqa.info</code></p>
          <p>Password: <code>admin123</code></p>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
