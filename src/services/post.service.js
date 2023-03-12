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
      conditions: [{ field: 'current_userId', value: userId }],
      offset: offset ? parseInt(offset) : 1,
      limit: limit ? parseInt(limit) : 100,
    });
    return response;
  }

  async getBookmarks(userId, offset, limit, section) {
    const response = await db.find();
  }

  async addInteraction(user_id, post_id, interaction) {
    const response = await db.callProcedure({
      name: interaction,
      inputs: [user_id, post_id],
    });
    return response;
  }

  async removeInteraction(user_id, post_id, interaction) {
    const response = await db.callProcedure({
      name: interaction,
      inputs: [user_id, post_id],
    });
    return response;
  }
}

module.exports = Post;
