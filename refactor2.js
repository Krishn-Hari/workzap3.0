const fs = require('fs');
let code = fs.readFileSync('controller/host.js', 'utf8');

// Replace Dashboard Job.find()
code = code.replace(/Job\.find\(\)\s*\.?then\(\s*allJobs\s*=>\s*\{\s*const postedJobIds = Array\.isArray\(matchedAccount\.postedJobs\)\s*\?\s*matchedAccount\.postedJobs\.map\(id => id\.toString\(\)\)\s*:\s*\[\];\s*const myJobs = allJobs\.filter\(job => postedJobIds\.includes\(job\._id\.toString\(\)\)\);/g,
  `const postedJobIds = Array.isArray(matchedAccount.postedJobs) ? matchedAccount.postedJobs : [];
      Job.find({ _id: { $in: postedJobIds } }).then(myJobs => {`
);

fs.writeFileSync('controller/host.js', code);
console.log("Done");
