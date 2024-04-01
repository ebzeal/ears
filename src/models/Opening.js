import mongoose from 'mongoose';

const { Schema } = mongoose;

const openingSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  status: {
    type: String,
    enum: ['opened', 'closed'],
    default: 'opened',
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  applications: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      status: {
        type: String,
        enum: ['considered', 'accepted', 'rejected'],
        default: 'considered',
      },
      reviews: [
        {
          reviewer: {
            type: Schema.Types.ObjectId,
            ref: 'users',
          },
          review: String,
          rating: {
            type: Number,
            min: 1,
            max: 10,
          },
        },
      ],
    },
  ],
}, { timestamps: true });

export default mongoose.model('opening', openingSchema);
