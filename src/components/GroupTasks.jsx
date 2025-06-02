import React, { useEffect, useState, useCallback } from "react";
import { WavyBackground } from "./ui/wavy-background";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import Aos from "aos";
import Swal from "sweetalert2";
import Loading from "./Loading";
import { AuthContext } from "../providers/AuthProvider";
import { useContext } from "react";

const ItemType = { TASK: "task" };

const TaskCard = ({ task, moveTask, onEdit, onDelete, isAdmin }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { id: task._id, category: task.category },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-gray-100 p-3 rounded-md mb-3 shadow cursor-pointer transition-transform duration-300 ${
        isDragging ? "opacity-50 scale-105" : "opacity-100"
      }`}
      style={{
        touchAction: "none",
        transform: isDragging ? "scale(1.05)" : "scale(1)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-bold">{task.title}</h3>
        {isAdmin && (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(task)} className="text-blue-500">
              Edit
            </button>
            <button onClick={() => onDelete(task._id)} className="text-red-500">
              Delete
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500 mt-1">Created by: {task.createdBy}</p>
      {isDragging && (
        <div className="md:hidden text-xs text-blue-500 mt-2 text-center">
          Drag to another column
        </div>
      )}
    </div>
  );
};

const TaskColumn = ({ category, tasks, moveTask, onEdit, onDelete, isAdmin }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      if (item.category !== category) {
        moveTask(item.id, category);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-white p-4 rounded-lg shadow-md min-h-[300px] w-full border ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
      } transition-colors duration-200`}
    >
      <h2 className="text-lg font-semibold mb-3">{category}</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            moveTask={moveTask}
            onEdit={onEdit}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No tasks available</p>
      )}
      {isOver && tasks.length === 0 && (
        <div className="border-2 border-dashed border-blue-300 rounded-md p-4 mt-2 text-center text-blue-400">
          Drop here
        </div>
      )}
    </div>
  );
};

const GroupTasks = () => {
  const { groupId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    Aos.init({ duration: 1000 });
    document.title = "Group Tasks | TaskManagement";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        if (!groupId) {
          throw new Error('Group ID is required');
        }

        const [groupResponse, tasksResponse] = await Promise.all([
          axios.get(`http://localhost:5001/groups/${groupId}`),
          axios.get(`http://localhost:5001/groups/${groupId}/tasks`)
        ]);

        setGroup(groupResponse.data);
        setTasks(tasksResponse.data);
        setIsAdmin(groupResponse.data.adminEmail === user?.email);
        setError(null);
      } catch (error) {
        console.error('Error fetching group data:', error);
        setError(error.response?.data?.message || 'Failed to load group data');
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to load group data',
          icon: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, user]);

  const updateTaskCategory = async (taskId, newCategory) => {
    try {
      await axios.patch(
        `https://task-server-orcin.vercel.app/groups/${groupId}/tasks/${taskId}`,
        {
          category: newCategory,
        }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, category: newCategory } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleEditTask = (task) => {
    if (!isAdmin) return;

    Swal.fire({
      title: "Edit Task",
      input: "text",
      inputLabel: "Task Title",
      inputValue: task.title,
      showCancelButton: true,
      inputPlaceholder: "Enter new task title",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.patch(
            `https://task-server-orcin.vercel.app/groups/${groupId}/tasks/${task._id}`,
            {
              title: result.value,
              description: task.description,
              category: task.category,
            }
          );
          setTasks((prev) =>
            prev.map((t) =>
              t._id === task._id
                ? { ...t, title: result.value }
                : t
            )
          );
          Swal.fire({
            icon: "success",
            title: "Task Updated",
            text: "The task has been edited successfully.",
          });
        } catch (error) {
          console.error("Failed to edit task:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update task.",
          });
        }
      }
    });
  };

  const handleDeleteTask = (taskId) => {
    if (!isAdmin) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://task-server-orcin.vercel.app/groups/${groupId}/tasks/${taskId}`
          );
          setTasks((prev) => prev.filter((task) => task._id !== taskId));
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (error) {
          console.error("Failed to delete task:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete task.",
          });
        }
      }
    });
  };

  const handleInvite = async () => {
    try {
      const inviteLink = `${window.location.origin}/groups/${groupId}/join`;
      await navigator.clipboard.writeText(inviteLink);
      Swal.fire({
        icon: "success",
        title: "Invite Link Copied!",
        text: "Share this link with your team members.",
      });
    } catch (error) {
      console.error("Failed to copy invite link:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to copy invite link.",
      });
    }
  };

  const categorizedTasks = {
    "To-Do": tasks.filter((task) => task.category === "To-Do"),
    "In Progress": tasks.filter((task) => task.category === "In Progress"),
    Done: tasks.filter((task) => task.category === "Done"),
  };

  const backendOptions = {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: isMobile ? 200 : 0,
    touchSlop: 20,
    ignoreContextMenu: true,
    delay: isMobile ? 150 : 0,
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access group tasks</h2>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Group not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={backendOptions}
    >
      <WavyBackground>
        <div className="max-w-6xl mx-auto p-4 md:p-6 text-black flex flex-col items-center">
          <div className="w-full mb-6">
            <h1 className="text-2xl font-bold mb-2">{group.name || "Group Tasks"}</h1>
            <p className="text-gray-600">
              {isAdmin ? "You are the admin" : "You are a member"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {Object.entries(categorizedTasks).map(([category, taskList]) => (
              <TaskColumn
                key={category}
                category={category}
                tasks={taskList}
                moveTask={updateTaskCategory}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6 md:mt-10">
            <Link
              to={`/groups/${groupId}/create`}
              className="btn px-6 py-2 bg-black text-white rounded-md hover:bg-gray-100 hover:text-black transition"
            >
              Add Task
            </Link>
            {isAdmin && (
              <button
                onClick={handleInvite}
                className="btn px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Invite
              </button>
            )}
          </div>
        </div>
      </WavyBackground>
    </DndProvider>
  );
};

export default GroupTasks; 