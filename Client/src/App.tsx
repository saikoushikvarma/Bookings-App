import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Layout from "./layout/Layout";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import axios from "axios";
import { useContext, useEffect } from "react";
import { userContext } from "./contextAPI/userContext";
import { localTokenKey } from "./assets/contants";
import { isEmpty } from "lodash";
import { actionsTypes } from "./contextAPI/userContext/types";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountPage from "./pages/Accounts/AccountPage";
import useGetProfile from "./services/useGetProfile";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";

axios.defaults.baseURL = "http://localhost:4000";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginScreen />,
      },
      {
        path: "/register",
        element: <RegisterScreen />,
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account/:subpage",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account/:subpage/:action",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/account/:subpage/:action/:id",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/place/:id",
        element: (
          <ProtectedRoute>
            <PlaceDetailsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const { dispatch } = useContext(userContext);
  const token = localStorage.getItem(localTokenKey);
  const { getProfile } = useGetProfile();

  useEffect(() => {
    if (isEmpty(token)) {
      dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: false });
      dispatch({ type: actionsTypes.USER_NAME, payload: "" });
      dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: "" });
    } else {
      getProfile();
    }
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
