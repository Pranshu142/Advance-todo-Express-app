// middlewares/auth.js

import jwt from "jsonwebtoken";

const authorization = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach verified user data to the request object
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

export default authorization;
