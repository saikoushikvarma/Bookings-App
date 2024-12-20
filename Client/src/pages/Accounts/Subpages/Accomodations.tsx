import { Link, useParams } from "react-router-dom";
import {
  AccountsActions,
  FormStateAccomodation,
} from "../../../contextAPI/userContext/types";
import AddNewAccomodations from "./Actions/AddNewAccomodationsForm";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import axios from "axios";
import { localTokenKey } from "../../../assets/contants";
import PlacesList from "../../../components/PlacesList";

export type PlacesType = FormStateAccomodation & {
  id: number;
};

const Accommodations = () => {
  const { action } = useParams();

  const [data, setDate] = useState<PlacesType[]>([]);

  useEffect(() => {
    if (isEmpty(action)) {
      axios
        .get("/user-places", {
          headers: {
            Authorization: localStorage.getItem(localTokenKey),
          },
        })
        .then((res) => {
          const placesData = res.data?.map((item) => ({
            title: item.title,
            address: item.address,
            photos: item.photos,
            description: item.description,
            perks: item.perks,
            extraInfo: item.extrainfo,
            checkIn: item.checkin,
            checkOut: item.checkout,
            maxGuest: item.maxguest,
            id: item.id,
          }));

          setDate(placesData);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }, [action]);

  console.log(data);

  return (
    <>
      {action === AccountsActions.new || action === AccountsActions.edit ? (
        <AddNewAccomodations />
      ) : (
        <div className="">
          <div className="flex justify-center mt-5 px-5">
            <Link
              to={`/account/myaccommodations/${AccountsActions.new}`}
              className="inline-flex gap-1 px-3 bg-primary py-2 rounded-full text-white"
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add New Place
            </Link>
          </div>
          <PlacesList data={data} />
        </div>
      )}
    </>
  );
};

export default Accommodations;
