const express = require("express");
const { createPatient ,upload,getPatient} = require("../controller/patientCtrl");
const router = express.Router();


router.post("/register", upload.single('patientPhoto'), createPatient);
router.post("/hospital-details",  getPatient);


module.exports = router;
