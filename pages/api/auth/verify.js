const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    try {
        const { token } = req.body;

        const data = jwt.verify(token, process.env.APP_JWT_SECRET, { expiresIn: '1d' });
        res.json({ success: true, message: "token verified", data });

    } catch (error) {
        res.status(401).json({ success: false, message: error.message || 'Invalid token' });
    }
}