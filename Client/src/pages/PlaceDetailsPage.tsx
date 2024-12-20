import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Places } from "./HomePage";
import axios from "axios";
import { baseUrlForImages, localTokenKey } from "../assets/contants";

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<Places>();

  useEffect(() => {
    axios
      .get(`/place-details/${id}`, {
        headers: {
          Authorization: localStorage.getItem(localTokenKey),
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => alert(err.message));
  }, []);
  console.log(data);
  return (
    <div className="bg-gray-200 p-5 relative">
      <h1 className="text-2xl font-[500]">{data?.title}</h1>
      <div>
        <div className="py-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <h3 className="underline font-[500]">{data?.address}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1  md:grid-cols-[2fr_1fr_1fr] gap-2 overflow-hidden rounded-2xl">
        <div>
          <img
            className="aspect-square"
            src={`${baseUrlForImages}${data?.photos?.[0]}`}
          />
        </div>
        <div className="grid">
          <img
            className="aspect-square"
            src={`${baseUrlForImages}${data?.photos?.[1]}`}
          />
          <img
            className="aspect-square overflow-hidden relative top-2"
            src={`${baseUrlForImages}${data?.photos?.[2]}`}
          />
        </div>
        <div className="grid">
          <img
            className="aspect-square"
            src={`${baseUrlForImages}${data?.photos?.[3]}`}
          />
          <img
            className="aspect-square overflow-hidden relative top-2"
            src={`${baseUrlForImages}${data?.photos?.[4]}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsPage;
