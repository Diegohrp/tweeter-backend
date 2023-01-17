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

  async findOne({ tableName, fields, idField, value }) {
    const query = `SELECT ${fields} from ${tableName} WHERE ${idField} = ?`;
    const response = await pool.query(query, [value]);
    return response;
  }
}

module.exports = { Queries };
