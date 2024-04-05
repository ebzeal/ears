import mongoose from 'mongoose';

const { Schema } = mongoose;

/**

 *
 * @description Committee Collection.
 */

const openingSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: { unique: true }
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  applications: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      status: {
        type: String,
        enum: ['pending', 'considered', 'accepted', 'rejected'],
        default: 'pending',
        required: true
      },
      reviews: [
        {
          reviewer: {
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
          review: {
            type: String,
            enum: ['considered', 'accepted', 'rejected'],
            default: 'considered'
          },
          comments: {
            type: String,
          },
          rating: {
            type: Number,
            min: 1,
            max: 10
        }
        }
      ]
    }
  ],
});

export default mongoose.model('opening', openingSchema);
