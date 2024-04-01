import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], 
  },
  title: String,
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  userType: {
    type: String,
    enum: ['applicant', 'faculty'],
    default: 'applicant',
  },
  privilege: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  bio: String,
  createdOn: {
    type: Date,
    default: Date.now,
  },
  qualifications: [
    {
      qualification: String,
      school: String,
      year: String,
    },
  ],
}, { timestamps: true });

export default mongoose.model('users', userSchema);
