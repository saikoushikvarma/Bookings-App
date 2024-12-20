const deleteProfileImage = `
DELETE FROM userprofileimage
WHERE user_id = $1
RETURNING *
`;

module.exports = {
  deleteProfileImage,
};
