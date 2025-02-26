import React, { useEffect, useState, useCallback } from "react";
import { WavyBackground } from "./ui/wavy-background";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import axios from "axios";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import Aos from "aos";

const ItemType = { TASK: "task" };

const TaskCard = ({ task, moveTask }) => {
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
        touchAction: "none", // Prevent scrolling while dragging
        transform: isDragging ? "scale(1.05)" : "scale(1)",
      }}
    >
      {/* Visual indicator for mobile users */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-bold">{task.title}</h3>
        <div className="md:hidden flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>

      {/* Mobile drag instruction that only shows when dragging starts */}
      {isDragging && (
        <div className="md:hidden text-xs text-blue-500 mt-2 text-center">
          Drag to another column
        </div>
      )}
    </div>
  );
};

const TaskColumn = ({ category, tasks, moveTask }) => {
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
          <TaskCard key={task._id} task={task} moveTask={moveTask} />
        ))
      ) : (
        <p className="text-gray-500 text-sm">No tasks available</p>
      )}

      {/* Drop zone indicator */}
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

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dismiss instructions after first drag
  const dismissInstructions = useCallback(() => {
    setDragInstructions(false);
  }, []);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      console.error("No user email found. Please log in.");
      return;
    }

    axios
      .get(
        `http://localhost:5001/tasks?userEmail=${encodeURIComponent(userEmail)}`
      )
      .then((res) => {
        console.log("Fetched tasks:", res.data);
        setTasks(res.data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const updateTaskCategory = async (taskId, newCategory) => {
    try {
      await axios.patch(`http://localhost:5001/tasks/${taskId}`, {
        category: newCategory,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, category: newCategory } : task
        )
      );

      // Dismiss instructions after successful drag
      dismissInstructions();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const categorizedTasks = {
    "To-Do": tasks.filter((task) => task.category === "To-Do"),
    "In Progress": tasks.filter((task) => task.category === "In Progress"),
    Done: tasks.filter((task) => task.category === "Done"),
  };

  // Configure backend options based on device type
  const backendOptions = {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: isMobile ? 200 : 0, // Longer delay on mobile for press-and-hold
    touchSlop: 20, // How many pixels a touch can move before it's no longer considered a tap
    ignoreContextMenu: true, // Prevents context menu from appearing on long press
    delay: isMobile ? 150 : 0, // Delay for non-touch devices
  };

  return (
    <DndProvider
      backend={isMobile ? TouchBackend : HTML5Backend}
      options={backendOptions}
    >
      <WavyBackground>
        <div className="max-w-6xl mx-auto p-6 text-black flex flex-col items-center mt-150   md:mt-0">
          {/* Mobile Instructions */}
          {isMobile && dragInstructions && (
            <div
              className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-sm text-blue-700 w-full overflow-hidden"
              onClick={dismissInstructions}
            >
              <p className="font-medium">
                Tip: Press and hold a task card, then drag it to another column.
              </p>
            </div>
          )}

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4 ml-60 md:ml-0">
            {Object.entries(categorizedTasks).map(([category, taskList]) => (
              <TaskColumn
                key={category}
                category={category}
                tasks={taskList}
                moveTask={updateTaskCategory}
              />
            ))}
          </div>

          {/* Return Button */}
          <div className="flex justify-center mt-10 ml-50">
            <Link
              to="/tasks/create"
              className="btn px-6 py-2 bg-black text-white rounded-md  hover:bg-gray-100 hover:text-black transition"
            >
              Return
            </Link>
          </div>
        </div>
      </WavyBackground>
    </DndProvider>
  );
};

export default ShowTask;
