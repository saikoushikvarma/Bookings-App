import { useContext, useState } from "react";
import { localTokenKey } from "../assets/contants";
import { userContext } from "../contextAPI/userContext";
import axios from "axios";
import { actionsTypes, UserData } from "../contextAPI/userContext/types";

const useGetProfile = () => {
  const { dispatch } = useContext(userContext);
  const token = localStorage.getItem(localTokenKey);
  const [userData, setUserData] = useState<UserData>({} as UserData);

  const getProfile = () => {
    dispatch({ type: actionsTypes.PROFILE_LOADING, payload: true });
    axios
      .get("/profile", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        const { userName, email, id, image_id } = res.data;
        setUserData({ userName, email, id });
        dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: true });
        dispatch({ type: actionsTypes.USER_NAME, payload: userName });
        dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: image_id });
      })
      .catch((err) => {
        dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: false });
        dispatch({ type: actionsTypes.USER_NAME, payload: "" });
      })
      .finally(() => {
        dispatch({ type: actionsTypes.PROFILE_LOADING, payload: false });
      });
  };

  return { getProfile, userData };
};

export default useGetProfile;
