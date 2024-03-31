/* eslint-disable max-len */
import userDB from '../models/User';
import tokenHelp from '../helpers/tokenHelp';
import passwordHelp from '../helpers/passwordHelp';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';
import UserHelp from '../helpers/userHelp';

const User = userDB;

/**
 * @class authController
 */
class UserController {
  /**
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} A JSON Response object
   * @memberof UserController
   */
  static async signUp(req, res) {
    try {
      const inputObj = UtilHelp.cleanInput(req.body);

      const { email, firstName, lastName, title  } = inputObj;

      const foundUser = await UserHelp.findUser( email);

      if (foundUser !== null) {

        if (foundUser.email === email) {
          return response(res, 400, 'failure', 'Another user is registered with this email');
        }

       
        return response(res, 400, 'failure', 'This user already exists');
      }


      const hashedPassword = await passwordHelp.hashPassword(req.body.password);

      const newUser = new User({
        email,
        password: hashedPassword,
        fullName: `${firstName} ${lastName}`, 
        title
      });

      const createdUser = await newUser.save();

      const payload = {
        userId: createdUser.id,
        userEmail: createdUser.email,
        fullName: createdUser.fullName, 
        title: createdUser.title, 
        privilege: createdUser.privilege
      };

      const token = await tokenHelp.sign(payload);

      return response(res, 201, 'success', 'Account created successfully', '', token);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof UserController
   */
  static async logIn(req, res) {
    try {
      const inputObj = UtilHelp.cleanInput(req.body);

      const { user } = inputObj;

      // const foundUser = await UserHelp.findUser(user, user, user);

      const foundUser = await User.findOne({
            email: user
      });


      if (foundUser === null) {
        return response(res, 404, 'failure', 'Your login information is not correct');
      }
      const isValidPassword = passwordHelp.verifyPassword(req.body.password, foundUser.password);

      if (!isValidPassword) {
        return response(res, 401, 'failure', 'Your login information is not correct');
      }

      const payload = {
        userId: foundUser.id,
        userEmail: foundUser.email,
        userType: foundUser.userType,
        privilege: foundUser.privilege
      };

      const token = tokenHelp.sign(payload);
      return response(res, 200, 'success', 'You have successfully logged in', '', token);
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof UserController
   */
  static async toggleUserAccess(req, res) {
    try {

      // const inputObj = UtilHelp.cleanInput(req.body);
      const { id } = req.params;
      if(req.user.privilege !== 'admin'){
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      

      const foundUser = await User.findOne({_id:id});
     const changedUserType = foundUser.userType === 'applicant' ? 'faculty' : 'applicant'
      
      await User.updateOne({_id: id}, {userType: changedUserType});

      return response(res, 200, 'success', 'User Status succesfully changed');
    } catch (error) {
      return res.status(400).send(error);
    }
  }

    /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof UserController
   */
    static async getUser(req, res) {
      try {
        const { id } = req.params;
  
        const newUser = await User.findById({_id:id})
  
        return response(res, 200, 'success', 'User returned successfully', '', newUser);
      } catch (err) {
        return response(res, 500, 'failure', '', err.message);
      }
    }

  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof UserController
   */
  static async updateUser(req, res) {
    try {

      const inputObj = UtilHelp.cleanInput(req.body);
      const { id } = req.params;
      if(req.user.userId !== id){
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const { title, email, firstName, lastName, phone,  password, bio } = inputObj;

      const foundUser = await User.findById(id);
      

        if (foundUser.email === email) {
          return response(res, 400, 'failure', 'Another user is registered with this email');
        }

        if(password) {
          const hashedPassword = await passwordHelp.hashPassword(password);
          await User.findOneAndUpdate({id}, { 
            password: hashedPassword, }
          )
        }
      
      await User.findOneAndUpdate({_id: id}, { 
        title: title?? foundUser.title, 
        email: email?? foundUser.email, 
        fullName:`${firstName} ${lastName}` ?? foundUser.fullName, 
        phone:`${phone}` ?? foundUser.phone, 
        bio: bio?? foundUser.bio });

      return response(res, 200, 'success', 'User updated');
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof UserController
   */
  // static async addQualifications(req, res) {
  //   try {

  //     const inputObj = UtilHelp.cleanInput(req.body);
  //     const { id } = req.params;
  //     if(req.user.userId !== id){
  //       return response(res, 401, 'failure', 'Unauthorized request');
  //     }

  //     const { title, email, firstName, lastName, password, bio } = inputObj;

  //     const foundUser = await User.findById(id);

  //       if (foundUser.email === email) {
  //         return response(res, 400, 'failure', 'Another user is registered with this email');
  //       }


  //       if(password) {
  //         const hashedPassword = await passwordHelp.hashPassword(password);
  //         await User.findOneAndUpdate({id}, { 
  //           password: hashedPassword, }
  //         )
  //       }
      
  //     await User.findOneAndUpdate({_id: id}, { 
  //       title: title?? foundUser.title, 
  //       email: email?? foundUser.email, 
  //       fullName:`${firstName} ${lastName}` ?? foundUser.fullName, 
  //       bio: bio?? foundUser.bio });

  //     return response(res, 200, 'success', 'User updated');
  //   } catch (error) {
  //     return res.status(400).send(error);
  //   }
  // }
}

export default UserController;