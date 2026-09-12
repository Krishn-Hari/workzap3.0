const mongoose = require('mongoose');
const User = require('./models/User');
const Worker = require('./models/Worker');
const Application = require('./models/Application');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const apps = await Application.find();
  console.log("Apps:");
  for (let a of apps) console.log(a.email);
  const workers = await Worker.find();
  console.log("Workers:");
  for (let w of workers) console.log(w.email);
  mongoose.disconnect();
}
run();
