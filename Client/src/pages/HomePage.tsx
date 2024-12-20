import { useContext, useEffect, useState } from "react";
import { FormStateAccomodation } from "../contextAPI/userContext/types";
import axios from "axios";
import { baseUrlForImages } from "../assets/contants";
import ImageCaurousal from "../components/ImageCaurousal";
import { userContext } from "../contextAPI/userContext";
import { useNavigate } from "react-router-dom";

export type Places = FormStateAccomodation & {
  created_at: Date;
  updated_at: Date;
  username: string;
  email: string;
  id: number;
};

const HomePage = () => {
  const [data, setData] = useState<Places[]>([]);
  const [count, setCount] = useState<number>(0);
  const {
    state: { isUserLogged },
  } = useContext(userContext);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/places").then((res) => {
      setData(res.data.rows);
      setCount(res.data.rowCount);
    });
  }, []);

  const handleOnClick = (id: number) => {
    if (isUserLogged) {
      navigate(`/place/${id}`);
    } else {
      navigate("/login", { state: { id } });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {data?.map((item) => (
        <div className="" key={item.id}>
          <ImageCaurousal
            baseUrl={baseUrlForImages}
            images={[...item?.photos]}
            count={item.photos.length}
            onPress={() => handleOnClick(item.id)}
          />
          <h2 className="text-md font-bold truncate mt-2">{item?.address}</h2>
          <h3 className="text-gray-400 leading-2.5">{item?.title}</h3>
          <h2 className="font-medium">$ {item.price}</h2>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
