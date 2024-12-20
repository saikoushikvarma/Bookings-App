import { useNavigate } from "react-router-dom";
import { baseUrlForImages } from "../assets/contants";
import { PlacesType } from "../pages/Accounts/Subpages/Accomodations";
import { AccountsActions } from "../contextAPI/userContext/types";

const PlacesList = ({ data }: { data: PlacesType[] }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-10 gap-5 flex flex-col px-5">
      {data?.map?.((item) => (
        <div
          className="flex p-5 gap-5 bg-gray-300 rounded-2xl cursor-pointer"
          onClick={() => {
            navigate(
              `/account/myaccommodations/${AccountsActions.edit}/${item?.id}`
            );
          }}
          key={item.id}
        >
          <img
            className="size-32 rounded-lg self-center"
            src={`${baseUrlForImages}${item?.photos?.[0]}`}
          />
          <div>
            <h1 className="text-2xl">{item?.title}</h1>
            <p className="max-h-32 overflow-auto">{item?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
