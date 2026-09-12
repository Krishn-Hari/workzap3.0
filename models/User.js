const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  chattedAccount: [{
    type: String
  }],
  conversations: [{
    type: Schema.Types.Mixed // Allows array of objects
  }],
  jobsApplied: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
  bookmarkedJobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
  hiredWorkers: [{
    type: Schema.Types.ObjectId,
    ref: 'Worker'
  }],
  postedJobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }]
});

module.exports = mongoose.model('User', userSchema, 'account');
