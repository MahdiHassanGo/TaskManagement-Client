import React, { useEffect, useState } from "react";
import { WavyBackground } from "./ui/wavy-background";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

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
      className={`bg-gray-100 p-3 rounded-md mb-2 shadow cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <h3 className="text-md font-bold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
    </div>
  );
};

const TaskColumn = ({ category, tasks, moveTask }) => {
  const [, drop] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => {
      if (item.category !== category) {
        moveTask(item.id, category);
      }
    },
  });

  return (
    <div ref={drop} className="bg-white p-4 rounded-lg shadow-md min-h-[300px]">
      <h2 className="text-lg font-semibold mb-3">{category}</h2>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} moveTask={moveTask} />
      ))}
    </div>
  );
};

const ShowTask = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/tasks")
      .then((res) => setTasks(res.data))
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
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const categorizedTasks = {
    "To-Do": tasks.filter((task) => task.category === "To-Do"),
    "In Progress": tasks.filter((task) => task.category === "In Progress"),
    Done: tasks.filter((task) => task.category === "Done"),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <WavyBackground>
        <div className="max-w-4xl mx-auto p-4 text-black">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(categorizedTasks).map(([category, taskList]) => (
              <TaskColumn
                key={category}
                category={category}
                tasks={taskList}
                moveTask={updateTaskCategory}
              />
            ))}
          </div>
        </div>
      </WavyBackground>
    </DndProvider>
  );
};

export default ShowTask;
