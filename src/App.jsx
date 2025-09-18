import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Outlet,
} from "react-router";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashBoard from "./pages/admin/Dashboard";
import UserDashBoard from "./pages/user/UserDashboard";
import MyTasks from "./pages/user/MyTasks";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/UserContext";
import { useContext } from "react";
import CreateTask from "./pages/admin/CreateTask";
import ManageTask from "./pages/admin/ManageTask";
import ManageUsers from "./pages/admin/ManageUsers";
import TaskDetails from "./pages/user/TaskDetails";
import PasswordResetRequest from "./pages/auth/PasswordResetRequest";
import PasswordReset from "./pages/auth/PasswordReset";
import { ToastContainer, Bounce } from "react-toastify";
const App = () => {
  return (
    <>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/accounts/login" element={<Login />}></Route>
            <Route path="/accounts/signup" element={<Signup />}></Route>
            <Route
              path="/accounts/password/reset"
              element={<PasswordResetRequest />}
            ></Route>
            <Route
              path="/accounts/reset-password/:token"
              element={<PasswordReset />}
            ></Route>
            <Route
              element={<PrivateRoute allowedRoles={["admin"]}></PrivateRoute>}
            >
              <Route path="/admin/dashboard" element={<DashBoard />}></Route>
              <Route path="/admin/create-task" element={<CreateTask />}></Route>
              <Route path="/admin/tasks" element={<ManageTask />}></Route>
              <Route path="/admin/users" element={<ManageUsers />}></Route>
            </Route>

            <Route path="/user/tasks" element={<MyTasks />}></Route>
            <Route path="/user/dashboard" element={<UserDashBoard />}></Route>
            <Route
              path="/user/task-details/:taskId"
              element={<TaskDetails />}
            ></Route>
            <Route path="/*" element={<Root />}></Route>
          </Routes>
        </UserProvider>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

const Root = () => {
  const { loading, user } = useContext(UserContext);
  if (loading) return <Outlet />;
  // Navigate for auto navigation
  if (!user) return <Navigate to="/accounts/login"></Navigate>;
  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard"></Navigate>
  ) : (
    <Navigate to="/user/dashboard"></Navigate>
  );
};

export default App;
