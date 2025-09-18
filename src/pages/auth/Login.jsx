import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../components/inputs/Input";
import AuthLayout from "../../components/layouts/AuthLayout";
import { UserContext } from "../../context/UserContext.jsx";
import { API_PATHS } from "../../utils/apiPath.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { toast } from "react-toastify";
const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const idDisabled = !identifier || !password;
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier) {
      setError("Please enter username or email.");
      return;
    }
    if (!password) {
      setError("Please eneter the password.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        identifier,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        updateUser(response.data);
      }
      setLoading(false);
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else navigate("/user/dashboard");
      toast.success("Login successfully.");
    } catch (error) {
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        toast.error("Server error.");
      }
    }
  };
  return (
    <div>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
          <p className="text-xs font-medium text-slate-700 mt-1 mb-3">
            Please enter your deatils to log in
          </p>

          <form onSubmit={handleLogin}>
            <div className=" flex flex-col gap-3">
              <Input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="Username or E-mail"
                type="text"
              />

              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
              />

              <button
                type="submit"
                className={idDisabled ? "btn-disabled" : "btn-primary"}
                disabled={idDisabled || loading}
              >
                LOGIN
              </button>
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
              <div className=" flex justify-between">
                <Link
                  to="/accounts/password/reset"
                  className="text-primary underline ml-1"
                >
                  Forgot Password?
                </Link>
                <Link
                  to="/accounts/signup"
                  className="text-primary underline ml-1"
                >
                  SignUp
                </Link>
              </div>
            </div>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default Login;
