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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createNewUser = async (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const userLogin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem("access-token");
    setUser(null);
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!result || !result.user) {
        throw new Error("Sign-in failed. No user returned.");
      }
      const user = result.user;

      const userInfo = { email: user.email };
      await axiosPublic.post("/users", userInfo).catch((err) => {
        if (err.response.status === 409) {
          console.log("User already exists, skipping user creation.");
        } else {
          throw err;
        }
      });

      const tokenRes = await axiosPublic.post("/jwt", userInfo);
      if (tokenRes.data.token) {
        localStorage.setItem("access-token", tokenRes.data.token);
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
        const userInfo = { email: currentUser.email };
        const tokenRes = await axiosPublic.post("/jwt", userInfo);
        localStorage.setItem("access-token", tokenRes.data.token);
        setUser(currentUser);
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, createNewUser, logOut, userLogin, googleSignIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
