import React from "react";
import { Link } from "react-router-dom";

const CreateTasks = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left"></div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <div className=" flex justify-between ">
              <Link>Make tasks</Link>
              <Link>Show task</Link>
            </div>

            <fieldset className="fieldset">
              <label className="fieldset-label">Task Title</label>
              <input
                type="email"
                className="input"
                placeholder="Enter your task title"
              />
              <label className="fieldset-label">Task Description</label>
              <input
                type="email"
                className="input"
                placeholder="Enter task description"
              />
              <label className="fieldset-label">Task TimeStamp</label>
              <input type="email" className="input" placeholder="Email" />
              <label className="fieldset-label">Category</label>
              <input type="password" className="input" placeholder="Password" />
              <div></div>
              <button className="btn btn-neutral mt-4">Create Task </button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTasks;
