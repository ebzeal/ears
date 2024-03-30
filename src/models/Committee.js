import mongoose from 'mongoose';

const { Schema } = mongoose;

/**

 *
 * @description Committee Collection.
 */

const committeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  committee_head: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  description: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  committee_members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
    }
  ],
});

export default mongoose.model('committee', committeeSchema);
