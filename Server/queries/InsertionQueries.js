const userInsertion = `
INSERT INTO users (id, username, email,password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;
`;

const profilePictureInsertion = `
INSERT INTO userprofileimage (user_id, image_id) VALUES($1, $2)
`;

const placeInserstion = `
INSERT INTO places (user_id, title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuest, price)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
`;

module.exports = {
  userInsertion,
  profilePictureInsertion,
  placeInserstion,
};
