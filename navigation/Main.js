import React from "react";
import { useSelector } from "react-redux";
import UserNavigator from "./UserNavigator";
import ResidentNavigator from "./ResidentNavigator";
import AdminNavigator from "./AdminNavigator";
import TechnicianNavigator from "./TechnicianNavigator";
const Main = () => {
  const user = useSelector((state) => state.auth);
  
  return (
          // <ResidentNavigator />
              // <AdminNavigator />
              // <TechnicianNavigator />
              // <UserNavigator />
    <>
      {user.isAuthenticated ? (
        user.user.user.role === "Resident" ? (
          <ResidentNavigator />


        ) : user.user.user.role === "Admin" ? (
          <AdminNavigator />

        ) : (
          <TechnicianNavigator />

        )
      ) : (

        <UserNavigator />
      )}
    </>
  );
  
};

export default Main;