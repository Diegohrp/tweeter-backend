const { Queries } = require('../db/queries');

const db = new Queries();

class CommentService {
  constructor() {}

  async makeComment(data) {
    data['post_id'] = parseInt(data['post_id']);
    const response = await db.insert('comments', data);
    return response;
  }
}

module.exports = CommentService;
