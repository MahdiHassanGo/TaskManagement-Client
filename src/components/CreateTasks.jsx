import React, { useContext, useEffect, useState } from "react";
import "aos/dist/aos.css";
import Aos from "aos";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FaUser } from "react-icons/fa";
import { WavyBackground } from "./ui/wavy-background";

const CreateTasks = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 1000 });
    document.title = "Create | TaskManagement";
    window.scrollTo(0, 0);
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "To-Do",
    userEmail: user?.email || "",
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskWithTimestamp = {
        ...taskData,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        "https://task-server-orcin.vercel.app/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskWithTimestamp),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "Task Created!",
          text: `Title: ${taskData.title}\nCategory: ${taskData.category}`,
          icon: "success",
        });
        navigate("/tasks/show");
      } else {
        Swal.fire({
          title: "Error!",
          text: result.error || "Failed to create task",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Try again.",
        icon: "error",
      });
    }
  };

  const userPhoto = user?.photoURL;

  return (
    <div className="hero bg-base-200 min-h-screen">
      <WavyBackground className="hero-content flex flex-col lg:flex-row-reverse w-full">
        <div
          className="card bg-gray-100 w-full max-w-sm shrink-0 shadow-2xl p-4 mx-auto"
          data-aos="fade-up"
        >
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex items-center gap-4">
                {user && user.email ? (
                  <>
                    <img
                      className="w-10 h-10 md:w-16 md:h-16 rounded-full cursor-pointer"
                      src={userPhoto}
                      alt="User Profile"
                      onClick={toggleUserMenu}
                    />
                    {isUserMenuOpen && (
                      <div className="absolute top-10 left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-30">
                        <div className="p-4 text-black border-b">
                          {user.displayName}
                        </div>
                        <button
                          onClick={handleLogOut}
                          className="text-black px-1 py-1 md:py-2 md:px-4 rounded hover:bg-opacity-90 transition"
                        >
                          Log Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <FaUser className="text-white" />
                )}
              </div>
              <Link className="btn" to="/tasks/show">
                Show tasks
              </Link>
            </div>

            {/* Task Form */}
            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <label className="fieldset-label">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Enter task title"
                  required
                />

                <label className="fieldset-label">Task Description</label>
                <input
                  type="text"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Enter task description"
                  required
                />

                <label className="fieldset-label">Category</label>
                <select
                  name="category"
                  value={taskData.category}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>

                <button type="submit" className="btn btn-neutral mt-4 w-full">
                  Create Task
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default CreateTasks;
