const express = require("express");
const userController = require("../../controller/userContoller");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const middleware = require("../../middleware/middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(
  "/addemployee",
  middleware.authenticateAdmin,
  userController.addEmployee
);
router.post(
  "/addemployees",
  [upload.single("file"), middleware.authenticateAdmin],
  userController.addEmployees
);
router.put(
  "/updateemployee",
  middleware.authenticateAdmin,
  userController.updateEmployee
);
router.delete(
  "/deleteemployee",
  middleware.authenticateAdmin,
  userController.deleteEmployee
);
router.get(
  "/getemployee",
  middleware.authenticateAdmin,
  userController.getEmployee
);
router.get(
  "/getemployees",
  middleware.authenticateAdmin,
  userController.getEmployees
);

module.exports = router;
