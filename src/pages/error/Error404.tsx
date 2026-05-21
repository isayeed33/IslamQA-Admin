import { Link } from "react-router-dom";

const Error404 = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center p-8">
      <div className="text-6xl font-bold text-primary mb-4">404</div>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">The page you are looking for could not be found.</p>
      <Link to="/dashboard" className="btn bg-primary text-white px-6 py-2.5">Go to Dashboard</Link>
    </div>
  </div>
);

export default Error404;
