const fetchUserRow = `
SELECT * FROM users WHERE email = $1
`;

const fetchUserProfileImage = `
SELECT * FROM userprofileimage WHERE user_id = $1
`;

const fetchPlaces = `
SELECT * FROM places
WHERE user_id = $1
`;

const fetchPlaceBasedOnId = `
SELECT * FROM places
WHERE id = $1
`;

const places = `
SELECT places.*, users.username, users.email FROM public.places
LEFT JOIN users on places.user_id = users.id
ORDER BY updated_at DESC
`;

const placeById = `
SELECT places.*, users.username, users.email FROM places
LEFT JOIN users ON users.id = places.user_id
WHERE places.id = $1
ORDER BY updated_at DESC
`;

module.exports = {
  fetchUserRow,
  fetchUserProfileImage,
  fetchPlaces,
  fetchPlaceBasedOnId,
  places,
  placeById,
};
