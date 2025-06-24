import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setAuth }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  async function getUserData() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No Authentication token found");
      }
      const response = await fetch("http://localhost:5000/auth/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log("Error details:", errorData);
        throw new Error(
          errorData.error || errorData.message || "Failed to get details"
        );
      }
      const data = await response.json();

      console.log("Received user data:", data);
      setUser({ name: data.user.user_name, email: data.user.user_email });
    } catch (error) {
      console.error("Dashboard error:", error);
      setError(error.message);
      //redirect to login if user is unauthorized
      if (
        error.message.includes("unauthorized") ||
        error.message.includes("token")
      )
        handleLogout();
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/login");
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) return <div className=" w-75">Loading dashboard...</div>;
  if (error) return <div className=" w-75 text-danger">Error: {error}</div>;
  return (
    <>
      <div id="dashboard" className=" container w-auto h-auto m-auto bg-slate-300">
        <h1 className=" display-4 text-5xl">Dashboard</h1>
        {user && (
        <div className=" card text-2xl bg-cyan-700 p-20 rounded-xl shadow-lg w-[50%]">
          <div className=" card-body">
            <h5 className=" card-title">User</h5>
            <p className=" card-text">
              <strong>Name:</strong>
              {user.name}
              <br />
              <strong>Email:</strong>
              {user.email}
            </p>
          </div>
        </div>
      )}
        <button className=" mt-5 text-white bg-red-500 hover:bg-blue-600 font-semibold rounded-lg text-3xl px-6 py-4 focus:ring-4 focus:outline-none focus:ring-red-300 " onClick={handleLogout}>
          log out
        </button>
      </div>

      
    </>
  );
};
export default Dashboard;
