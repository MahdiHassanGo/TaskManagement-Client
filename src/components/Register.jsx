import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { WavyBackground } from './ui/wavy-background';
import Swal from 'sweetalert2';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { createNewUser, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createNewUser(email, password);
      Swal.fire({
        title: 'Success!',
        text: 'Registration successful',
        icon: 'success'
      });
      navigate('/');
    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error'
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate('/');
    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error'
      });
    }
  };

  return (
    <WavyBackground>
      <div className="min-h-screen flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </form>
            <div className="divider">OR</div>
            <button
              onClick={handleGoogleSignIn}
              className="btn btn-outline w-full"
            >
              Continue with Google
            </button>
            <p className="text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </WavyBackground>
  );
};

export default Register; 