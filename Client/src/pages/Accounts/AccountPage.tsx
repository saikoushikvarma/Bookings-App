import { useCallback, useContext, useEffect, useMemo } from "react";
import { userContext } from "../../contextAPI/userContext";
import { AccountSubpages } from "../../contextAPI/userContext/types";
import { NavLink, useParams } from "react-router-dom";
import useGetProfile from "../../services/useGetProfile";
import Profile from "./Subpages/ProfilePage";
import Bookings from "./Subpages/BookingsPage";
import Accommodations from "./Subpages/Accomodations";
import isEmpty from "lodash/isEmpty";

const AccountPage = () => {
  const { state, dispatch } = useContext(userContext);
  const { getProfile, userData } = useGetProfile();
  const { subpage } = useParams();
  const { isProfileLoadingCompletes } = state;

  useEffect(() => {
    if (isEmpty(subpage)) getProfile();
  }, []);

  const selectedTab = useMemo(() => {
    if (subpage === AccountSubpages.mybookings)
      return AccountSubpages.mybookings;
    else if (subpage === AccountSubpages.myaccommodations)
      return AccountSubpages.myaccommodations;
    else return AccountSubpages.profile;
  }, [subpage]);

  const renderPages = useCallback(() => {
    switch (true) {
      case selectedTab === AccountSubpages.mybookings:
        return <Bookings />;
      case selectedTab === AccountSubpages.myaccommodations:
        return <Accommodations />;
      default:
        return <Profile userData={userData} />;
    }
  }, [isProfileLoadingCompletes, selectedTab, userData]);

  console.log("data--->", subpage);

  return (
    <>
      <nav className="flex justify-center gap-10">
        <NavLink
          className={`navStyles ${
            selectedTab == AccountSubpages.profile && "navSelected"
          } inline-flex gap-2  bg-gray-300 rounded-full`}
          to={"/account"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          Profile
        </NavLink>
        <NavLink
          className={`navStyles ${
            selectedTab == AccountSubpages.mybookings && "navSelected"
          } inline-flex gap-2 bg-gray-300 rounded-full`}
          to={`/account/${AccountSubpages.mybookings}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          My Bookings
        </NavLink>
        <NavLink
          className={`navStyles ${
            selectedTab == AccountSubpages.myaccommodations && "navSelected"
          } inline-flex gap-2  bg-gray-300 rounded-full`}
          to={`/account/${AccountSubpages.myaccommodations}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
            />
          </svg>
          My Accommodations
        </NavLink>
      </nav>
      {renderPages()}
    </>
  );
};

export default AccountPage;
