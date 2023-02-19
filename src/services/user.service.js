const pool = require('../lib/mysql.pool');
const bcrypt = require('bcrypt');
const { Queries } = require('../db/queries');

const db = new Queries();

class User {
  constructor() {
    this.users = [];
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

  async getUserInfo(id) {
    const [data] = await db.findOne({
      tableName: 'users',
      fields: [
        'photo',
        'name',
        'last_name',
        'bio',
        'email',
        'username',
        'password',
      ],
      idField: 'id',
      value: id,
    });
    return data;
  }

  async updateUserInfo(data, id) {
    const [response] = await db.updateOne({
      tableName: 'users',
      data,
      idField: 'id',
      id,
    });
    return response;
  }

  async getUserBasicInfo(id) {
    const [response] = await db.findOne({
      tableName: 'users',
      fields: ['name', 'last_name', 'photo'],
      idField: 'id',
      value: id,
    });

    return response;
  }
}

module.exports = User;
