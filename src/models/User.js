import mongoose from 'mongoose';

const { Schema } = mongoose;

/**

 *
 * @description User Collection.
 */

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  title: {
    type: String,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['applicant', 'faculty'],
    default: 'applicant',
    required: true
  },
  privilege: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  bio: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  qualifications: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      qualification: {
        type: String,
      },
      school: {
        type: String,
      },
      year: {
        type: String,
      }
    }
  ],
});

export default mongoose.model('users', userSchema);
