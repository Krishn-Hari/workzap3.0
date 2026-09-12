const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  JobId: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Application', applicationSchema, 'Applications');