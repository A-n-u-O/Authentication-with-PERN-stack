import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Redirect,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            {/* render prevents remount */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
