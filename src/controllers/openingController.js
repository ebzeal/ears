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
     const status = req.body.status || "opened"

      const { title, description  } = inputObj;

      

      const newOpening = new Opening({
        title, description, status
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
          applications:applicationObject
        }
      });

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
    static async getApplication(req, res) {
      try {
        const {openingId, applicationId } = req.params;
      
        const opening = await Opening.findOne({_id: openingId}).populate('applications.user');
        const application = opening.applications.filter((item)=> item._id.equals(applicationId))
        
        const resItem = {opening, application:application[0]}
  
        return response(res, 200, 'success', 'opening applied to', '', resItem);
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
        const { openingId, applicationId } = req.params;
        const { userId } = req.user;
      
        const inputObj = UtilHelp.cleanInput(req.body);
        const { review, rating, comments } = inputObj;
        const newReview = { reviewer: userId, review, rating, comments };
      
        const updatedOpening = await Opening.findOneAndUpdate(
          { 
            _id: openingId, 
            "applications._id": applicationId 
          },
          { 
            $push: { "applications.$.reviews": newReview } 
          },
          { 
            new: true // To return the updated document after the update operation
          }
        ).populate('applications.user');
  
  
        return response(res, 200, 'success', 'Review added successfully', '', updatedOpening);
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

        const opening = await Opening.findOne({_id: id}).populate('applications.user')
  
        return response(res, 200, 'success', 'opening applied to', "", opening);
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
    static async getAllOpenings(req, res) {
      try {
        const opening = await Opening.find()
  
        return response(res, 200, 'success', 'all openings',"", opening);
      } catch (error) {
            return response(res, 500, 'failure', 'create opening error', error.message);
      }
    }

}

export default OpeningController;