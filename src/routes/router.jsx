import React from "react";
import MainLayout from "./../Layout/MainLayout";
import HomeLayout from "./../Layout/HomeLayout";
import PrivateRoute from "./PrivateRoutes";

const router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
    {
      path: "/CreateTask",
      element: (
        <PrivateRoute>
          <HomeLayout />
        </PrivateRoute>
      ),
    },
  ]);
  return <div></div>;
};

export default router;
