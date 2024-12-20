export enum actionsTypes {
  USER_NAME = "USER_NAME",
  USER_LOGIN_STATUS = "USER_LOGIN_STATUS",
  PROFILE_LOADING = "PROFILE_LOADING",
  PROFILE_IMAGE = "PROFILE_IMAGE",
}

export enum AccountSubpages {
  profile = "profile",
  mybookings = "mybookings",
  myaccommodations = "myaccommodations",
}

export enum AccountsActions {
  new = "new",
  edit = "edit",
}

type TokenAction = {
  type: actionsTypes;
  payload: string;
};

type UserActivityAction = {
  type: actionsTypes;
  payload: boolean;
};

type ProfileLoadingAction = {
  type: actionsTypes;
  payload: boolean;
};

export type FormStateAccomodation = {
  title: string;
  address: string;
  photos: string[];
  description: string;
  perks: string[];
  extraInfo: string;
  checkIn: string;
  checkOut: string;
  maxGuest: string;
  price: string;
};

export type UserData = {
  userName: string;
  email: string;
  id: string;
};

export type InitialState = {
  userName: string;
  isUserLogged: boolean;
  isProfileLoadingCompletes: boolean;
  profileImage: string;
};

export type Actions = TokenAction | UserActivityAction | ProfileLoadingAction;
