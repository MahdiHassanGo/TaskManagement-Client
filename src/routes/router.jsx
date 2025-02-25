import React from "react";
import MainLayout from "./../Layout/MainLayout";
import HomeLayout from "./../Layout/HomeLayout";

const router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
    {
      path: "CreateTask",
      element: <HomeLayout />,
    },
  ]);
  return <div></div>;
};

export default router;
