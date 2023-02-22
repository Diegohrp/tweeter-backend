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

  async savePost(user_id, post_id) {
    const response = await db.insert('saved', { user_id, post_id });
    return response;
  }
  async removeBookmark(id) {
    await db.delete({
      tableName: 'saved',
      condition: { field: 'id', value: id },
    });
  }
}

module.exports = Post;
