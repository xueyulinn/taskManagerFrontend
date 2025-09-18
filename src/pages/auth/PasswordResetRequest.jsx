import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPath";
import { toast } from "react-toastify";
const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const isDisabled = !email;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid Email.");
    }
    setError("");
    try {
      setSending(true);
      const res = await axiosInstance.post(
        API_PATHS.AUTH.PASSWORD_RESET_REQUEST,
        { email }
      );
      setSending(false);
      toast.success("E-mail sent.");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
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
                type="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                type="submit"
                disabled={isDisabled || sending}
                className={`${isDisabled ? "btn-disabled" : "btn-primary"}`}
              >
                Reset My Password
              </button>
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            </div>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default PasswordResetRequest;
