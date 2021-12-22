const path = require('path');
const fs = require('fs');
const sessionsPath = path.join('data','sessions');

const getSessionPath = (sessionId) => {
    return path.join(sessionsPath, `${sessionId}.json`);
}

const isSessionExist = (sessionId) => {
    const filepath = getSessionPath(sessionId);
    return fs.existsSync(filepath);
}

const getSessions = () => {
    return fs.readdirSync(sessionsPath).filter(file => file.endsWith(".json")).map(file => file.replace(".json", ""));
}

const getSessionsData = () => {
    const sessions = getSessions();
    const data = sessions.map(session => {
        const json = fs.readFileSync(path.join(sessionsPath, `${session}.json`), 'utf8');
        return {...JSON.parse(json), sessionId: session};
    });
    return data;
}
module.exports = {
    getSessions,
    getSessionPath,
    isSessionExist,
    getSessionsData
}