/* eslint-disable max-len */
import committeeDB from '../models/Committee';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';

const Committee = committeeDB;

/**
 * @class authController
 */
class CommitteeController {
  /**
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} A JSON Response object
   * @memberof CommitteeController
   */
  static async createCommittee(req, res) {
    try {
      if(req.user.privilege !== 'admin'){
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const inputObj = UtilHelp.cleanInput(req.body);

      const { name, committee_head, description, committee_members  } = inputObj;

      

      const newCommittee = new Committee({
        name, committee_head, description, committee_members
      });

      const createdCommittee = await newCommittee.save();


      return response(res, 201, 'success', 'Committee created successfully', '', createdCommittee);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

   /**
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {object} A JSON Response object
   * @memberof CommitteeController
   */
   static async getCommittee(req, res) {
    try {
      const { id } = req.params;

      const newCommittee = Committee.findById({_id:id})

      return response(res, 200, 'success', 'Committee returned successfully', '', newCommittee);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }
  
  /**
   * @static
   * @param {*} req Request
   * @param {*} res Response
   * @returns {object} Json response
   * @memberof CommitteeController
   */
  static async updateCommittee(req, res) {
    try {
      if(req.user.privilege !== 'admin'){
        return response(res, 401, 'failure', 'Unauthorized request');
      }
      const inputObj = UtilHelp.cleanInput(req.body);
      const { name, committee_head, description, committee_members  } = inputObj;
      const { id } = req.params;
    

      const foundCommittee = await Committee.findOne({_id:id});

      await Committee.findOneAndUpdate({_id: id}, {
        name: name?? foundCommittee.name,
        committee_head: committee_head?? foundCommittee.committee_head,
        description: description?? foundCommittee.description,
        committee_members: committee_members?? foundCommittee.committee_members
        });

      return response(res, 200, 'success', 'User updated');
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  

}

export default CommitteeController;