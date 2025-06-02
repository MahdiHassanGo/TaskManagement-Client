import { Routes, Route } from 'react-router-dom'
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
import GroupTasksList from "./components/GroupTasksList";
import GroupInvite from './components/GroupInvite';

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
          path="/groups" 
          element={
            <PrivateRoute>
              <GroupTasksList />
            </PrivateRoute>
          }
        />
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
          path="/groups/:groupId/join" 
          element={
            <PrivateRoute>
              <GroupInvite />
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
    </AuthProvider>
  )
}

export default App
