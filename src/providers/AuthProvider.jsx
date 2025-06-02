import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase/firebase.config.js";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Token management functions
const saveToken = (token) => {
  const tokenData = {
    token,
    expiry: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
  };
  localStorage.setItem("access-token", JSON.stringify(tokenData));
};

const getToken = () => {
  const tokenString = localStorage.getItem("access-token");
  if (!tokenString) return null;

  try {
    const tokenData = JSON.parse(tokenString);
    // Check if token is expired
    if (tokenData.expiry < Date.now()) {
      localStorage.removeItem("access-token");
      return null;
    }
    return tokenData.token;
  } catch (error) {
    console.error("Error parsing token:", error);
    localStorage.removeItem("access-token");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createNewUser = async (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const userLogin = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Get JWT token after successful login
    const userInfo = { email: result.user.email };
    const tokenRes = await axiosPublic.post("/jwt", userInfo);
    if (tokenRes.data.token) {
      saveToken(tokenRes.data.token);
      localStorage.setItem("userEmail", result.user.email);
    }

    return result;
  };

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem("access-token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result || !result.user) {
        throw new Error("Sign-in failed. No user returned.");
      }
      const user = result.user;

      // Create user in your database if needed
      const userInfo = { email: user.email };
      await axiosPublic.post("/users", userInfo).catch((err) => {
        if (err.response?.status === 409) {
          console.log("User already exists, skipping user creation.");
        } else {
          throw err;
        }
      });

      // Get JWT token
      const tokenRes = await axiosPublic.post("/jwt", userInfo);
      if (tokenRes.data.token) {
        saveToken(tokenRes.data.token);
        localStorage.setItem("userEmail", user.email);
      }

      setUser(user);
      return { user };
    } catch (err) {
      console.error("Google Sign-In failed:", err.message);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if we have a valid token already
        const token = getToken();

        if (!token) {
          // If no valid token, get a new one
          const userInfo = { email: currentUser.email };
          try {
            const tokenRes = await axiosPublic.post("/jwt", userInfo);
            if (tokenRes.data.token) {
              saveToken(tokenRes.data.token);
              localStorage.setItem("userEmail", currentUser.email);
            }
          } catch (error) {
            console.error("Error getting token:", error);
          }
        }

        setUser(currentUser);
      } else {
        localStorage.removeItem("access-token");
        localStorage.removeItem("userEmail");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  // Add axios interceptor to include token in requests
  useEffect(() => {
    const requestInterceptor = axiosPublic.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPublic.interceptors.request.eject(requestInterceptor);
    };
  }, [axiosPublic]);

  const authInfo = {
    user,
    setUser,
    createNewUser,
    logOut,
    userLogin,
    googleSignIn,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
