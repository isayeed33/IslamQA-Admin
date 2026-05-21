import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { signupUser, resetAuth } from "../../redux/actions";
import { VerticalForm, FormInput, AuthLayout, PageBreadcrumb } from "../../components";

interface RegisterData { fullname: string; email: string; password: string; }

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userSignUp, loading } = useSelector((state: RootState) => ({
    userSignUp: state.Auth.userSignUp,
    loading: state.Auth.loading,
  }));

  useEffect(() => { dispatch(resetAuth()); }, [dispatch]);

  const schemaResolver = yupResolver(yup.object().shape({
    fullname: yup.string().required("Please enter your full name"),
    email: yup.string().email("Invalid email").required("Please enter your email"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Please enter a password"),
  }));

  const onSubmit = (data: RegisterData) => {
    dispatch(signupUser(data.fullname, data.email, data.password));
  };

  return (
    <>
      {userSignUp && <Navigate to="/auth/login" />}
      <PageBreadcrumb title="Register" />
      <AuthLayout
        authTitle="Create Account"
        helpText="Register to get access to the IslamQA Admin Dashboard."
        bottomLinks={
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            Already have an account? <Link to="/auth/login" className="text-primary font-semibold">Sign In</Link>
          </p>
        }
      >
        <VerticalForm<RegisterData> onSubmit={onSubmit} resolver={schemaResolver}>
          <FormInput label="Full Name" type="text" name="fullname" placeholder="John Doe" containerClass="mb-4" className="form-input" labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2" />
          <FormInput label="Email Address" type="text" name="email" placeholder="you@islamqa.info" containerClass="mb-4" className="form-input" labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2" />
          <FormInput label="Password" type="password" name="password" placeholder="Min. 6 characters" containerClass="mb-5" className="form-input" labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2" />
          <button className="btn w-full text-white bg-primary hover:bg-primary/90 py-2.5" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default Register;
