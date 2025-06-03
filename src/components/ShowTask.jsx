import React, { useEffect, useState, useCallback } from "react";
import { WavyBackground } from "./ui/wavy-background";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import axios from "axios";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import Aos from "aos";
import Swal from "sweetalert2";
import Loading from "./Loading"; // Import your loading component

const ItemType = { TASK: "task" };

const TaskCard = ({ task, moveTask, onEdit, onDelete }) => {
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
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} className="text-blue-500">
            Edit
          </button>
          <button onClick={() => onDelete(task._id)} className="text-red-500">
            Delete
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
      {isDragging && (
        <div className="md:hidden text-xs text-blue-500 mt-2 text-center">
          Drag to another column
        </div>
      )}
    </div>
  );
};

const TaskColumn = ({ category, tasks, moveTask, onEdit, onDelete }) => {
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

const ShowTask = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
    document.title = "Show | TaskManagement";
    window.scrollTo(0, 0);
  }, []);

  const [tasks, setTasks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [dragInstructions, setDragInstructions] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dismissInstructions = useCallback(() => {
    setDragInstructions(false);
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      console.error("No user email found. Please log in.");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `https://task-server-orcin.vercel.app/tasks?userEmail=${encodeURIComponent(
            userEmail
          )}`
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateTaskCategory = async (taskId, newCategory) => {
    try {
      await axios.patch(
        `https://task-server-orcin.vercel.app/tasks/${taskId}`,
        {
          category: newCategory,
        }
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, category: newCategory } : task
        )
      );
      dismissInstructions();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await axios.post(
        `https://task-server-orcin.vercel.app/tasks`,
        newTask
      );
      setTasks((prev) => [...prev, response.data.result]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const editTask = async (taskId, updatedTask) => {
    try {
      await axios.patch(
        `https://task-server-orcin.vercel.app/tasks/${taskId}`,
        updatedTask
      );
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      setEditingTask(null);
      Swal.fire({
        icon: "success",
        title: "Task Updated",
        text: "The task has been edited successfully.",
      });
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `https://task-server-orcin.vercel.app/tasks/${taskId}`
      );
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditTask = (task) => {
    Swal.fire({
      title: "Edit Task",
      input: "text",
      inputLabel: "Task Title",
      inputValue: task.title,
      showCancelButton: true,
      inputPlaceholder: "Enter new task title",
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const updatedTask = {
          title: result.value,
          description: task.description,
          category: task.category,
        };
        await editTask(task._id, updatedTask);
      }
    });
  };

  const handleDeleteTask = (taskId) => {
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
        await deleteTask(taskId);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
    };

    if (editingTask) {
      editTask(editingTask._id, taskData);
    } else {
      addTask(taskData);
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

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={backendOptions}
    >
      <WavyBackground>
        <div className="max-w-6xl mx-auto p-4 md:p-6 text-black flex flex-col items-center">
          {loading ? (
            <Loading />
          ) : (
            <>
              {isMobile && dragInstructions && (
                <div
                  className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm text-blue-700 w-full"
                  onClick={dismissInstructions}
                >
                  Press and hold a task to drag it to another column
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full mt-150 md:mt-0">
                {Object.entries(categorizedTasks).map(
                  ([category, taskList]) => (
                    <TaskColumn
                      key={category}
                      category={category}
                      tasks={taskList}
                      moveTask={updateTaskCategory}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  )
                )}
              </div>

              <div className="flex justify-center mt-6 md:mt-10 gap-4">
                <Link
                  to="/tasks/create"
                  className="btn px-6 py-2 bg-black text-white rounded-md hover:bg-gray-100 hover:text-black transition"
                >
                  Add Task
                </Link>
                <Link
              to={`/`}
              className="btn px-6 py-2 bg-black text-white rounded-md hover:bg-gray-100 hover:text-black transition"
            >
            Back
            </Link>
              </div>
            </>
          )}
        </div>
      </WavyBackground>
    </DndProvider>
  );
};

export default ShowTask;
