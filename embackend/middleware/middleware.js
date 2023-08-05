const jwt = require("jsonwebtoken");
const response = require("../utils/response");
const { getUserByEmail } = require("../config/documentdb");

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return response(res, 401, false, {
        message: "Fail to authenticate token.",
      });
    }
    console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // req.id = decoded.id;
      const user = await getUserByEmail(decoded.id);
      if (user.role !== "admin") {
        return response(res, 403, false, {
          message: "Invalid Authorization",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return response(res, 403, false, {
        message: "Failed to authenticate token" + err,
      });
    }
  } catch (error) {
    return response(res, 401, false, { message: "No token provided" });
  }
};

module.exports = {
  authenticateAdmin,
};
