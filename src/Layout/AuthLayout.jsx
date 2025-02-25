import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="">
      <header className="py-3 w-11/12 mx-auto mt-5">
        <Outlet></Outlet>
      </header>
    </div>
  );
};

export default AuthLayout;
