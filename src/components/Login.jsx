import { FaGoogle } from "react-icons/fa";
import { useContext, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/useAxiosPublic";
function Login() {
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
          navigate(location?.state ? location.state : "/");
        }, 2000);
      })
      .catch((err) => {
        setError({ ...error, login: err.code });
        toast.error("Login failed: " + err.message);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      // User info to store
      const userInfo = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      };

      // Save user to database
      await axiosPublic.post("/users", userInfo); // FIX: changed `useAxiosPublic.post` to `axiosPublic.post`

      // Generate token
      const tokenRes = await axiosPublic.post("/jwt", userInfo);
      if (tokenRes.data.token) {
        localStorage.setItem("token", tokenRes.data.token);
      }

      toast.success("Google Sign-In successful!");
      setTimeout(() => {
        navigate("/CreateTask"); // Redirects to CreateTask after login
      }, 2000);
    } catch (err) {
      console.error("Google Sign-In failed:", err.message);
      toast.error("Google Sign-In failed: " + err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-center">Please Login First</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
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
                placeholder="password"
                className="input input-bordered"
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
              <div className="mt-5">
                <button
                  className="btn rounded-full"
                  onClick={handleGoogleSignIn}
                >
                  Google Sign in <FaGoogle></FaGoogle>
                </button>
              </div>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
