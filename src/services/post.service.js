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
    const response = await db.find({
      view: `bookmarks_${section}_view`,
      conditions: [{ field: 'current_userId', value: userId }],
      offset: offset ? parseInt(offset) : 1,
      limit: limit ? parseInt(limit) : 100,
    });
    return response;
  }

  async getProfileLikes({ userId, profileId, offset, limit }) {
    const response = await db.findLikedPosts({
      userId,
      profileId,
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

  async getFromExplore({
    userId,
    whereClause = false,
    orderBy,
    limit,
    offset,
  }) {
    const response = await db.getPostsFromExplore({
      userId,
      whereClause,
      orderBy,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 1,
    });
    return response;
  }

  async getProfileRetweets({ userId, profileId, offset, limit }) {
    const response = await db.findRetweets({
      userId,
      profileId,
      offset: offset ? parseInt(offset) : 1,
      limit: limit ? parseInt(limit) : 100,
    });

    return response;
  }
}

module.exports = Post;
