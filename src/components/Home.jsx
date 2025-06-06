import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { WavyBackground } from './ui/wavy-background';

const Home = () => {
  const { user } = useAuth();

  return (
    <WavyBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">Welcome to Task Management</h1>
          {user ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/tasks/create" className="btn btn-primary w-full sm:w-auto">
                Create Task
              </Link>
              <Link to="/tasks/show" className="btn btn-secondary w-full sm:w-auto">
                View My Tasks
              </Link>
              <Link to="/groups" className="btn btn-accent w-full sm:w-auto">
                View Group Tasks
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login" className="btn btn-primary w-full sm:w-auto">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary w-full sm:w-auto">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </WavyBackground>
  );
};

export default Home; 