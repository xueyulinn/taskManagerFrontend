import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import AuthLayout from "../../components/layouts/AuthLayout";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
const PasswordReset = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const { token } = useParams();
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Please enter new password.");
      return;
    }
    if (!newPasswordAgain) {
      setError("Please enter new password again.");
      return;
    }
    if (newPassword !== newPasswordAgain) {
      setError("Please type the same password each time.");
      return;
    }
    setError("");
    toast.success("Password reset.");
    navigate("/accounts/login");
    try {
      await axiosInstance.post(API_PATHS.AUTH.PASSWORD_RESET(token), {
        newPassword,
      });
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error.");
      }
    }
  };
  const isDisabled = !newPassword || !newPasswordAgain;
  return (
    <div>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">Password Reset</h3>
          <p className="text-xs font-medium text-slate-700 mt-1 mb-3">
            Enter your e-mail address below, and we'll send you an e-mail
            allowing you to reset it.
          </p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className=" flex flex-col gap-3">
              <input
                className=" text-black border border-gray-200 bg-gray-50 px-2 py-3 rounded-md "
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <input
                className=" text-black border border-gray-200 bg-gray-50 px-2 py-3 rounded-md "
                type="password"
                placeholder="New Password (again)"
                value={newPasswordAgain}
                onChange={(event) => setNewPasswordAgain(event.target.value)}
              />
              <button
                type="submit"
                disabled={isDisabled}
                className={`${isDisabled ? "btn-disabled" : "btn-primary"}`}
              >
                Change Password
              </button>
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            </div>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default PasswordReset;
