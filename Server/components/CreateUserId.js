const crypto = require("crypto");

const key = "Sai_Koushik_Varm";
const vi = crypto.randomBytes(12);

const createHashCustomerId = (value) => {
  const myKey = crypto.createCipheriv("aes-128-gcm", key, vi);
  crypto.hash;
  let hash = myKey.update(value, "utf8", "hex");
  hash += myKey.final("hex");
  return hash;
};

const decryptHashCustomerId = (hashId) => {
  const mykey = crypto.createDecipheriv("aes-128-gcm", key, vi);
  let decode = mykey.update(hashId, "hex", "utf8");
  decode += mykey.final("utf8");

  return decode;
};

module.exports = {
  createHashCustomerId,
  decryptHashCustomerId,
};
