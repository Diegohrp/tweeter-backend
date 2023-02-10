const { Queries } = require('../db/queries');
const db = new Queries();

class Post {
  constructor() {}

  async makePost(data) {
    const response = await db.insert('posts', data);
    return response;
  }
  async getPosts(userId, offset, limit) {
    const response = await db.find({
      view: 'home_posts',
      condition: { field: 'follower_id', value: userId },
      offset: offset ? parseInt(offset) : 1,
      limit: limit ? parseInt(limit) : 100,
    });
    return response;
  }
}

module.exports = Post;
