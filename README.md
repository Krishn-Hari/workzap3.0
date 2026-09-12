# WorkZap

**WorkZap** is a platform that connects job seekers with hirers. It provides role specific experiences for **Employees** and **Hirers**, secure authentication, session management, and a real time chat so recruiters and candidates can communicate instantly.

 **Live Demo** : https://workzap.onrender.com/
 
 Docker Image : docker pull rajan72/workzap
---

### Features
- **Role based registration** for **Employee** and **Hirer** with different UI flows and dashboards.  
- **Authentication** with **bcrypt** password hashing and **JWT** support.  
- **Session and cookies** using `express-session` and `connect-mongodb-session` for persistent login.  

- **MVC structure** with clear separation of controllers, models, views, routes, and utilities.  
- **Server side rendering** using **EJS** templates.  
- **Email support** using **nodemailer** for notifications and verification.  
- **Extensible codebase** ready for file uploads, search, notifications, and analytics.

---

### Tech Stack
- **Runtime**: Node.js  
- **Server**: Express.js  
- **Templating**: EJS  
- **Database**: MongoDB with Mongoose  

- **Auth and sessions**: bcryptjs, express-session, JWT, connect-mongodb-session  
- **Email**: nodemailer  
- **Dev tools**: nodemon, npm
- **Container**: Docker

**Key dependencies**
- **bcryptjs** `^3.0.2`  
- **body-parser** `^1.20.3`  
- **connect-mongodb-session** `^5.0.0`  
- **ejs** `^3.1.10`  
- **express** `^4.21.2`  
- **express-session** `^1.18.2`  
- **mongodb** `^6.14.2`  
- **mongoose** `^8.18.2`  
- **nodemailer** `^6.10.0`  
- **nodemon** `^3.1.9`  

---

### Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/Captain-jack42/WorkZap.git
cd WorkZap
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
Create a `.env` file in the project root and add the required variables shown in the example below.

4. **Run in development**
```bash
npm run dev
# or
node app.js
```

5. **Open in browser**  
Visit `http://localhost:3000` or the port you configured.

---

### Environment Variables
Create a `.env` file with these keys and appropriate values:

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/workzap
SESSION_SECRET=your_session_secret
```

**Important**  
- **Do not commit** `.env` to version control.  
- Use a secrets manager or environment variables in production.

---

### Run Scripts
- **Install**: `npm install`  
- **Start development**: `npm run dev` (uses nodemon)  
- **Start production**: `node app.js`

Add linting and test scripts as the project grows.

---

### Project Structure
```
WorkZap/
├─ app.js
├─ package.json
├─ controllers/
├─ models/
├─ routes/
├─ views/
│  ├─ partials/
│  └─ pages/
├─ public/
│  ├─ css/
│  └─ js/
├─ utils/
└─ config/
```
- **app.js** is the application entry and Express setup.  
- **controllers** contains route handlers and business logic.  
- **models** contains Mongoose schemas.  
- **routes** maps endpoints to controllers.  
- **views** contains EJS templates and partials.  
- **public** holds static assets like CSS and client JS.  
- **utils** contains helper functions and middleware.  
- **config** stores configuration helpers.

---

### Deployment Notes
- Use a managed MongoDB service such as MongoDB Atlas for production.  
- Configure `connect-mongodb-session` as the session store and set `cookie.secure = true` when using HTTPS.  
- Use HTTPS and set secure cookie flags and proper CORS policies.  
- Add CI/CD to run linting and tests and to deploy to a host such as Heroku, Render, or a VPS.

---

### Security Best Practices
- **Hash passwords** with bcrypt and never store plaintext passwords.  
- **Validate and sanitize** all user input on the server side.  
- **Rate limit** authentication endpoints to reduce brute force risk.  
- **Use HTTPS** in production and set secure cookie flags.  
- **Rotate secrets** and store them in environment variables or a secrets manager.  
- **Limit file upload types and sizes** if you add resume or avatar uploads.

---

### Contributing
- **Fork** the repository and create a feature branch.  
- **Write clear commits** and open a pull request describing the change.  
- **Follow code style** used in the project and add tests for new features.  
- **Open issues** for bugs or feature requests.

---

### Contact
**Maintainer**: Captain-jack42 on GitHub  
Open an issue or submit a pull request for questions, bug reports, or feature suggestions.

---

