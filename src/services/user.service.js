const pool = require('../lib/mysql.pool');
const bcrypt = require('bcrypt');
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

  async findByEmail(email) {
    const [data] = await db.findOne({
      tableName: 'users',
      fields: [
        'id',
        'name',
        'last_name',
        'email',
        'username',
        'password',
      ],
      idField: 'email',
      value: email,
    });
    return data;
  }

  async createAccount(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newData = {
      ...data,
      password: hash,
    };
    const [response] = await db.insert('users', newData);
    return response.insertId;
  }
}

module.exports = User;
