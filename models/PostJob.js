const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  JobTitle: {
    type: String,
    required: true
  },
  Company: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    required: true
  },
  JobType: {
    type: String,
    required: true
  },
  JobDescription: {
    type: String,
    required: true
  },
  SalaryRange: {
    type: String,
    required: true
  },
  DeadLine: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Job', jobSchema, 'postedjob');