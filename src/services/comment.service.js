const { Queries } = require('../db/queries');

const db = new Queries();

class CommentService {
  constructor() {}

  async makeComment(data) {
    data['post_id'] = parseInt(data['post_id']);
    //insert comment, get the commentId
    const [{ insertId }] = await db.insert('comments', data);
    //get num comments from the current post
    const [[{ numComments }]] = await db.findOne({
      tableName: 'comments',
      fields: ['COUNT(*) AS numComments'],
      idField: 'post_id',
      value: data.post_id,
    });
    //update num comments
    await db.updateOne({
      tableName: 'posts',
      data: { num_comments: numComments },
      idField: 'id',
      id: data.post_id,
    });

    return insertId;
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
