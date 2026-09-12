// const { use } = require("react");
const express = require("express");
const Feedback = require("../models/feedback");
const Hired = require("../models/Hired");
const Worker = require("../models/Worker");
const Job = require("../models/PostJob");
const User = require("../models/User");
const Application = require("../models/Application");
const bcrypt = require('bcryptjs');

exports.getHostHome = (req, res, next) => {
  res.render('host-home');
};



exports.getSignup = (req, res, next) => {
  res.render('signup');
};

exports.postForm = (req, res, next) => {
  // console.log(req.session.user.id);
  console.log(req.body);
  const { fullName, gender, profession, experience, skills, email } = req.body;
  const home = new Worker({fullName, gender, profession, experience, skills, email});
  home.save().then(() => {
    console.log("form saved successfully");
  });

  res.render('home', { showPopup: false });
};

exports.postHiring = (req, res, next) => {
  console.log(req.body);
  const { id } = req.body;
  console.log("Hiring worker ID:", id);

  const user = req.session.user;

  User.find().then(accounts => {
    const matchedAccount = accounts.find(account => account.email === user.email);

    if (!matchedAccount) {
      return res.render('Login', { error: 'User not found' });
    }

    // Ensure hiredWorkers is an array
    const hiredWorkers = Array.isArray(matchedAccount.hiredWorkers)
      ? [...matchedAccount.hiredWorkers]
      : [];

    // Prevent duplicate entries
    if (!hiredWorkers.includes(id)) {
      hiredWorkers.push(id);
    }

    matchedAccount.hiredWorkers = hiredWorkers;

    matchedAccount.save()
      .then(() => {
        console.log("User account updated with hired worker.");
        res.redirect('/dashboard');
      })
      .catch(err => {
        console.error("Error updating user account:", err);
        res.status(500).send("Internal Server Error");
      });
  }).catch(err => {
    console.error("Error fetching accounts:", err);
    res.status(500).send("Internal Server Error");
  });
};


exports.postJob = (req, res, next) => {
  const { JobTitle, Company, Location, JobType, JobDescription, SalaryRange, DeadLine } = req.body;
  console.log("Job posted");

  const job = new Job({JobTitle, Company, Location, JobType, JobDescription, SalaryRange, DeadLine});
  const user = req.session.user;

  job.save()
    .then(savedJob => {
      const jobIdStr = savedJob._id.toString();

      // Update session user object
      if (user && Array.isArray(user.postedJobs)) {
        user.postedJobs.push(jobIdStr);
      }

      // Update actual user in database
      User.find().then(accounts => {
        const matchedAccount = accounts.find(account => account.email === user.email);

        if (matchedAccount) {
          // ✅ Push job ID into matchedAccount before saving
          if (!Array.isArray(matchedAccount.postedJobs)) {
            matchedAccount.postedJobs = [];
          }
          matchedAccount.postedJobs.push(jobIdStr);

          matchedAccount.save()
            .then(() => {
              console.log("User account updated with posted job.");
              res.render('host-home', { jobId: savedJob._id }); // Optional: pass jobId to view
            })
            .catch(err => {
              console.error("Error updating user account:", err);
              res.status(500).send("Failed to update user account.");
            });
        } else {
          console.error("User not found in database.");
          res.status(404).send("User not found.");
        }
      });
    })
    .catch(err => {
      console.error("Error saving job:", err);
      res.status(500).send("Internal Server Error");
    });
};


exports.getHired = (req, res, next) => {
  const user = req.session.user;

  const hiredWorkers = user.hiredWorkers || [];

  return Worker.find().then(registeredAc => {
    const workerDetails = registeredAc.filter(worker =>
      hiredWorkers.includes(worker._id.toString())
    );

    res.render('Hired', {
      matchedAccounts: workerDetails // Use filtered details here
    });
  });

};

exports.getWorker = (req, res, next) => {
  Worker.find().then(registeredAc => {
    res.render('worker', { registeredAc: registeredAc });
  });
}

exports.getPostedJob = (req, res, next) => {
  Job.find().then(PostedJob => {
    res.render('joblisting', { PostedJob: PostedJob });
  });
}

exports.postSignup = (req, res, next) => {
  const { fullname, email, phone, password, userType } = req.body;
  
  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        return res.render('signup', { error: 'Email already in use' });
      }
      return bcrypt.hash(password, 12).then(hashedPassword => {
        const acc = new User({ fullname, email, phone, password: hashedPassword, userType });
        return acc.save();
      }).then(() => {
        res.redirect('/Login');
      });
    })
    .catch(err => {
      console.error("Error during signup:", err);
      res.status(500).send("Internal Server Error");
    });
};



exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(matchingAccount => {
      if (!matchingAccount) {
        return res.render('Login', { error: 'Invalid email or password' });
      }
      bcrypt.compare(req.body.password, matchingAccount.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.userType = matchingAccount.userType;
            req.session.username = matchingAccount.fullname;
            req.session.email = matchingAccount.email;
            req.session.user = {
              id: matchingAccount._id.toString(),
              name: matchingAccount.fullname,
              email: matchingAccount.email,
              userType: matchingAccount.userType
            };
            return req.session.save(err => {
              if(err) console.error(err);
              res.redirect('/home');
            });
          } else {
            res.render('Login', { error: 'Invalid email or password' });
          }
        })
        .catch(err => {
          console.error("Error comparing passwords:", err);
          res.redirect('/Login');
        });
    })
    .catch(err => {
      console.error("Error finding user during login:", err);
      res.redirect('/Login');
    });
};

exports.getFeedbackForm = (req, res, next) => {
  res.render('Feedback');
}

exports.postFeedback = (req, res, next) => {
  const { name, email, feed } = req.body;
  const feedback = new Feedback({name, email, feed});
  feedback.save();

  res.render('Feedback');
}

exports.getDashboard = (req, res, next) => {
  const sessionUser = req.session.user;

  if (!sessionUser || !sessionUser.email) {
    console.error("Session missing or malformed:", req.session);
    return res.status(401).send("Unauthorized: No user session found");
  }

  User.find()
    .then(accounts => {
      const matchedAccount = accounts.find(acc => acc.email === sessionUser.email);
      if (!matchedAccount) {
        console.error("User not found for email:", sessionUser.email);
        return res.status(404).send("User not found");
      }

      req.session.user = matchedAccount;

      Job.find()
        .then(allJobs => {
          const postedJobIds = Array.isArray(matchedAccount.postedJobs)
            ? matchedAccount.postedJobs.map(id => id.toString())
            : [];

          const postedJobs = allJobs.filter(job =>
            postedJobIds.includes(job._id?.toString())
          );

          Worker.find().then(allWorkers => {
            const hiredWorkerIds = Array.isArray(matchedAccount.hiredWorkers) ? matchedAccount.hiredWorkers.map(id => id.toString()) : [];

            const hiredWorkers = allWorkers.filter(worker =>
              hiredWorkerIds.includes(worker._id?.toString())
            );

            try {
              res.render('Dashboard', {
                user: matchedAccount,
                PostedJob: postedJobs,
                hiredWorkers: hiredWorkers
              });
            } catch (renderErr) {
              console.error("Render error:", renderErr);
              res.status(500).send("Failed to render dashboard");
            }
          })
            .catch(err => {
              console.error("Error fetching workers:", err);
              res.status(500).send("Failed to load workers");
            });
        })
        .catch(err => {
          console.error("Error fetching jobs:", err);
          res.status(500).send("Failed to load jobs");
        });
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      res.status(500).send("Failed to load user");
    });
};


exports.getPayroll = (req, res, next) => {
  res.render('Payroll');
}

exports.getReport = (req, res, next) => {
  res.render('Report');
}

// controllers/userController.js

exports.getProfile = (req, res, next) => {
  // 1. Protect the route: redirect to login if not authenticated
  if (!req.session.isLoggedIn || !req.session.user) {
    return res.redirect('/login');
  }
  // 2. Fetch user data from session
  const user = req.session.user;
  Job.find().then(allJobs => {
    const appliedJobs = allJobs.filter(job => user.jobsApplied.includes(job._id.toString()));
    const bookmarkedJobs = allJobs.filter(job => user.bookmarkedJobs.includes(job._id.toString()));
    res.render('profile', { user: user, appliedJobs: appliedJobs, bookmarkedJobs: bookmarkedJobs });
  }).catch(err => {
    console.error("Error fetching jobs:", err);
    res.status(500).send("Internal Server Error");
  });

};

exports.postApplyJob = (req, res, next) => {
  const { jobId } = req.body;
  // console.log("Job ID to apply:", jobId); // Debugging line
  res.render('applying-form', {
    jobId: jobId
  });
};

exports.postSaveJob = (req, res, next) => {
  const { jobId } = req.body;

  // console.log("Job ID to bookmark:", jobId); // Debugging line
  User.find().then(accounts => {
    const matchingAccount = accounts.find(account => account.email === req.session.user.email);
    if (!matchingAccount) {
      return res.render('Login', { error: 'User not found' });
    } else {
      if (!matchingAccount.bookmarkedJobs.includes(jobId)) {
        matchingAccount.bookmarkedJobs.push(jobId); // Add jobId to bookmarkedJobs array
      }
      matchingAccount.save().then(() => {
        // console.log("User account updated with bookmarked job."); 
        res.redirect('/joblisting'); // Redirect or respond as needed
      }).catch(err => {
        console.error("Error updating user account:", err);
        res.status(500).send("Internal Server Error");
      });

    }
  })
};

exports.postSubmitApplication = (req, res, next) => {
  User.find().then(accounts => {
    const matchedAccount = accounts.find(account => account.email === req.session.user.email);
    if (!matchedAccount) {
      return res.render('Login', { error: 'User not found' });
    }

    const { JobId, name, phone, email, resume, cover } = req.body;

    // Check if job already applied
    Application.find().then(applications => {
      const alreadyApplied = applications.some(app =>
        app.email === req.session.user.email && app.JobId === JobId
      );

      if (alreadyApplied) {
        return res.render('home', { showPopup: false, message: 'You have already applied for this job.' });
      }

      // Push job ID to user's applied list if not already present
      if (JobId && !matchedAccount.jobsApplied.includes(JobId)) {
        matchedAccount.jobsApplied.push(JobId);
      }

      return matchedAccount.save().then(() => {
        const application = new Application({JobId, fullName: name, phone, email, resume, cover});
        return application.save();
      }).then(() => {
        res.render('home', { showPopup: true });
      }).catch(err => {
        console.error('Error submitting application:', err);
        res.status(500).send('Internal Server Error');
      });
    });
  });
};


exports.postApplicants = (req, res, next) => {
  const { jobId } = req.body;
  Application.find().then(applications => {
    const jobApplications = applications.filter(app => app.JobId === jobId);
    res.render('Applicants', { applications: jobApplications });
  }).catch(err => {
    res.status(500).send("Internal Server Error");
  });
}

exports.postHireApplicant = (req, res, next) => {
  const user = req.session.user;
  const { email } = req.body;

  Worker.find()
    .then(workers => {
      const workerToHire = workers.find(worker => worker.email === email);
      if (!workerToHire) {
        return res.status(404).send("Worker not found");
      }

      User.find().then(accounts => {
        const matchedAccount = accounts.find(account => account.email === user.email);
        if (!matchedAccount) {
          return res.status(404).send("User not found");
        }

        // Ensure hiredWorkers is an array
        const hiredWorkers = Array.isArray(matchedAccount.hiredWorkers)
          ? [...matchedAccount.hiredWorkers]
          : [];

        // Prevent duplicate entries
        const workerIdStr = workerToHire._id.toString();
        if (!hiredWorkers.includes(workerIdStr)) {
          hiredWorkers.push(workerIdStr);
        }

        matchedAccount.hiredWorkers = hiredWorkers;

        // Perform update
        matchedAccount.save()
          .then(() => {
            console.log("User account updated with hired worker.");
            res.redirect('/dashboard');
          })
          .catch(err => {
            console.error("Error updating user account:", err);
            res.status(500).send("Internal Server Error");
          });
      });
    })
    .catch(err => {
      console.error("Error fetching workers:", err);
      res.status(500).send("Internal Server Error");
    });
};


exports.postStartChat = (req, res, next) => {
  const { email } = req.body;
  const userEmail = req.session.email;

  User.find().then(accounts => {
    const matchedAccount = accounts.find(account => account.email === email);
    if (!matchedAccount.chattedAccount.includes(userEmail)) {
      matchedAccount.chattedAccount.push(userEmail);
      matchedAccount.conversations.push([]);
    }
    
    matchedAccount.save().then(() => {
      console.log("User account updated with sent message.");
    });
  })

  User.find().then(accounts => {
    const matchedAccount = accounts.find(account => account.email === userEmail);
    if (!matchedAccount.chattedAccount.includes(email)) {
      matchedAccount.chattedAccount.push(email);
      matchedAccount.conversations.push([]);
    }
    const size = matchedAccount.conversations.length - 1;
    matchedAccount.save().then(() => {
      console.log("User account updated with sent message.");

      res.render('Chat', {
        chattedAccount: matchedAccount.chattedAccount,
        chatObject: matchedAccount.conversations[size],
        selectedAccount: email
      });
    });
  })

}

exports.postSendMsg = (req, res, next) => {
  console.log(req.body);
  const { recipientEmail, message } = req.body;
  const userEmail = req.session.email;

  if (!message || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'Message cannot be empty' });
  }

  if (recipientEmail === 'bot@workzap.com') {
    return User.find().then(accounts => {
      const matchedAccount = accounts.find(account => account.email === userEmail);
      if (!matchedAccount) throw new Error('Sender not found');

      let conversations = matchedAccount.conversations || [];
      const index = matchedAccount.chattedAccount.indexOf(recipientEmail);
      const userMessageObj = { email: userEmail, message: message, timestamp: new Date() };

      // Make sure bot is in the chatted accounts
      if (index === -1) {
        matchedAccount.chattedAccount.unshift(recipientEmail);
        conversations.unshift([{ email: 'bot@workzap.com', message: 'Hello! I am the WorkZap Bot. Ask me for help.', timestamp: new Date() }]);
      }

      const activeIndex = matchedAccount.chattedAccount.indexOf(recipientEmail);

      let botResponseText = "";
      const lowerMsg = message.toLowerCase();
      const isEmployee = req.session.userType === 'Employee';

      if (isEmployee) {
        if (lowerMsg.includes('apply')) {
          botResponseText = "To apply for a job, navigate to 'Job Listings', select a position you are interested in, and click the 'Apply' button.";
        } else if (lowerMsg.includes('status')) {
          botResponseText = "You can view the status of all your applications by visiting your personal Dashboard.";
        } else if (lowerMsg.includes('profile')) {
          botResponseText = "Make sure your profile is fully updated with your skills and contact info to stand out to employers!";
        } else if (lowerMsg.includes('contact')) {
          botResponseText = "If you need human assistance, please reach out to support@workzap.com.";
        } else {
          botResponseText = "I'm a simple bot. Try typing one of these keywords: 'apply', 'status', 'profile', or 'contact'.";
        }
      } else {
        // Hirer logic
        if (lowerMsg.includes('post job')) {
          botResponseText = "To post a new job, click on 'Post Job' in the main navigation menu and fill out the required details.";
        } else if (lowerMsg.includes('review')) {
          botResponseText = "You can review applicants for your open roles from the 'Applicants' tab in your Dashboard.";
        } else if (lowerMsg.includes('hire')) {
          botResponseText = "Found a good match? You can officially hire an applicant directly from their profile page.";
        } else if (lowerMsg.includes('billing')) {
          botResponseText = "For invoices and payment history, please visit the Billing section in your Account Settings.";
        } else {
          botResponseText = "I'm a simple bot. Try typing one of these keywords: 'post job', 'review', 'hire', or 'billing'.";
        }
      }

      const botMessageObj = { email: 'bot@workzap.com', message: botResponseText, timestamp: new Date() };

      conversations[activeIndex].push(userMessageObj);
      conversations[activeIndex].push(botMessageObj);

      matchedAccount.conversations = conversations;

      return matchedAccount.save().then(() => {
        console.log("Bot message saved.");
        res.status(200).json({ success: true });
      });
    }).catch(err => {
      console.error("Bot Error:", err);
      res.status(500).json({ success: false, error: 'Bot Error' });
    });
  }


  // Helper promise to update recipient
  const updateRecipient = User.find().then(accounts => {
    const matchedAccount = accounts.find(account => account.email === recipientEmail);
    if (!matchedAccount) throw new Error('Recipient not found');

    const index = matchedAccount.chattedAccount.indexOf(userEmail);
    const messageObj = { email: userEmail, message: message, timestamp: new Date() };
    const reciverConversations = matchedAccount.conversations || [];

    if (index === -1) {
      matchedAccount.chattedAccount.push(userEmail);
      reciverConversations.push([messageObj]);
    } else {
      reciverConversations[index].push(messageObj);
    }

    matchedAccount.conversations = reciverConversations;
    return matchedAccount.save(); 
  });

  // Helper promise to update sender
  const updateSender = User.find().then(accounts => {
    const matchedAccount = accounts.find(account => account.email === userEmail);
    if (!matchedAccount) throw new Error('Sender not found');

    const index = matchedAccount.chattedAccount.indexOf(recipientEmail);
    const messageObj = { email: userEmail, message: message, timestamp: new Date() };
    const conversations = matchedAccount.conversations || [];

    if (index === -1) {
      matchedAccount.chattedAccount.push(recipientEmail);
      conversations.push([messageObj]);
    } else {
      conversations[index].push(messageObj);
    }

    matchedAccount.conversations = conversations;
    return matchedAccount.save();
  });

  Promise.all([updateRecipient, updateSender])
    .then(() => {
      console.log("Message saved to DB for both users.");
      res.status(200).json({ success: true });
    })
    .catch(err => {
      console.error("Error saving message:", err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
}