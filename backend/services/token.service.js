require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res) => {
    const authHeader = req.headers && req.headers.authorization;
    if (!authHeader || typeof authHeader !== "string") {
        return {
            message: "Missing Authorization header",
            isVerified: false
        };
    }

    const parts = authHeader.split(" ");
    const token = parts.length === 2 ? parts[1] : undefined;
    if (!token) {
        return {
            message: "Missing Bearer token",
            isVerified: false
        };
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        return {
            message: "Token verified!",
            isVerified: true,
            data: decoded
        };
    } catch (error) {
        return {
            message: "Invalid or expired token",
            isVerified: false,
            error
        };
    }
};
module.exports={verifyToken};