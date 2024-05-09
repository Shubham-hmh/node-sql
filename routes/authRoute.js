const express = require("express");
const { createUser, loginUserCtrl,logout,handleRefreshToken,createDashboard} = require("../controller/userCtrl");
const {  validateToken } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/logout",logout);
router.get("/refresh",handleRefreshToken);
router.get("/dashboard",validateToken,createDashboard)

module.exports = router;
