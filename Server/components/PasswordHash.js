const bcrypt = require("bcryptjs");

const bcryptSaltKey = bcrypt.genSaltSync(5);

const createHashPassword = (password) => {
  return bcrypt.hashSync(password, bcryptSaltKey);
};

const compareHashPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = {
  createHashPassword,
  compareHashPassword,
};
