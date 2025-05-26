const jwt = require('jsonwebtoken');

const Authenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch (err) {
            console.error("Invalid token:", err.message);
            res.status(401).json({ error: "Invalid token" });
        }
    } else {
        console.error("Authorization header missing or invalid format");
        res.status(401).json({ error: "Token does not exist or format is invalid" });
    }
};

module.exports = Authenticated;
