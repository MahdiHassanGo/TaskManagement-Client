import { useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-3 md:mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline w-full sm:w-auto"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary w-full sm:w-auto"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 