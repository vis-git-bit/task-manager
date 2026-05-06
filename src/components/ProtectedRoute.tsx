// protects private routes (only logged-in users can access)
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children } : Props) => {
  const user = localStorage.getItem("user"); // check if user exists

  return user ? children : <Navigate to="/" />; // if not  go login
};

export default ProtectedRoute;