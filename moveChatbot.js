const fs = require('fs');

const footerPath = './views/partials/footer.ejs';
const footerContent = fs.readFileSync(footerPath, 'utf8');

const lines = footerContent.split('\n');
const chatbotStartIndex = lines.findIndex(line => line.includes('/* Chatbot Styles */'));

if (chatbotStartIndex !== -1) {
  // Back up 1 line to catch the empty line before it if needed
  const chatbotLines = lines.slice(chatbotStartIndex - 1);
  const newFooterLines = lines.slice(0, chatbotStartIndex - 1);

  fs.writeFileSync(footerPath, newFooterLines.join('\n'));
  fs.writeFileSync('./views/partials/chatbot.ejs', chatbotLines.join('\n'));
  console.log("Extracted chatbot to chatbot.ejs");
}

['./views/home.ejs', './views/host-home.ejs'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('partials/chatbot')) {
    content = content.replace('</body>', '  <%- include(\'partials/chatbot\') %>\n</body>');
    fs.writeFileSync(file, content);
    console.log(`Added chatbot to ${file}`);
  }
});
