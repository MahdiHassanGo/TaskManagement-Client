import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { AuthContext } from "../providers/AuthProvider";
import { BackgroundGradient } from "./ui/background-gradient";
import { AuroraBackground } from "./ui/aurora-background";
import { useAuth } from "../providers/AuthProvider";
import Swal from "sweetalert2";

const Login = () => {
  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
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
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signIn(email, password);
      if (result.user) {
        Swal.fire({
          title: "Success!",
          text: "Login successful!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      console.error(error);
      setError("Invalid email or password");
      Swal.fire({
        title: "Error!",
        text: "Invalid email or password",
        icon: "error",
        confirmButtonText: "Try Again"
      });
    }
  };

  // Fix in your handleGoogleSignIn function
  const handleGoogleSignIn = async () => {
    try {
      const { user } = await googleSignIn();

      toast.success("Google Sign-In successful!", {
        position: "top-center",
      });
      setTimeout(() => {
        navigate(location?.state?.from || "/");
      }, 2000);
    } catch (err) {
      console.error("Google Sign-In failed:", err.message);
      toast.error("Google Sign-In failed: " + err.message);
    }
  };

  return (
    <AuroraBackground className="flex items-center justify-center min-h-screen bg-white">
      <div data-aos="fade-up">
        <BackgroundGradient className="card bg-white w-full max-w-sm shadow-2xl p-6 rounded-xl">
          <ToastContainer position="top-center" />
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Login now!</h1>
          </div>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control mt-6 flex flex-col">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn mt-5"
              >
                <FaGoogle /> Login with Google
              </button>
            </div>
          </form>
        </BackgroundGradient>
      </div>
    </AuroraBackground>
  );
};

export default Login;
