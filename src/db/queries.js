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
  //Find by id or email
  async findOne({ tableName, fields, idField, value }) {
    const query = `SELECT ${fields} from ${tableName} WHERE ${idField} = ?`;
    const response = await pool.query(query, [value]);
    return response;
  }

  async updateOne({ tableName, data, idField, id }) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const query = `UPDATE ${tableName} SET ${fields.map(
      (f) => `${f}=?`
    )} WHERE ${idField}=?`;
    const response = pool.query(query, [...values, id]);
    return response;
  }
  //callProcedure({name:String,inputs:Array,outputs:Array})
  async callProcedure({ name, inputs, outputs = null }) {
    let response = 0;

    if (outputs) {
      console.log(inputs);
      const procedure = `CALL ${name}(${inputs.map(
        (In) => '?'
      )},${outputs})`;

      await pool.query(procedure, inputs);
      console.log(`SELECT (${outputs}) AS response`);

      response = await pool.query(
        `SELECT (${outputs}) AS response FOR UPDATE`
      );
    } else {
      const procedure = `CALL ${name}(${inputs.map((In) => '?')})`;
      await pool.query(procedure, inputs);
    }
    return response;
  }

  async find({ view, conditions, offset, limit }) {
    const fields = conditions.map((obj) =>
      conditions[conditions.length - 1] === obj &&
      conditions.length > 1
        ? `AND ${obj.field}=?`
        : `${obj.field}=?`
    );
    const values = conditions.map((obj) => obj.value);

    const query = `SELECT * from ${view} WHERE ${fields} LIMIT ?,?`;
    const response = await pool.query(query, [
      ...values,
      offset,
      limit,
    ]);
    return response;
  }

  async delete({ tableName, condition }) {
    const query = `DELETE FROM ${tableName} WHERE ${condition.field}=?`;
    await pool.query(query, [condition.value]);
  }
}

module.exports = { Queries };
