const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

const mongoConnect = (callback) => {
  mongoose.connect(url)
    .then(result => {
      console.log("connected to mongodb via mongoose");
      callback();
    })
    .catch((error) => {
      console.log("error while connecting database", error);
    });
};

exports.mongoConnect = mongoConnect;
