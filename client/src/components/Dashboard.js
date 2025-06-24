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
      <div className=" dashboard container mt-5">
        <h1 className=" display-4">Dashboard</h1>
        <button className=" btn btn-outline-danger" onClick={handleLogout}>
          log out
        </button>
      </div>

      {user && (
        <div className=" card">
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
    </>
  );
};
export default Dashboard;
