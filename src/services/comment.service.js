const { Queries } = require('../db/queries');

const db = new Queries();

class CommentService {
  constructor() {}

  async makeComment(data) {
    data['post_id'] = parseInt(data['post_id']);
    const response = await db.insert('comments', data);
    return response;
  }

  async getComments(postId, limit, offset) {
    const response = await db.find({
      view: 'get_post_comments',
      conditions: [{ field: 'post_id', value: postId }],
      offset: offset ? parseInt(offset) : 1,
      limit: limit ? parseInt(limit) : 5,
    });

    return response;
  }
}

module.exports = CommentService;
