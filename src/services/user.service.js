const pool = require('../lib/mysql.pool');
const { Queries } = require('../db/queries');

const db = new Queries();

class User {
  constructor() {
    this.users = [];
  }

  async find() {
    const [data] = await pool.query('SELECT * from users');

    return data;
  }

  async createAccount(data) {
    const [response] = await db.insert('users', data);
    console.log(response.insertId);
    return response.insertId;
  }
}

module.exports = User;
