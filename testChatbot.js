const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

async function main() {
  try {
    const result = await model.generateContent("Hello!");
    const response = await result.response;
    const text = response.text();
    console.log("Success:", text);
  } catch(e) {
    console.error("Error:", e.message);
  }
}
main();
