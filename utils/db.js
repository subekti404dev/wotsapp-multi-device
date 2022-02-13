const path = require('path');
const sqlite3 = require('sqlite3').verbose()
const dbPath = path.join('data', 'db', 'db.sqlite');
const md5 = require('md5');

const db = new sqlite3.Database(dbPath, (err) => {
   if (err) {
      console.error(err.message)
      throw err
   }
});

const dbRun = async (sql, entry) => {
   return new Promise(function(resolve, reject){
      db.run(sql, entry, function(err) {
         if (err) {
            reject(err)
         } else {
            resolve(this.lastID)
         }
      })
   })
}

const dbAll = async (sql, entry) => {
   return new Promise((resolve, reject) => {
      db.all(sql, entry, (err, rows) => {
         if (err) {
            reject(err)
         } else {
            resolve(rows)
         }
      })
   })
}

const createTables = async () => {
   const table1 = `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            wa_id TEXT,
            jid TEXT,
            timestamp TEXT,
            message TEXT,
            status_code INTEGER,
            status_message TEXT,
            payload TEXT
        )`;
   
   const sqls = [table1];
   for (const sql of sqls) {
      await dbRun(sql);
   }
   return true;
}

const initDB = async () => {
   await createTables();
}

const getMessageCount = async () => {
   const sql = `SELECT COUNT(*) as count FROM messages`;
   const res = await dbAll(sql);
   return res[0].count;
}

const getStatusMessage = (status_code) => {
   const statusMessages = ['ERROR', 'PENDING', 'SERVER_ACK', 'DELIVERY_ACK', 'READ', 'PLAYED'];
   return statusMessages[status_code];
}

const insertMessage = async (data) => {
   const sql = `INSERT INTO messages (session_id, wa_id, jid, timestamp, message, status_code, status_message, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
   const entry = [data?.sessionId, data?.key?.id, data?.key?.remoteJid, data?.messageTimestamp, JSON.stringify(data?.message), data?.status, getStatusMessage(data?.status), JSON.stringify(data?.payload)]
   return dbRun(sql, entry);
}

const getMessageByID = async (id) => {
   const sql = `SELECT * FROM messages WHERE id = ?`;
   const res = await dbAll(sql, [id]);
   return res[0];
}

const updateStatus = async (wa_id, jid, status_code) => {
   const sql = `UPDATE messages SET status_code = ?, status_message = ? WHERE wa_id = ? AND jid = ?`;
   const entry = [status_code, getStatusMessage(status_code), wa_id, jid]
   return dbRun(sql, entry);
}

const getMessagesBySessionId = async (sessionId, q = '', limit = 20, page = 1) => {
   const offset = limit * (page - 1);
   const fieldsToSearch = ['wa_id', 'jid', 'timestamp', 'message', 'status_code', 'status_message'];
   const where = q ? fieldsToSearch.map((x) => `( session_id = '${sessionId}' AND ${x} LIKE '%${q}%' )`).join(' OR ') : `session_id = '${sessionId}'`;
   const sqlCount = `SELECT COUNT(*) as count FROM messages WHERE ${where}`;
   const resCount = await dbAll(sqlCount);
   const total = resCount[0].count;
   const sql = `SELECT * FROM messages WHERE ${where} ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
   const data = await dbAll(sql, [limit, offset]);
   const isNext = total > (page * limit);
   return {
      total,
      data,
      limit,
      offset,
      page,
      is_next: isNext
   }
}

const getMessages = async (q = '', limit = 20, page = 1) => {
   const offset = limit * (page - 1);
   const fieldsToSearch = ['wa_id', 'jid', 'timestamp', 'message', 'status_code', 'status_message', 'payload'];
   const where = q ? 'WHERE (' + fieldsToSearch.map((x) => `${x} LIKE '%${q}%'`).join(' OR ') + ')' : '';``;
   const sqlCount = `SELECT COUNT(*) as count FROM messages ${where}`;
   const resCount = await dbAll(sqlCount);
   const total = resCount[0].count;
   const sql = `SELECT * FROM messages ${where} ORDER BY timestamp DESC LIMIT ? OFFSET ? `;
   const data = await dbAll(sql, [limit, offset]);
   const isNext = total > (page * limit);
   return {
      total,
      data,
      limit,
      offset,
      page,
      is_next: isNext
   }
}


module.exports = {
   db,
   initDB,
   message: {
      getMessageCount,
      insertMessage,
      updateStatus,
      getMessagesBySessionId,
      getMessages,
      getMessageByID
   },
};