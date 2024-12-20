const profileImageUpdate = `
UPDATE userprofileimage
SET image_id = $1
WHERE user_id = $2
`;

const updatePlaces = `
UPDATE places
SET title = $2, address = $3, photos = $4, description = $5, perks = $6, extraInfo = $7, checkIn = $8, checkOut = $9, maxGuest = $10, price = $11, updated_at = CURRENT_TIMESTAMP
WHERE id = $1
`;

module.exports = {
  profileImageUpdate,
  updatePlaces,
};
