import committeeDB from '../models/Committee';
import response from '../helpers/resHelp';
import UtilHelp from '../helpers/utilsHelp';

const Committee = committeeDB;

class CommitteeController {
  static async createCommittee(req, res) {
    try {
      if (req.user.privilege !== 'admin') {
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const { name, committee_head, description, committee_members } = UtilHelp.cleanInput(req.body);

      const newCommittee = new Committee({ name, committee_head, description, committee_members });
      const createdCommittee = await newCommittee.save();

      return response(res, 201, 'success', 'Committee created successfully', '', createdCommittee);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async getCommittee(req, res) {
    try {
      const { id } = req.params;
      const committee = await Committee.findById(id);

      if (!committee) {
        return response(res, 404, 'failure', 'Committee not found');
      }

      return response(res, 200, 'success', 'Committee returned successfully', '', committee);
    } catch (err) {
      return response(res, 500, 'failure', '', err.message);
    }
  }

  static async updateCommittee(req, res) {
    try {
      if (req.user.privilege !== 'admin') {
        return response(res, 401, 'failure', 'Unauthorized request');
      }

      const { id } = req.params;
      const updateData = UtilHelp.cleanInput(req.body);
      const updatedCommittee = await Committee.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedCommittee) {
        return response(res, 404, 'failure', 'Committee not found');
      }

      return response(res, 200, 'success', 'Committee updated successfully', '', updatedCommittee);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
}

export default CommitteeController;
