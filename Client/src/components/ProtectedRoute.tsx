import { useContext } from "react";
import { userContext } from "../contextAPI/userContext";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(userContext);
  const navigate = useNavigate();

  if (!state.isUserLogged && !state.isProfileLoadingCompletes) {
    navigate("/");
  }

  return children;
};

export default ProtectedRoute;
