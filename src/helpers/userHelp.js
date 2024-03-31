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
    * @param {string} email - the requested User's email
    * @return {object} - JSON response object
    * @description - returns a single User whose id is listed as parameter
    * @memberof UserHelp
    */
  static async findUser( email) {
    const foundUser = await User.findOne({ email });
    return foundUser;
  }
}

export default UserHelp;
