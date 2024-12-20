import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Actions, actionsTypes, InitialState } from "./types";
import { userReducer } from "./reducer";

const initialState: InitialState = {
  userName: "",
  isUserLogged: false,
  isProfileLoadingCompletes: true,
  profileImage: "",
};

export const userContext = createContext<{
  state: InitialState;
  dispatch: Dispatch<Actions>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <div>
      <userContext.Provider value={{ state, dispatch }}>
        {children}
      </userContext.Provider>
    </div>
  );
};
