

const {connection} = require('../config/db');
const jwt = require("jsonwebtoken");



function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    if (token == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) { 
     res.status(403).send("Token invalid")
     }
     else {
     req.user = user
     next() 
     }
    }) 
    } 

module.exports = { validateToken};
