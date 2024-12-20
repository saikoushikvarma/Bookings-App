import { Actions, actionsTypes, InitialState } from "./types";

export const userReducer = (state: InitialState, action: Actions) => {
  switch (action.type) {
    case actionsTypes.USER_NAME:
      return {
        ...state,
        userName: action.payload,
      };
    case actionsTypes.USER_LOGIN_STATUS:
      return {
        ...state,
        isUserLogged: action.payload,
      };
    case actionsTypes.PROFILE_LOADING:
      return {
        ...state,
        isProfileLoadingCompletes: action.payload,
      };
    case actionsTypes.PROFILE_IMAGE:
      return {
        ...state,
        profileImage: action.payload,
      };
    default:
      throw { message: "no action found" };
  }
};
