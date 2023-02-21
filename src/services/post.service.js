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
      view: 'home_posts_view',
      condition: { field: 'current_userId', value: userId },
      offset: offset ? parseInt(offset) : 1,
      limit: limit ? parseInt(limit) : 100,
    });
    return response;
  }

  async likePost(user_id, post_id) {
    const response = await db.callProcedure({
      name: 'add_like',
      inputs: [user_id, post_id],
    });
    return response;
  }

  async removeLikePost(user_id, post_id) {
    const response = await db.callProcedure({
      name: 'remove_like',
      inputs: [user_id, post_id],
    });
    return response;
  }
}

module.exports = Post;
