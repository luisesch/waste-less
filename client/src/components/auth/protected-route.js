import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const protectedRoute = ({ component: Component, user, ...rest }) => {
  console.log(user ? "true" : "false");
  return user ? <Outlet /> : <Navigate to="/login" />;
};
export default protectedRoute;
