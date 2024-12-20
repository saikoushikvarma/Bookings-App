const profileWithImage = `
SELECT users.id, users.username, users.email, userprofileimage.image_id from users
left JOIN userprofileimage ON users.id = userprofileimage.user_id
where users.id = $1
`;

module.exports = {
  profileWithImage,
};
