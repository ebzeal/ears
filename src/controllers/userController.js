/* eslint-disable max-len */
import userDB from '../models/User';
import tokenHelp from '../helpers/tokenHelp';
import passwordHelp from '../helpers/passwordHelp';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';
import UserHelp from '../helpers/userHelp';

const User = userDB;

class UserController {
  static async signUp(req, res) {
    try {
      const { email, firstName, lastName, title } = UtilHelp.cleanInput(req.body);
      const foundUser = await UserHelp.findUser(email);

      if (foundUser) {
        return response(res, 400, 'failure', 'This user already exists');
      }

      const hashedPassword = await passwordHelp.hashPassword(req.body.password);
      const newUser = new User({ email, password: hashedPassword, fullName: `${firstName} ${lastName}`, title });
      const createdUser = await newUser.save();
      const token = tokenHelp.sign({ userId: createdUser._id });

      return response(res, 201, 'success', 'Account created successfully', '', token);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async logIn(req, res) {
    try {
      const { email, password } = UtilHelp.cleanInput(req.body);
      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        return response(res, 404, 'failure', 'User not found');
      }

      const isValidPassword = await passwordHelp.verifyPassword(password, foundUser.password);

      if (!isValidPassword) {
        return response(res, 401, 'failure', 'Invalid credentials');
      }

      const token = tokenHelp.sign({
        userId: foundUser._id,
        userEmail: foundUser.email,
        userType: foundUser.userType,
        privilege: foundUser.privilege
      });

      return response(res, 200, 'success', 'Successfully logged in', '', token);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async toggleUserAccess(req, res) {
    try {
      const { id } = req.params;

      if (req.user.privilege !== 'admin') {
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const foundUser = await User.findById(id);

      if (!foundUser) {
        return response(res, 404, 'failure', 'User not found');
      }

      const changedUserType = foundUser.userType === 'applicant' ? 'faculty' : 'applicant';
      await User.findByIdAndUpdate(id, { userType: changedUserType });

      return response(res, 200, 'success', 'User type updated successfully');
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return response(res, 404, 'failure', 'User not found');
      }

      return response(res, 200, 'success', 'User retrieved successfully', '', user);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.find({});
      return response(res, 200, 'success', 'Users retrieved successfully', '', users);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = UtilHelp.cleanInput(req.body);

      if (req.user._id !== id) {
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedUser) {
        return response(res, 404, 'failure', 'User not found');
      }

      return response(res, 200, 'success', 'User updated successfully', '', updatedUser);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  // Add any additional methods if required...
}

export default UserController;
