import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-4">
          {error.statusText || error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 