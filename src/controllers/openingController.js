/* eslint-disable max-len */
import openingDB from '../models/Opening';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';

const Opening = openingDB;

/**
 * @class authController
 */
class OpeningController {
  /**
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} A JSON Response object
   * @memberof OpeningController
   */
  static async createOpening(req, res) {
    try {
      if(req.user.privilege !== 'admin'){
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const inputObj = UtilHelp.cleanInput(req.body);

      const { title, description  } = inputObj;

      

      const newOpening = new Opening({
        title, description
      });

      const createdOpening = await newOpening.save();


      return response(res, 201, 'success', 'Opening created successfully', '', createdOpening);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof OpeningController
   */
  static async updateOpening(req, res) {
    try {
      if(req.user.privilege !== 'admin'){
        return response(res, 401, 'failure', 'Unauthorized request');
      }
      const inputObj = UtilHelp.cleanInput(req.body);
      const { title, description, status } = inputObj;
      const { id } = req.params;
    

      const foundOpening = await Opening.findOne({_id:id});

      await Opening.findOneAndUpdate({_id: id}, {
        title: title?? foundOpening.title,
        description: description?? foundOpening.description,
        status: status?? foundOpening.status
        });

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
   * @memberof OpeningController
   */
  static async applyOpening(req, res) {
    try {
      const { id } = req.params;
      const {userId} = req.user;

      const applicationObject = { user: userId };
    
      await Opening.findOneAndUpdate({_id: id}, {
        $push: {
          applicationObject
        }
      });

      return response(res, 200, 'success', 'openning applied to');
    } catch (error) {
      return res.status(400).send(error);
    }
  }

    /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof OpeningController
   */
    static async reviewApplication(req, res) {
      try {
        const { id } = req.params;
        const {userId} = req.user;


        const inputObj = UtilHelp.cleanInput(req.body);

        const {review, rating  } = inputObj;

        const newReview = { reviewer: userId, review, rating};
      
        await Opening.findOneAndUpdate({_id: id}, 
          { $push: { 'applications.$[app].reviews': newReview } },
          {
            new: true,
            arrayFilters: [{ 'app.user': userId }] // Replace 'userId' with the ObjectId reference of the user whose application you're updating
        }
        );
  
        return response(res, 200, 'success', 'opening applied to');
      } catch (error) {
        return res.status(400).send(error);
      }
    }


    /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof OpeningController
   */
    static async getOpening(req, res) {
      try {
        const { id } = req.params;

        const opening = await Opening.findOne({_id: id})
  
        return response(res, 200, 'success', 'opening applied to', opening);
      } catch (error) {
        return res.status(400).send(error);
      }
    }

}

export default OpeningController;