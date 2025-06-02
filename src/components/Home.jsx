import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { WavyBackground } from './ui/wavy-background';

const Home = () => {
  const { user } = useAuth();

  return (
    <WavyBackground>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome to Task Management</h1>
          {user ? (
            <div className="space-y-4">
              <Link to="/tasks/create" className="btn btn-primary mr-4">
                Create Task
              </Link>
              <Link to="/tasks/show" className="btn btn-secondary">
                View Tasks
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <Link to="/login" className="btn btn-primary mr-4">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
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