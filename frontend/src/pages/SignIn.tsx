import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Sun from "../assets/sun.svg";
import OTPInput from "../components/OTPBox";
import { Link, useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "axios";

interface SignInFormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "/api/v1/users/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          withCredentials: true
        }
      );

      if (!response.data.isError) {
        setSuccess("Login successful! Welcome, " + response.data.name);
        alert("Login successful! Welcome, " + response.data.name);
        Cookie.set("token", response.data.token, {path: '/', expires: 1, secure: false});
        setFormData({
          username: "",
          password: "",
        });
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  const handleForgotPasswordClick = async () => {
    setIsOtpModalOpen(true);
    try {
      await axios.post("/api/v1/users/forgotPassword", {
        username: formData.username,
      });
      // setFormData({
      //   username: "",
      //   password: "",
      // });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/v1/users/checkOTP",
        {
          otp: parseInt(enteredOtp),
          username: formData.username,
        }
      );
      if (!response.data.isError) {
        setOtp(enteredOtp);
        setIsOtpModalOpen(false);
        setIsResetPasswordModalOpen(true);
      } else {
        alert("Incorrect OTP. Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handlePasswordResetSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/v1/users/resetPassword",
        {
          code: parseInt(otp),
          username: formData.username,
          newPassword: newPassword,
        }
      );
      if (!response.data.isError) {
        setOtp("");
        alert("Password reset successful!");
        setIsResetPasswordModalOpen(false);
      } else {
        alert("Password reset unsuccessful! Please try again.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleOtpChange = (newOtp: string) => {
    setEnteredOtp(newOtp); // Update OTP value
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white tracking-wide">
            Connectgram
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <button
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ease-in-out duration-200"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon
              icon={isDarkMode ? faSun : faMoon}
              className="text-gray-800 dark:text-white w-5 h-5"
            />
          </button>
        </div>
      </header>
      <section className="bg-white dark:bg-gray-900">
        <div className="lg:grid lg:min-h-[90vh] lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="hidden lg:relative lg:block lg:p-12">
              <span className="block text-white">
                <img className="h-8 sm:h-10 text-white" src={Sun} alt="" />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome Back to Connectgram
              </h2>
              <p className="mt-4 leading-relaxed text-white/90">
                Sign in to reconnect with your community and enjoy the journey.
              </p>
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-xl lg:max-w-3xl">
              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6">
                  <label
                    htmlFor="Username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    id="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border-1 font-semibold p-3 mt-1 w-full rounded-md border-gray-700 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-1 p-3 font-semibold mt-1 w-full rounded-md border-gray-700 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>
                <div
                  onClick={handleForgotPasswordClick}
                  className="cursor-pointer col-span-6 font-semibold text-sm mt-[-10px] text-blue-800 dark:text-blue-400"
                >
                  Forgot Password?
                </div>
                <div className="col-span-6">
                  {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                  )}
                  {success && (
                    <p className="text-green-500 text-center mb-4">{success}</p>
                  )}
                </div>
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                  >
                    Log in
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-gray-700 underline dark:text-gray-200"
                    >
                      Register
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Enter OTP
            </h3>
            {/* <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="mt-4 p-3 w-full rounded-md border border-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              maxLength={6}
            /> */}
            <OTPInput value={enteredOtp} onChange={handleOtpChange} />
            <button
              onClick={handleOtpSubmit}
              className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md"
            >
              Verify OTP
            </button>
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="mt-2 w-full text-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-md max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Reset Password
            </h3>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-4 p-3 w-full rounded-md border border-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter new password"
            />
            <button
              onClick={handlePasswordResetSubmit}
              className="mt-4 w-full bg-blue-600 text-white p-3 rounded-md"
            >
              Reset Password
            </button>
            <button
              onClick={() => setIsResetPasswordModalOpen(false)}
              className="mt-2 w-full text-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
