const { Queries } = require('../db/queries');
const db = new Queries();

class PostHashTags {
  constructor() {}

  async registerHashtags(postId, hashtagsString) {
    const hashtagsSet = new Set(hashtagsString.split(','));
    hashtagsSet.forEach(async (hashtag) => {
      await db.callProcedure({
        name: 'register_post_tag',
        inputs: [hashtag, postId],
      });
    });
  }
}

module.exports = { PostHashTags };
