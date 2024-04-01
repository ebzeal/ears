import mongoose from 'mongoose';

const { Schema } = mongoose;

const committeeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true, //simpler restraint
  },
  committee_head: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'Committee head is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  committee_members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
}, { timestamps: true }); // Add automatic timestamp handling

export default mongoose.model('committee', committeeSchema);
