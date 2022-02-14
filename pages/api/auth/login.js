const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error('Username and Password are required !');
        }
        if (
            username === process.env.APP_USERNAME &&
            password === process.env.APP_PASSWORD
        ) {
            const token = jwt.sign({ data: { username } }, process.env.APP_JWT_SECRET, { expiresIn: '1d' });
            return res.json({ success: true, message: "login successfully", token });
        }
        throw new Error("Invalid Credential");
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}