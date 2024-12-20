const { verify } = require("jsonwebtoken");
const { isEmpty } = require("lodash");

const verifyToken = (req, res, next) => {
  const Authorization = req.header("Authorization");

  if (!Authorization)
    return res.status(401).json({
      error: "Access denied",
    });

  try {
    const decode = verify(Authorization, process.env.JWT_TOKEN);
    if (isEmpty(decode))
      return res.status(401).json({
        error: "Access denied",
      });

    req.body.userData = {
      userName: decode.username,
      email: decode.email,
      id: decode.id,
    };
    next();
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
};

module.exports = {
  verifyToken,
};
