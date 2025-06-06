import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { WavyBackground } from "./ui/wavy-background";
import useAxiosPublic from '../hooks/useAxiosPublic';
import Swal from "sweetalert2";

const CreateGroupTask = () => {
  const { groupId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "To-Do",
    createdBy: user?.displayName || user?.email,
    userEmail: user?.email
  });

  useEffect(() => {
    document.title = "Create Group Task | TaskManagement";
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosPublic.post(
        `/groups/${groupId}/tasks`,
        taskData
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Task created successfully",
          icon: "success"
        }).then(() => {
          navigate(`/groups/${groupId}`);
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create task. Please try again.",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to create tasks</h2>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hero bg-base-200 min-h-screen text-black">
      <WavyBackground className="hero-content flex flex-col lg:flex-row-reverse w-full">
        <div className="card bg-gray-100 w-full max-w-sm shrink-0 shadow-2xl p-4 mx-auto">
          <div className="card-body">
            <h2 className="text-2xl font-bold mb-4">Create Group Task</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Task Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  className="input input-bordered text-white"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered h-24 text-white"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  name="category"
                  value={taskData.category}
                  onChange={handleChange}
                  className="select select-bordered text-white"
                  disabled={loading}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/groups/${groupId}`)}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default CreateGroupTask; 