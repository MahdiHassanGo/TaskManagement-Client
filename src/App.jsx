import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CreateTasks from "./components/CreateTasks";
import ShowTask from "./components/ShowTask";
import GroupTasks from "./components/GroupTasks";
import CreateGroupTask from "./components/CreateGroupTask";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthProvider from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks/create" element={
          <PrivateRoute>
            <CreateTasks />
          </PrivateRoute>
        } />
        <Route path="/tasks/show" element={
          <PrivateRoute>
            <ShowTask />
          </PrivateRoute>
        } />
        <Route 
          path="/groups/:groupId" 
          element={
            <PrivateRoute>
              <GroupTasks />
            </PrivateRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route 
          path="/groups/:groupId/create" 
          element={
            <PrivateRoute>
              <CreateGroupTask />
            </PrivateRoute>
          }
          errorElement={<ErrorBoundary />}
        />
        <Route path="*" element={<ErrorBoundary />} />
      </Routes>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button>
          count is {0}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </AuthProvider>
  )
}

export default App
