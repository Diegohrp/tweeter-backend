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
  async findOne({ tableName, fields, idFields, values }) {
    const conditions = idFields
      .map((field) => (idFields[0] === field ? `${field}=?` : `AND ${field}=?`))
      .join(' ')
      .replace(',', '');

    const query = `SELECT ${fields} from ${tableName} WHERE ${conditions}`;

    const response = await pool.query(query, values);
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
      const procedure = `CALL ${name}(${inputs.map((In) => '?')},${outputs})`;

      await pool.query(procedure, inputs);
      console.log(`SELECT (${outputs}) AS response`);

      response = await pool.query(`SELECT (${outputs}) AS response FOR UPDATE`);
    } else {
      const procedure = `CALL ${name}(${inputs.map((In) => '?')})`;
      await pool.query(procedure, inputs);
    }
    return response;
  }

  async find({ view, conditions, offset, limit }) {
    const fields = conditions.map((obj) =>
      conditions[conditions.length - 1] === obj && conditions.length > 1
        ? `AND ${obj.field}=?`
        : `${obj.field}=?`
    );
    const values = conditions.map((obj) => obj.value);

    const query = `SELECT * from ${view} WHERE ${fields.join(' ')} LIMIT ?,?`;
    const response = await pool.query(query, [...values, offset, limit]);
    return response;
  }

  async delete({ tableName, condition }) {
    const query = `DELETE FROM ${tableName} WHERE ${condition.field}=?`;
    await pool.query(query, [condition.value]);
  }

  async getPostsFromExplore({
    userId,
    whereClause = false,
    orderBy,
    limit,
    offset,
  }) {
    const query = `SELECT
      posts_details_view.*,
      posts_details_view.created_at AS date_info,
      (SELECT saved.id FROM saved WHERE saved.user_id = ? AND saved.post_id = posts_details_view.id) AS saved,
      (SELECT likes_posts.id FROM likes_posts WHERE likes_posts.user_id = ? AND likes_posts.post_id = posts_details_view.id) AS liked,
      (SELECT retweets.user_id FROM retweets WHERE user_id = ? AND retweets.post_id = posts_details_view.id) AS who_retweeted_id
    FROM posts_details_view
    ${whereClause ? `WHERE ${whereClause}` : ''} 
    ORDER BY ${orderBy} LIMIT ?,?`;
    const values = [userId, userId, userId];
    values.push(offset);
    values.push(limit);
    const response = await pool.query(query, values);
    return response;
  }

  async getUsers({ userId, whereClause = false, orderBy, limit, offset }) {
    const query = `
    SELECT 
      users.id,
      users.name,
      users.last_name,
      users.username,
      users.email,
      users.photo,
      users.bio,
      users.num_followers,
      (SELECT TRUE FROM followers WHERE followers.following_id = users.id AND followers.follower_id = ? ) AS following
      FROM users
      ${whereClause ? `WHERE ${whereClause}` : ''}
      ORDER BY ? LIMIT ?,?
    `;
    const values = [userId, orderBy, offset, limit];
    const response = await pool.query(query, values);
    return response;
  }

  async findUser({ userId, profileId }) {
    const query = `
    SELECT
      users.*,
      (SELECT TRUE FROM followers WHERE followers.following_id = users.id AND followers.follower_id = ? ) AS following,
      COUNT(followers.following_id) AS num_following
    FROM users 
      INNER JOIN followers 
      ON users.id = followers.follower_id 
    WHERE users.id = ? AND users.active = 1;
    `;
    const response = await pool.query(query, [userId, profileId]);
    return response;
  }

  async findLikedPosts({ userId, profileId, limit, offset }) {
    const query = `
    SELECT
      posts_details_view.*,
      posts_details_view.created_at AS date_info,
      (SELECT saved.id FROM saved WHERE saved.user_id = ? AND saved.post_id = posts_details_view.id) AS saved,
      (SELECT likes_posts.id FROM likes_posts WHERE likes_posts.user_id = ? AND likes_posts.post_id = posts_details_view.id) AS liked,
      (SELECT retweets.user_id FROM retweets WHERE user_id = ? AND retweets.post_id = posts_details_view.id) AS who_retweeted_id
    FROM posts_details_view
    INNER JOIN likes_posts
      ON posts_details_view.id = likes_posts.post_id
    WHERE likes_posts.user_id = ? LIMIT ?,?`;
    const response = await pool.query(query, [
      userId,
      userId,
      userId,
      profileId,
      offset,
      limit,
    ]);
    return response;
  }
}

module.exports = { Queries };
