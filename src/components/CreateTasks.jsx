import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider"; // Import the AuthContext
import { FaUser } from "react-icons/fa"; // Import FaUser if needed

const CreateTasks = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login"); // Navigate to the login page after logging out
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userPhoto = user?.photoURL; // Access user photo from context

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left"></div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <div className="flex justify-between ">
              <div className="relative flex items-center gap-4">
                {user && user.email ? (
                  <>
                    <img
                      className="w-10 h-10 rounded-full cursor-pointer"
                      src={userPhoto}
                      alt="User Profile"
                      onClick={toggleUserMenu}
                    />
                    {isUserMenuOpen && (
                      <div className="absolute top-10 -left-20 md:right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-30">
                        <div className="p-4 text-black border-b">
                          {user.displayName}
                        </div>
                        {user && (
                          <button
                            onClick={handleLogOut}
                            className=" text-black px-1 py-1 md:py-2 md:px-4 rounded hover:bg-opacity-90 transition"
                          >
                            Log Out
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <FaUser className="text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <Link className="btn" to="/tasks/create">
                  Make tasks
                </Link>
                <Link className="btn" to="/tasks/show">
                  Show tasks
                </Link>
              </div>
            </div>

            <fieldset className="fieldset">
              <label className="fieldset-label">Task Title</label>
              <input
                type="text"
                className="input"
                placeholder="Enter your task title"
              />
              <label className="fieldset-label">Task Description</label>
              <input
                type="text"
                className="input"
                placeholder="Enter task description"
              />
              <label className="fieldset-label">Task Timestamp</label>
              <input type="text" className="input" placeholder="Timestamp" />
              <label className="fieldset-label">Category</label>
              <input type="text" className="input" placeholder="Category" />
              <button className="btn btn-neutral mt-4">Create Task</button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTasks;
