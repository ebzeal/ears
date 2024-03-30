
import tweetDB from '../models/Tweet';
import tagDB from '../models/Tag';
import mentionDB from '../models/Mention';

const Tweet = tweetDB;
const Tag = tagDB;
const Mention = mentionDB;
/**
 * @class TweetHelpers
 * @description Handles tweet helper methods for TweetController class
 */
class TweetHelpers {
  /**
    * @static
    * @param {string} id - the requested tweet's Id
    * @return {object} - JSON response object
    * @description - returns a single tweet whose id is listed as parameter
    * @memberof TweetHelpers
    */
  static async getTweet(id) {
    const result = await Tweet.findById(id);
    return result;
  }

  /**
    * @static
    * @param {string} tweet - Tweet being referenced
    * @param {number} userId - Id of user posting the tweet
    * @param {number} savedTweetId - Id of tweet being referenced
    * @param {string} type - reply or tweet
    * @return {object} - JSON response object
    * @description - adds all mentions and tags listed in a tweet
    * @memberof TweetHelpers
    */
  static async addTagsAndMentions(tweet, userId, savedTweetId, type) {
    try {
      const tagPattern = /#\b\w+\b/g;
      const mentionPattern = /@\b\w+\b/g;

      const tags = tweet.match(tagPattern);
      const mentions = tweet.match(mentionPattern);

      let replyId, tweetId;
      if (type === 'aReply') {
        replyId = savedTweetId;
        tweetId = null;
      }
      if (type === 'aTweet') {
        replyId = null;
        tweetId = savedTweetId;
      }

      const allTags = [];
      tags.map(
        (tag) => allTags.push({ tag })
      );

      const allMentions = [];
      mentions.map(
        (mention) => allMentions.push({ mention })
      );

      const saveTag = new Tag({
        user: userId,
        tweet: tweetId,
        reply: replyId,
        tags: allTags
      });

      const saveMention = new Mention({
        user: userId,
        tweet: tweetId,
        reply: replyId,
        mentions: allMentions
      });

      saveTag.save();
      saveMention.save();
    } catch (err) {
      return err;
    }
  }
}
export default TweetHelpers;
