import express from "express"; //create server & routes
import cors from "cors";  //allow react app to backend
import dotenv from "dotenv"; //reads .env file

 //loads .env file
  dotenv.config();
console.log("HF KEY:", process.env.HUGGINGFACE_API_KEY);

const app = express();  //creates backend app 

// middleware
app.use(cors());  //allow frontend to backend
app.use(express.json());  //use Express to read JSON data from requests

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// takes user input(prompt) , send to AI & return tasks
const generateWithHF = async (prompt) => {
  console.log(" MOCK AI TRIGGERED");

  return [
    {
      title: `Plan your day based on: ${prompt}`,
      Status: "Pending", 
    },
    {
      title: "Break task into small steps",
      Status: "Completed",
    },
    {
      title: "Execute and review progress",
      Status: "All",
    },
  ];
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

    return res.json(tasks); //frontend receives JSON
  } catch (error) {
    console.error("ROUTE ERROR:", error.message);
                                         //if crahes then send fallback tasks
    return res.json(fallbackTasks());
  }
});

//server we started
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});