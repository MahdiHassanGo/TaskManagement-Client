import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  useEffect(() => {
    document.title = "Login | TaskManagement";
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { userLogin, setUser, googleSignIn } = useContext(AuthContext);
  const [error, setError] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    userLogin(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);

        const userInfo = { email: user.email };
        axiosPublic.post("/jwt", userInfo).then((tokenRes) => {
          if (tokenRes.data.token) {
            localStorage.setItem("token", tokenRes.data.token);
          }
        });

        toast.success("Login successful!");
        setTimeout(() => {
          navigate(location?.state?.from || "/tasks/create"); // Updated to correct path
        }, 2000);
      })
      .catch((err) => {
        setError({ ...error, login: err.code });
        toast.error("Login failed: " + err.message);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await googleSignIn();

      const userInfo = { email: user.email };
      const tokenRes = await axiosPublic.post("/jwt", userInfo);

      if (tokenRes.data.token) {
        localStorage.setItem("token", tokenRes.data.token);
      }

      toast.success("Google Sign-In successful!");
      setTimeout(() => {
        navigate(location?.state?.from || "/tasks/create"); // Updated to correct path
      }, 2000);
    } catch (err) {
      console.error("Google Sign-In failed:", err.message);
      toast.error("Google Sign-In failed: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl p-6">
        <ToastContainer position="top-center" />
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Login now!</h1>
        </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email"
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
              name="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
            <div className="flex gap-10 mt-2">
              <label className="label">
                <Link
                  to="/auth/register"
                  className="label-text-alt link link-hover"
                >
                  Register Here
                </Link>
              </label>
            </div>
          </div>
          <div className="form-control mt-6 flex flex-col">
            <button className="btn bg-Profile text-white">Login</button>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="btn mt-5"
            >
              <FaGoogle /> Login with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
