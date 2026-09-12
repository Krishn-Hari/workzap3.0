const fs = require('fs');
let code = fs.readFileSync('controller/host.js', 'utf8');

const regex = /User\.find\(\)\s*\.?then\(\s*accounts\s*=>\s*\{\s*(?:const|let)\s+(\w+)\s*=\s*accounts\.find\(\s*\w+\s*=>\s*\w+\.email\s*===\s*([^;]+)\s*\);/g;

let count = 0;
code = code.replace(regex, (match, varName, emailVar) => {
  count++;
  return `User.findOne({ email: ${emailVar} }).then(${varName} => {`;
});

console.log("Replaced User.find:", count);

const jobRegex = /Job\.find\(\)\s*\.?then\(\s*(\w+)\s*=>\s*\{/g;
let jobCount = 0;
// Wait, Job.find() without filters usually just fetches all jobs, e.g. for getJoblisting. But wait, in postJob it might be filtering? Let's check Job.find usage.

fs.writeFileSync('controller/host.js', code);
