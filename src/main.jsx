import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import AuthProvider from "./providers/AuthProvider";
import HomeLayout from "./Layout/HomeLayout";
import PrivateRoute from "./routes/PrivateRoutes";
import WelcomePage from "./components/WelcomePage";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <MainLayout />,
  },
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/tasks/create",
    element: (
      <PrivateRoute>
        <HomeLayout />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
