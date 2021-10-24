const jwt = require("jsonwebtoken");
const tokenKey = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
    const token = req.headers["x-auth"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, tokenKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
    return next();
};

module.exports = verifyToken;