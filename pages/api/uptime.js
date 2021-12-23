

export default async function handler(req, res) {
    const uptime = process.uptime();
    res.json({ uptime });
}