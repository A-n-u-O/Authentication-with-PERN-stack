import { useState } from "react";
import eyeClosed from "../assets/icons/eye-closed.svg";
import eyeOpen from "../assets/icons/eye-open.svg";
const Login = ({ setAuth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    //clear errors when user types
    if (error) setError(null);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      //store token and update auth state
      localStorage.setItem("token", data.token);
      setSuccess(true);

      //verify setAuth exists before calling it
      if (typeof setAuth === "function") {
        setAuth(true);
      } else {
        console.error("setAuth is not a function - current value:", setAuth);
      }
      //redirect after successful registration
    } catch (error) {
    } finally {
    }
  };
  return (
    <>
      <div
        id=" authentication login"
        className=" w-[90%] max-w-2xl m-auto mt-10 bg-slate-400 p-10 rounded-xl shadow-lg">
        <h1 className=" text-center text-7xl font-bold text-white mb-8">
          Log in
        </h1>

        {/* Error message  */}
        {error && (
          <div className=" mb-6 p-4 bg-red-100 border-1-4 border-red-500 text-red-700">
            <p className=" font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message  */}
        {success && (
          <div className=" mb-6 p-4 bg-green-100 border-1-4 border-green-500 text-green-700">
            <p className=" font-bold">Success!</p>
            <p>Log in Successful. Redirecting to dashboard</p>
          </div>
        )}
        <form onSubmit={onSubmitForm}>
          <div className="mb-9">
            <label
              htmlFor="email"
              className="block text-4xl font-semibold text-white mb-4"
              placeholder="example@email.com">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className=" w-full p-6 text-3xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className=" mb-9 relative">
            <label
              htmlFor="password"
              className="block text-4xl font-semibold text-white mb-4 placeholder:text-black">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className=" w-full p-6 text-3xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              className=" w-8 h-8 absolute top-[71%] right-6 cursor-pointer transform -translate-y-1/2"
              alt="toggle password visibility"
              onClick={() => setShowPassword((showPassword) => !showPassword)}
            />
          </div>
          <div className=" flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg text-3xl px-6 py-4 focus:ring-4 focus:outline-none focus:ring-blue-300 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}>
              {" "}
              {isLoading ? (
                <span className=" flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>{" "}
                  Processing...
                </span>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
