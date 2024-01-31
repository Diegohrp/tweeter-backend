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
      fields: ['id', 'name', 'last_name', 'email', 'username', 'password'],
      idFields: ['email'],
      values: [email],
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
      idFields: ['id'],
      values: [id],
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
      idFields: ['id'],
      values: [id],
    });

    return response;
  }

  async exploreUsers({ userId, orderBy, limit, offset, whereClause = false }) {
    const [response] = await db.getUsers({
      userId,
      whereClause,
      orderBy,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 1,
    });
    return response;
  }

  async getProfileInfo({ userId, profileId }) {
    const [response] = await db.findUser({ userId, profileId });
    return response;
  }
}

module.exports = User;
