import openingDB from '../models/Opening';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';

const Opening = openingDB;

class OpeningController {
  static async createOpening(req, res) {
    try {
      if (req.user.privilege !== 'admin') {
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const { title, description } = UtilHelp.cleanInput(req.body);
      const newOpening = new Opening({ title, description });
      const createdOpening = await newOpening.save();

      return response(res, 201, 'success', 'Opening created successfully', '', createdOpening);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async updateOpening(req, res) {
    try {
      if (req.user.privilege !== 'admin') {
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const { id } = req.params;
      const updateData = UtilHelp.cleanInput(req.body);

      const updatedOpening = await Opening.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedOpening) {
        return response(res, 404, 'failure', 'Opening not found');
      }

      return response(res, 200, 'success', 'Opening updated successfully', '', updatedOpening);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async applyOpening(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const applicationObject = { user: userId };

      const updatedOpening = await Opening.findByIdAndUpdate(id, { $push: { applications: applicationObject } }, { new: true });

      if (!updatedOpening) {
        return response(res, 404, 'failure', 'Opening not found');
      }

      return response(res, 200, 'success', 'Application successful', '', updatedOpening);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async reviewApplication(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const { review, rating } = UtilHelp.cleanInput(req.body);

      const newReview = { reviewer: userId, review, rating };

      const updatedOpening = await Opening.findOneAndUpdate(
        { _id: id },
        { $push: { 'applications.$[app].reviews': newReview } },
        { new: true, arrayFilters: [{ 'app.user': userId }] }
      );

      if (!updatedOpening) {
        return response(res, 404, 'failure', 'Opening not found');
      }

      return response(res, 200, 'success', 'Review submitted successfully', '', updatedOpening);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async getOpening(req, res) {
    try {
      const { id } = req.params;
      const opening = await Opening.findById(id);

      if (!opening) {
        return response(res, 404, 'failure', 'Opening not found');
      }

      return response(res, 200, 'success', 'Opening retrieved successfully', '', opening);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  // Add any additional methods if required...
}

export default OpeningController;
