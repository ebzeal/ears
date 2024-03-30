/* eslint-disable max-len */
import userDB from '../models/User';

const User = userDB;
/**
 * @class UserHelpers
 * @description Handles user helper methods for UserController class
 */
class UserHelp {
  /**
    * @static
    * @param {string} userName - the requested User's username
    * @param {string} email - the requested User's email
    * @param {string} phone - the requested User's phone
    * @return {object} - JSON response object
    * @description - returns a single User whose id is listed as parameter
    * @memberof UserHelp
    */
  static async findUser(userName, email, phone) {
    const foundUser = await User.findOne({
      $or: [
        {
          userName
        },
        {
          email
        },
        {
          phone
        }
      ]
    });
    return foundUser;
  }
}

export default UserHelp;
