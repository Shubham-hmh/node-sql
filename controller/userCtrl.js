


const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const mysql = require("mysql")
const { db } = require("../config/db");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");



//CREATE USER
const createUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM users WHERE username = ?"
        const search_query = mysql.format(sqlSearch, [username])
        const sqlInsert = "INSERT INTO users VALUES (0,?,?)"
        const insert_query = mysql.format(sqlInsert, [username, hashedPassword])

       
        await connection.query(search_query, async (err, result) => {
            if (err) throw (err)
            console.log("------> Search Results")
            console.log(result.length)
            if (result.length != 0) {
                connection.release()
                console.log("------> User already exists")
                res.sendStatus(409)
            }
            else {
                await connection.query(insert_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    console.log("--------> Created new User")
                    console.log(result.insertId)
                    res.sendStatus(201)
                })
            }
        })
    })
})



//LOGIN (AUTHENTICATE USER, and return accessToken)
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    db.getConnection(async (err, connection) => {
        if (err) throw (err)
        const sqlSearch = "Select * from users where username = ?"
        const search_query = mysql.format(sqlSearch, [username])
        await connection.query(search_query, async (err, result) => {
            connection.release()

            if (err) throw (err)
            if (result.length == 0) {
                console.log("--------> User does not exist")
                res.sendStatus(404)
            }
            else {
                const hashedPassword = result[0].password
                //get the hashedPassword from result
                if (await bcrypt.compare(password, hashedPassword)) {
                    console.log("---------> Login Successful")
                    console.log("---------> Generating accessToken")
                    const token = generateToken({ user: username })
                    const refreshToken = generateRefreshToken({ user: username })
                    console.log(refreshToken)
                    res.cookie('refreshToken', refreshToken, {
                                    httpOnly: true,
                                    maxAge: 72 * 60 * 60 * 1000,
                                });
                    res.json({ accessToken: token, refreshToken: refreshToken })
                } else {
                    res.send("Password incorrect!")
                }
            }
        })
    })
})

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    console.log(req.cookies)
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new Error("No refresh token in cookies");
    }
    const verifyToken = jwt.verify(refreshToken, process.env.JWT_KEY);
    if (!verifyToken) {
        throw new Error("Invalid refresh token");
    }

    // Generate new access token
    const accessToken = generateToken(verifyToken.userId);
    res.json({ accessToken });
});

// Logout functionality
const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }

    // Clear refresh token from database
    // const clearRefreshTokenQuery = 'UPDATE users SET refreshToken = NULL WHERE refreshToken = ?';
    // await connection.query(clearRefreshTokenQuery, [refreshToken]);

    // Clear refresh token from cookies
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });

    res.sendStatus(204);
});



const createDashboard = asyncHandler(async (req, res) => {
    try {
     
        res.json("Hii You are authorized user...");

    } catch (error) {
        throw new Error(error);

    }

});


module.exports = {
    createUser,
    loginUserCtrl,
    logout,
    handleRefreshToken,createDashboard
};
