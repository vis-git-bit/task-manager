import express from "express"; //create server & routes
import cors from "cors";  //allow react app to backend
import dotenv from "dotenv"; //reads .env file
import Groq from "groq-sdk"; // AI client (used to call AI model)

//loads .env file into process.env
dotenv.config();
console.log("GROQ KEY:", process.env.GROQ_API_KEY); //  CHANGED (was HF KEY)

const app = express();  //creates backend app (server)

// middleware
app.use(cors());  //allow frontend to backend
app.use(express.json());  //use Express to read JSON data from requests

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// connects backend to AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// takes user input(prompt) , send to AI & return tasks
const generateWithHF = async (prompt) => {  
  try {
    console.log(" GROQ AI TRIGGERED"); 

    const chat = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Generate 5 short tasks for: ${prompt}

Return ONLY JSON in this format:
[
  { "title": "task 1", "Status": "Pending" }
]`,
        },
      ],
      model: "llama-3.1-8b-instant", //  AI model
    });

    const text = chat.choices[0].message.content; // get the AI-generated text from the first response inside the chat object

    console.log("AI TEXT:", text); // debug AI output

    //  Try to extract JSON from AI response
    try {
      const start = text.indexOf("["); // find start of JSON
      const end = text.lastIndexOf("]") + 1; // find end of JSON

      const json = text.slice(start, end);   // extract JSON part

      return JSON.parse(json);  // convert string to JS object
    } catch (err) {
      console.log("Parsing failed, using fallback format");

      // fallback if  fails 
      return [
        {
          title: text.slice(0, 60) || "Generated Task",
          Status: "Pending",
        },
      ];
    }

  } catch (error) {
    console.error("GROQ ERROR:", error.message);

    return fallbackTasks(); //fallback if API fails
  }
};


// fallback function 
const fallbackTasks = () => {
  return [
    { title: "Plan your day", Status: "Pending" },
    { title: "Complete important work", Status: "Pending" },
    { title: "Review tasks", Status: "Pending" },
  ];
};


//main API
app.post("/generate-tasks", async (req, res) => {  // This creates an API endpoint (/generate-tasks)
  try {
    const { prompt } = req.body; //Get data from frontend

    console.log(" API HIT");
    console.log("Prompt:", prompt);

    if (!prompt) {  //If user sends empty reject request
      return res.status(400).json({ error: "Prompt is required" });
    }

    const tasks = await generateWithHF(prompt); //backend generates tasks

    return res.json(tasks); //sends response back
  } catch (error) {
    console.error("ROUTE ERROR:", error.message);
    //if crashes then send fallback tasks
    return res.json(fallbackTasks());
  }
});


//server we started
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});