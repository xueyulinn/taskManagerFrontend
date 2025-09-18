import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../components/inputs/Input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import AuthLayout from "../../components/layouts/AuthLayout";
import { UserContext } from "../../context/UserContext";
import { API_PATHS } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail, validatePassword } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const [profileImg, setProfileImg] = useState(null);
  const isDisabled = !username || !email || !password;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Must be at least 8 characters with letter and number, no non-ASCII characters."
      );
      return;
    }
    setError("");
    let avatar = "";

    try {
      setLoading(true);
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username,
        email,
        adminInviteToken,
        password,
        avatar,
      });

      const { role } = response.data;
      updateUser(response.data);
      setLoading(false);
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
      toast.success("Sign up successfully.");
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
          <h3 className="text-xl font-semibold text-black">
            Create an Account
          </h3>
          <p className="text-xs font-medium text-slate-700 mt-1 mb-5">
            Join us today by entering your details below
          </p>

          <form onSubmit={handleSignup}>
            <ProfilePhotoSelector
              image={profileImg}
              setImage={setProfileImg}
            ></ProfilePhotoSelector>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                label="Full Name"
                placeholder="Username"
                type="text"
              />

              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-mail"
                type="text"
              />

              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
              />
              <Input
                value={adminInviteToken}
                onChange={(event) => setAdminInviteToken(event.target.value)}
                placeholder="6 Digit Code (Admin Only)"
                type="text"
              />
            </div>
            <button
              type="submit"
              disabled={isDisabled || loading}
              className={isDisabled ? "btn-disabled" : "btn-primary"}
            >
              SIGN UP
            </button>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <p className="text-[13px] text-slate-800 mt-3">
              Alreay an account?
              <Link
                to="/accounts/login"
                className="font-medium text-primary underline ml-1"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default Signup;
