//User queries
const pool = require('../lib/mysql.pool');

class Queries {
  constructor() {}
  async insert(tableName, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const query = `INSERT INTO ${tableName} (${fields}) VALUES (${fields.map(
      (f) => '?'
    )})`;
    const response = await pool.query(query, [...values]);
    return response;
  }
}

module.exports = { Queries };
