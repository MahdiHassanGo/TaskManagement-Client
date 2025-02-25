import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import app from "../firebase/firebase.config.js";
import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createNewUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth).then(() => {
      localStorage.removeItem("access-token");
      setUser(null);
      setLoading(false);
    });
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: "student",
        uid: user.uid,
      };

      await axiosPublic.post("/users", userData);

      const userInfo = { email: user.email };
      const tokenRes = await axiosPublic.post("/jwt", userInfo);

      if (tokenRes.data.token) {
        localStorage.setItem("access-token", tokenRes.data.token);
      }

      setUser(user);
      setLoading(false);

      return result;
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userInfo = { email: currentUser.email };
          const tokenRes = await axiosPublic.post("/jwt", userInfo);

          if (tokenRes.data.token) {
            localStorage.setItem("access-token", tokenRes.data.token);

            const userRes = await axiosPublic.get(
              `/users/email/${currentUser.email}`,
              {
                headers: {
                  Authorization: `Bearer ${tokenRes.data.token}`,
                },
              }
            );

            setUser({ ...currentUser, ...userRes.data });
          }
        } catch (error) {
          console.error("Error setting up user:", error);
        }
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const sendPasswordResetEmail = (email) => {
    setLoading(true);
    return firebaseSendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (profile) => {
    const auth = getAuth();
    try {
      await updateProfile(auth.currentUser, profile);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        createNewUser,
        logOut,
        userLogin,
        loading,
        updateUserProfile,
        googleSignIn,
        sendPasswordResetEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
