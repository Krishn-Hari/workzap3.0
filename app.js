const express = require('express');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const http = require('http');
const path = require('path');
const body_parser = require('body-parser');
const { Userrouter } = require('./Router/User-Router');
const { Hostrouter } = require('./Router/Host-Router');
const rootdir = require('./utils/pathUtil');
const session = require('express-session');
const mongodbsession = require('connect-mongodb-session')(session);
const errorcontroller = require("./controller/error");
const { mongoConnect } = require('./utils/databaseutil');


// const session = require('express-session');
const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For handling JSON POST requests

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.6-flash",
  systemInstruction: "You are the official AI assistant for WorkZap, a modern platform designed to connect skilled workers with potential employers or 'hirers'. You should assist users with navigating the platform, understanding how to apply for jobs, how to hire employees, use the dashboard, and manage payroll/reports. Always be polite, helpful, and concise. You can also answer general questions, but try to tie them back to professional development, freelancing, or the WorkZap ecosystem whenever possible."
});



const store = new mongodbsession({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});






app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: store
}));





app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.userType = req.session.userType;
  res.locals.username = req.session.username;
  res.locals.email = req.session.email;
  res.user = req.session.user; 
  next();
})


app.use(Userrouter);
app.use(Hostrouter);

app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message || error.toString() });
  }
});


app.use(express.static(path.join(rootdir, 'public')));
app.use(errorcontroller.Error404);



const port = 3001;
mongoConnect(() => {
  server.listen(port, () => {
    console.log(`server Started At: http://localhost:${port}/home`);
  });
})

