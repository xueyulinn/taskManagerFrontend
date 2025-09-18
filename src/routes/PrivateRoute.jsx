import React from "react";
import { Outlet } from "react-router";

const PrivateRoute = ({ allowedRoles }) => {
  return <Outlet></Outlet>;
};

export default PrivateRoute;
