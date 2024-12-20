import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import {
  actionsTypes,
  FormStateAccomodation,
} from "../../../../contextAPI/userContext/types";
import axios, { AxiosError } from "axios";
import ToastModal from "../../../../components/ToastModal";
import { localTokenKey } from "../../../../assets/contants";
import { isEmpty } from "lodash";
import { userContext } from "../../../../contextAPI/userContext";
import Perks from "../../../../components/Perks";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const baseUrlForImages = "http://localhost:4000/uploads/";

export const formStateAccomodation = {
  title: "",
  address: "",
  photos: [],
  description: "",
  perks: [],
  extraInfo: "",
  checkIn: "",
  checkOut: "",
  maxGuest: "",
  price: "",
};

const AddNewAccomodations = () => {
  const { id } = useParams();
  const [form, setForm] = useState<FormStateAccomodation>(
    formStateAccomodation
  );
  const navigate = useNavigate();
  const [addPhotoLink, setAddPhotoLink] = useState("");
  const [toast, setToast] = useState({
    show: false,
    title: "",
    isError: false,
  });
  const { dispatch } = useContext(userContext);

  useEffect(() => {
    if (!isEmpty(id)) {
      axios
        .get(`/place/${id}`, {
          headers: {
            Authorization: localStorage.getItem(localTokenKey),
          },
        })
        .then((res) => {
          console.log("response--->", res);
          const {
            address,
            checkin,
            checkout,
            description,
            extrainfo,
            maxguest,
            perks,
            photos,
            title,
            price,
          } = res.data;

          setForm({
            address,
            checkIn: checkin,
            checkOut: checkout,
            description,
            extraInfo: extrainfo,
            maxGuest: maxguest,
            perks,
            photos,
            title,
            price,
          });
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }, [id]);

  const authenticationError = (err: AxiosError) => {
    if (err.response?.data?.error == "jwt expired") {
      dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: false });
      dispatch({ type: actionsTypes.USER_NAME, payload: "" });
      dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: "" });
    }
    setToast((prev) => ({
      ...prev,
      show: true,
      title: err.message,
      isError: true,
    }));
  };

  const addPhoto = (ev: SubmitEvent) => {
    ev.preventDefault();
    axios
      .post(
        "/url",
        {
          url: addPhotoLink,
        },
        {
          headers: {
            Authorization: localStorage.getItem(localTokenKey),
          },
        }
      )
      .then((res) => {
        const { file } = res.data;
        if (!isEmpty(file)) {
          setForm((prev) => {
            if (!prev.photos.includes(file)) {
              return { ...prev, photos: [...prev.photos, file] };
            }
            return prev;
          });
          setAddPhotoLink("");
        }
        console.log("addPhotoResponse--->", res.data);
      })
      .catch((err: AxiosError) => {
        authenticationError(err);
      });
  };

  const uploadImage = (ev: InputEvent) => {
    const { files } = ev.target;
    console.log("files--->", files);

    const formData = new FormData();

    for (let i = 0; i < files?.length; i++) {
      formData.append("Photos", files[0]);
    }

    axios
      .post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem(localTokenKey),
        },
      })
      .then((res) => {
        if (res?.data) {
          setForm((prev) => ({
            ...prev,
            photos: [...prev?.photos, ...res?.data],
          }));
        }
      })
      .catch((err) => {});
  };

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    switch (name) {
      case "title":
        setForm((prev) => ({
          ...prev,
          title: value,
        }));
        break;
      case "address":
        setForm((prev) => ({
          ...prev,
          address: value,
        }));
        break;
      case "description":
        setForm((prev) => ({
          ...prev,
          description: value,
        }));
        break;
      case "extraInfo":
        setForm((prev) => ({
          ...prev,
          extraInfo: value,
        }));
        break;
      case "checkin":
        setForm((prev) => ({
          ...prev,
          checkIn: value,
        }));
        break;
      case "checkout":
        setForm((prev) => ({
          ...prev,
          checkOut: value,
        }));
        break;
      case "maxGuests":
        setForm((prev) => ({
          ...prev,
          maxGuest: value,
        }));
        break;
      case "price":
        setForm((prev) => ({
          ...prev,
          price: value,
        }));
        break;
      default:
        break;
    }
  };

  const deleteUploadedPhoto = (
    ev: React.MouseEvent<HTMLButtonElement>,
    item: string
  ) => {
    ev.preventDefault();

    axios
      .post(
        "/uploadsDelete",
        { image_id: item },
        {
          headers: {
            Authorization: localStorage.getItem(localTokenKey),
          },
        }
      )
      .then((res) => {
        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos.filter((record) => record != item)],
        }));
      })
      .catch((err) => alert(err.message));
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (isEmpty(id)) {
      axios
        .post("/addplace", form, {
          headers: {
            Authorization: localStorage.getItem(localTokenKey),
          },
        })
        .then((res) => {
          navigate("/account/myaccommodations");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      axios
        .put(`/placeEdit/${id}`, form, {
          headers: {
            Authorization: localStorage.getItem(localTokenKey),
          },
        })
        .then((res) => {
          navigate("/account/myaccommodations");
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  return (
    <div className="mt-5 relative px-5">
      {toast?.show && (
        <ToastModal
          title={toast.title}
          handleShow={() => {
            setToast((prev) => ({
              ...prev,
              show: false,
            }));
          }}
          isError={toast.isError}
        />
      )}
      <form className="" onSubmit={handleSubmit}>
        <div className="flex flex-col py-3">
          <h1 className="text-2xl">Title</h1>
          <p className="text-gray-500">
            Title for your place should be short and catchy as in advertisment
          </p>
          <input
            placeholder="title, for example: my lovely apt"
            className="border-gray-300 border rounded-full py-2 px-5"
            name="title"
            onChange={onInputChange}
            value={form.title}
          />
        </div>
        <div className="flex flex-col py-3">
          <h1 className="text-2xl">Address</h1>
          <p className="text-gray-500">Address to this places</p>
          <input
            placeholder="Address"
            className="border-gray-300 border rounded-full py-2 px-5"
            name="address"
            onChange={onInputChange}
            value={form.address}
          />
        </div>
        <div className="py-3">
          <h1 className="text-2xl">Photos</h1>
          <p className="text-gray-500">more = better</p>
          <div className="flex gap-2">
            <input
              placeholder="Add using a link ....jpg"
              className="border-gray-300 border rounded-full py-2 px-5 flex-grow"
              value={addPhotoLink}
              onChange={(ev) => setAddPhotoLink(ev.target.value)}
            />
            <button
              className={`${
                isEmpty(addPhotoLink)
                  ? "bg-gray-300 text-black"
                  : "bg-blue-600 text-white"
              } rounded-xl p-2`}
              onClick={addPhoto}
              disabled={isEmpty(addPhotoLink)}
            >
              Add Photo
            </button>
          </div>
          <div
            className={
              "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3"
            }
          >
            {form?.photos?.map((item) => {
              return (
                <div className="relative flex justify-center">
                  <img
                    src={`${baseUrlForImages}${item}`}
                    className="object-cover h-48 w-96 rounded-2xl cursor-pointer"
                    key={item}
                    onClick={() => {
                      const updatedPhotos = [...form.photos];
                      updatedPhotos.unshift(item);
                      setForm((prev) => ({
                        ...prev,
                        photos: [...new Set(updatedPhotos)],
                      }));
                    }}
                  />
                  <button
                    onClick={(ev) => {
                      deleteUploadedPhoto(ev, item);
                    }}
                    className="size-10 absolute bottom-2 cursor-pointer bg-gray-400 flex items-center justify-center rounded-full "
                  >
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          <label className="text-2xl cursor-pointer items-center inline-flex justify-center p-5 border mt-2 rounded-xl gap-2">
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
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
            Upload
            <input
              type="file"
              name="file"
              className=" left-0 self-center hidden"
              onChange={uploadImage}
              accept=".jpg, .jpeg, .png, .webp"
              multiple
            />
          </label>
        </div>
        <div className="flex flex-col py-3">
          <h1 className="text-2xl">Description</h1>
          <p className="text-gray-500">description of the place</p>
          <textarea
            name="description"
            placeholder="description..."
            className="border border-gray-300 rounded-xl p-3"
            onChange={onInputChange}
            value={form.description}
          />
        </div>
        <div className="py-3">
          <h1 className="text-2xl">Perks</h1>
          <p className="text-gray-500">select all thr perks of your place</p>
          <Perks
            selected={form.perks}
            onChange={(selected) =>
              setForm((prev) => ({ ...prev, perks: [...selected] }))
            }
          />
          <div className="flex flex-col py-3">
            <h1 className="text-2xl">Extra info</h1>
            <p className="text-gray-500">house rules, etc</p>
            <input
              placeholder="title, for example: my lovely apt"
              className="border-gray-300 border rounded-full py-2 px-5"
              name="extraInfo"
              onChange={onInputChange}
              value={form.extraInfo}
            />
          </div>
          <div className="py-3">
            <h1 className="text-2xl">Check in & out times</h1>
            <p className="text-gray-500">
              add check in and out times, guest members are allowed
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex flex-col">
                <h1 className="text-sm font-bold">Check in time</h1>
                <input
                  placeholder="checkIn time"
                  className="border-gray-300 border rounded-full py-2 px-5"
                  name="checkin"
                  onChange={onInputChange}
                  value={form.checkIn}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold">Check out time</h1>
                <input
                  placeholder="checkOut time"
                  className="border-gray-300 border rounded-full py-2 px-5"
                  name="checkout"
                  onChange={onInputChange}
                  value={form.checkOut}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold">Max members</h1>
                <input
                  placeholder="max members"
                  className="border-gray-300 border rounded-full py-2 px-5"
                  name="maxGuests"
                  onChange={onInputChange}
                  value={form.maxGuest}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold">Price</h1>
                <input
                  placeholder="max members"
                  className="border-gray-300 border rounded-full py-2 px-5"
                  name="price"
                  onChange={onInputChange}
                  value={form.price}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="primaryBtn">Submit</button>
      </form>
    </div>
  );
};

export default AddNewAccomodations;
