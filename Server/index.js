require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const isEmpty = require("lodash/isEmpty");
const fs = require("fs");
const download = require("image-downloader");
const path = require("path");
const multer = require("multer");
const app = express();
const {
  createHashPassword,
  compareHashPassword,
} = require("./components/PasswordHash");
const { createHashCustomerId } = require("./components/CreateUserId");
const client = require("./Client");
const { sign } = require("jsonwebtoken");
const { verifyToken } = require("./middleWares/authMiddleware");
const {
  userInsertion,
  profilePictureInsertion,
  placeInserstion,
} = require("./queries/InsertionQueries");
const {
  userTableCreation,
  profileImageTableCreation,
  placeTableCreation,
} = require("./queries/TableCreationQueries");
const {
  fetchUserRow,
  fetchUserProfileImage,
  fetchPlaces,
  fetchPlaceBasedOnId,
  places,
  placeById,
} = require("./queries/fetchQueries");
const { profileImageUpdate, updatePlaces } = require("./queries/updateQueries");
const { deleteProfileImage } = require("./queries/deleteQueries");
const { profileWithImage } = require("./queries/joinQuires");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uploadsDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(uploadsDir));

app.post("/uploadsDelete", verifyToken, (req, res) => {
  const { image_id } = req.body;
  try {
    fs.rmSync(`${__dirname}/uploads/${image_id}`);
    res.status(200).json({
      message: "SuccessFully removed the image",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.post("/url", verifyToken, (req, res) => {
  const { url } = req.body;
  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
  }

  download
    .image({
      dest: __dirname + "/uploads",
      url,
    })
    .then(({ filename }) => {
      const file = path.basename(filename);
      console.log("fileUpload res--->", file);
      res.status(200).json({
        file,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: err.message,
      });
    });

  console.log("url--->", url);
});

app.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  if (isEmpty(userName))
    res.status(400).json({ errorMsg: "Username field is empty" });
  else if (isEmpty(password))
    res.status(400).json({ errorMsg: "Password field is empty" });
  else if (isEmpty(email))
    res.status(400).json({ errorMsg: "Email field is empty" });
  else {
    const server = await client.connect();
    try {
      const encryptPassword = createHashPassword(password);
      const id = createHashCustomerId(email);
      await server.query(userTableCreation);
      const response = await server.query(userInsertion, [
        id,
        userName,
        email,
        encryptPassword,
        new Date(),
      ]);
      if (response) {
        res.status(200).json({
          message: "Succesfull created user",
          customerId: id,
        });
      }
    } catch (err) {
      if (
        err?.message?.includes("duplicate key") &&
        err.message.includes("username")
      ) {
        res.status(422).json({
          code: 422,
          message: "Already user exits with Username",
        });
      } else if (
        err?.message?.includes("duplicate key") &&
        err.message.includes("email")
      ) {
        res.status(422).json({
          code: 422,
          message: "Already user exits with email",
        });
      } else {
        res.status(500).json({
          code: 500,
          message: err.message,
        });
      }
    } finally {
      server.release();
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const server = await client.connect();
  try {
    const data = await server.query(fetchUserRow, [email]);

    if (!isEmpty(data?.rows?.[0])) {
      const userData = data?.rows?.[0];
      const isPasswordCorrect = compareHashPassword(
        password,
        userData.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Incorrect Password" });
      else {
        const token = sign(
          {
            username: userData.username,
            email: userData.email,
            id: userData.id,
          },
          process.env.JWT_TOKEN,
          {
            expiresIn: "1h",
          }
        );
        await server.query(profileImageTableCreation);

        const joinProfile = await server.query(profileWithImage, [userData.id]);
        console.log("joinProfile--->", joinProfile.rows);
        res.json({
          message: "Login Success",
          accessToken: token,
          username: userData.username,
          image_id: isEmpty(joinProfile?.rows?.[0]?.image_id)
            ? ""
            : joinProfile?.rows?.[0]?.image_id,
        });
      }
    } else
      res.status(400).json({
        message: "User not found",
      });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  const data = req.body;

  const server = await client.connect();

  try {
    await server.query(profileImageTableCreation);
    const profileImage = await server.query(fetchUserProfileImage, [
      data?.userData?.id,
    ]);

    res.status(200).json({
      ...data?.userData,
      image_id: profileImage.rows?.[0]?.image_id || "",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.post("/logout", (req, res) => {
  res.status(200).json({
    message: "successfully logged out",
  });
});

const uploadMiddleWare = multer({ dest: "uploads" });

app.post(
  "/uploads",
  uploadMiddleWare.array("Photos", 100),
  verifyToken,
  (req, res) => {
    const { files } = req;
    console.log("request uploads", req.files);
    const uploadedImages = [];

    files.forEach((item) => {
      const originalPath = item?.path;
      const extension = item?.originalname?.split(".")?.[1];
      const newFileName = `${originalPath}.${extension}`;

      fs.renameSync(originalPath, newFileName);

      uploadedImages.push(newFileName.replace(`uploads\\`, ""));
    });

    res.status(200).json(uploadedImages);
  }
);

app.post(
  "/addProfilePicture",
  verifyToken,
  uploadMiddleWare.single("Picture"),
  async (req, res) => {
    const { Mode, UserId: user_id } = req.body;
    const { file } = req;
    const filePath = file?.path;
    const ext = file?.originalname?.split(".");
    const updatedName = `${filePath}.${ext[ext.length - 1]}`;
    console.log("file--->", file);
    fs.renameSync(filePath, updatedName);
    const image_id = updatedName?.replace("uploads\\", "");

    const server = await client.connect();
    try {
      await server.query(profileImageTableCreation);
      // const mode = isEmpty(profileImage) ? "add" : isRemove ? "remove" : "update";
      if (Mode === "update") {
        await server.query(profileImageUpdate, [image_id, user_id]);
        res.status(200).json({
          message: "SuccessFully updated image",
          image_id,
        });
      } else if (Mode === "add") {
        await server.query(profilePictureInsertion, [user_id, image_id]);
        res.status(200).json({
          message: "SuccessFully Added the image",
          image_id,
        });
      }
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    } finally {
      server.release();
    }
  }
);

app.delete("/addProfilePicture", verifyToken, async (req, res) => {
  const {
    userData: { id },
  } = req.body;

  console.log(req.body);
  const server = await client.connect();
  try {
    const { rows } = await server.query(deleteProfileImage, [id]);
    console.log("rows deleted--->", rows, __dirname);
    fs.rmSync(`${__dirname}/uploads/${rows?.[0]?.image_id}`);
    res.status(200).json({
      message: "SuccessFully removed the image",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.post("/addplace", verifyToken, async (req, res) => {
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    userData: { id },
    price,
  } = req.body;
  const server = await client.connect();

  try {
    await server.query(placeTableCreation);

    await server.query(placeInserstion, [
      id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
      price,
    ]);
    res.status(200).json({
      message: "successfully added new place",
    });

    console.log(req.body);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.get("/user-places", verifyToken, async (req, res) => {
  const {
    userData: { id },
  } = req.body;
  const server = await client.connect();

  try {
    await server.query(placeTableCreation);
    const { rows } = await server.query(fetchPlaces, [id]);

    res.status(200).json(rows);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.get("/place/:id", verifyToken, async (req, res) => {
  const { id: itemId } = req.params;

  const server = await client.connect();
  try {
    const { rows } = await server.query(fetchPlaceBasedOnId, [itemId]);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    server.release();
  }
});

app.put("/placeEdit/:id", verifyToken, async (req, res) => {
  const {
    title,
    address,
    photos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    price,
  } = req.body;

  const { id } = req.params;
  const server = await client.connect();

  try {
    await server.query(updatePlaces, [
      id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
      price,
    ]);
    res.status(200).json({
      message: "successfully updated the record",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.get("/places", async (req, res) => {
  const server = await client.connect();

  try {
    const { rows, rowCount } = await server.query(places);

    res.status(200).json({
      rowCount,
      rows,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.get("/place-details/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const server = await client.connect();

  try {
    const { rows } = await server.query(placeById, [id]);

    res.status(200).json({
      data: rows[0],
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  } finally {
    server.release();
  }
});

app.listen(4000, (req, res) => {});
