// prevents logged-in users from going back to login/signup
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const PublicRoute = ({ children }: Props) => {
  const user = localStorage.getItem("user"); // check login

  return user ? <Navigate to="/home" /> : children; // if logged in  go home
};

export default PublicRoute;