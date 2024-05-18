



const mysql = require("mysql")
const { db } = require("../config/db");
const validator = require('validator');
const multer = require('multer');
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const path = require('path');

const validateInput = ({ name, address, email, phoneNumber, password, patientPhoto, psychiatrist_id }) => {

    if (!name) return 'Name is required';
    if (!address || address.length < 10) return 'Address should be at least 10 characters';
    if (!email || !validator.isEmail(email)) return 'Invalid email address';
    if (!phoneNumber || !/^\+\d{10,}$/.test(phoneNumber)) return 'Phone number should be at least 10 numbers with country code';
    if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/.test(password)) {
        return 'Password must contain one upper character, one lower character, and a number, with a length between 8 and 15 characters';
    }
    if (!patientPhoto) return 'Patient photo is required';
    if (!psychiatrist_id) return 'psychiatristId is required';
    return null;
};



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

//CREATE PATIENT
const createPatient = asyncHandler(async (req, res) => {
    const { name, address, email, phoneNumber, password, psychiatrist_id } = req.body;

    const patientPhoto = req.file ? req.file.path : null;

    console.log(req.body)


    // Validate input
    const validationError = validateInput({ name, address, email, phoneNumber, password, patientPhoto, psychiatrist_id });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    if (!patientPhoto) {
        return res.status(400).json({ message: 'Patient photo is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw err;

        const sqlSearch = "SELECT * FROM patients_details WHERE email = ?";
        const search_query = mysql.format(sqlSearch, [email]);
        const sqlInsert = "INSERT INTO patients_details (name, address, email, phoneNumber, password, patientPhoto, psychiatrist_id) VALUES (?, ?, ?, ?, ?, ?,?)";
        const insert_query = mysql.format(sqlInsert, [name, address, email, phoneNumber, hashedPassword, patientPhoto, psychiatrist_id]);

        connection.query(search_query, async (err, result) => {
            if (err) {
                connection.release();
                throw err;
            }

            if (result.length != 0) {
                connection.release();
                console.log("------> User already exists");
                return res.status(409).json({ message: "Email already exists" });
            } else {
                connection.query(insert_query, (err, result) => {
                    connection.release();
                    if (err) {
                        throw err;
                    }
                    console.log("--------> Created new User");
                    console.log(result.insertId);
                    return res.status(201).json({ message: "User created successfully", userId: result.insertId });
                });
            }
        });
    });
});


const getPatient = asyncHandler(async (req, res) => {
   
    const { hospitalId } = req.body;

    if (!hospitalId) {
        return res.status(400).json({ message: 'Hospital ID is required' });
    }

    // Query to get hospital name
    const hospitalQuery = 'SELECT name FROM hospitals WHERE id = ?';
    db.query(hospitalQuery, [hospitalId], (err, hospitalResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (hospitalResult.length === 0) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        
        const hospitalName = hospitalResult[0].name;

        // Query to get psychiatrists and their patient count
        const psychiatristQuery = `
            SELECT 
                p.id AS psychiatristId, 
                p.name AS psychiatristName, 
                COUNT(pt.id) AS patientsCount 
            FROM 
                psychiatrists p 
            LEFT JOIN 
                patients_details pt 
            ON 
                p.id = pt.psychiatrist_id 
            WHERE 
                p.hospital_id = ? 
            GROUP BY 
                p.id
        `;

        db.query(psychiatristQuery, [hospitalId], (err, psychiatristResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            const psychiatristDetails = psychiatristResult.map(row => ({
                id: row.psychiatristId,
                name: row.psychiatristName,
                patientsCount: row.patientsCount
            }));

            const totalPsychiatristsCount = psychiatristDetails.length;
            const totalPatientsCount = psychiatristDetails.reduce((acc, psychiatrist) => acc + psychiatrist.patientsCount, 0);

            // Construct the response
            const response = {
                hospitalName,
                totalPsychiatristsCount,
                totalPatientsCount,
                psychiatristDetails
            };

            res.status(200).json(response);
        });
    });
});


module.exports = {
    createPatient, upload, getPatient
};
