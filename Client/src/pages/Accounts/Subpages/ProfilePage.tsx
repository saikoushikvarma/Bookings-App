import axios, { AxiosError } from "axios";
import { actionsTypes, UserData } from "../../../contextAPI/userContext/types";
import { ButtonHTMLAttributes, useContext } from "react";
import { userContext } from "../../../contextAPI/userContext";
import Spinner from "../../../components/Spinner";
import {
  baseUrlForImages,
  defaultAvtarIcon,
  localTokenKey,
} from "../../../assets/contants";
import isEmpty from "lodash/isEmpty";

const Profile = ({ userData }: { userData: UserData }) => {
  const { state, dispatch } = useContext(userContext);
  const { isProfileLoadingCompletes, profileImage } = state;

  const handleLogout = () => {
    axios
      .post("/logout")
      .then((res) => {
        dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: false });
        dispatch({ type: actionsTypes.USER_NAME, payload: "" });
        dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: "" });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        localStorage.removeItem(localTokenKey);
      });
  };

  const addProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const formData = new FormData();
    const mode = isEmpty(profileImage) ? "add" : "update";
    formData.append("Picture", files[0]);
    formData.append("Mode", mode);
    formData.append("UserId", userData.id);

    axios
      .post("/addProfilePicture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem(localTokenKey),
        },
      })
      .then((res) => {
        const { image_id } = res.data;
        console.log("profileImage--->", res.data);

        dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: image_id });
      })
      .catch((err: AxiosError) => {
        if (err.response?.data?.error == "jwt expired") {
          dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: false });
          dispatch({ type: actionsTypes.USER_NAME, payload: "" });
          dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: "" });
        } else {
          alert(err.message);
        }
      });
  };

  const removeProfilePicture = (event: MouseEvent) => {
    event.preventDefault();

    axios
      .delete("/addProfilePicture", {
        headers: {
          Authorization: localStorage.getItem(localTokenKey),
        },
      })
      .then((res) => {
        dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: "" });
      })
      .catch((err: AxiosError) => {
        if (err.response?.data?.error == "jwt expired") {
          dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: false });
          dispatch({ type: actionsTypes.USER_NAME, payload: "" });
          dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: "" });
        } else {
          alert(err.message);
        }
      });
  };

  if (isProfileLoadingCompletes) return <Spinner />;
  console.log(`${baseUrlForImages}${profileImage}`);

  return (
    <div className="flex flex-col w-1/2 items-center self-center mt-10 gap-5">
      <div>
        <img
          src={
            isEmpty(profileImage)
              ? defaultAvtarIcon
              : `${baseUrlForImages}${profileImage}`
          }
          className="w-52 h-52 object-cover rounded-full border-gray-300 border-4"
        />
        <div className="flex items-center gap-10">
          <button className="primaryBtn">
            <label>
              {isEmpty(profileImage) ? "Add" : "Update"}
              <input
                type="file"
                className="hidden"
                onChange={addProfilePicture}
              />
            </label>
          </button>

          <button className="disablePrimary" onClick={removeProfilePicture}>
            Remove
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <h1 className="text-lg font-[700]">
          {`UserName: `}{" "}
          <span className="text-md font-[400]">{" " + userData.userName}</span>
        </h1>
      </div>
      <div className="flex items-center">
        <span className="text-lg font-[700]">
          Email :{" "}
          <span className="text-md font-[400]">{` ${userData.email}`}</span>
        </span>
      </div>
      <button type="submit" onClick={handleLogout} className="primaryBtn">
        logout
      </button>
    </div>
  );
};

export default Profile;
