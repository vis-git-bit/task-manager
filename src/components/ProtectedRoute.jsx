// protects private routes (only logged-in users can access)
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // check if user exists

  return user ? children : <Navigate to="/" />; // if not  go login
};

export default ProtectedRoute;