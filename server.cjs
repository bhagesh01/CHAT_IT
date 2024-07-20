const express = require('express')
const app = express();
const PORT  = "8000"
const cors = require('cors')

app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST'], // Specify which methods are allowed
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify which headers are allowed
};

app.use(cors(corsOptions))
require('dotenv').config();


const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.post("/gemini",async (req,res)=>{

  if (!req.body.history || !Array.isArray(req.body.history.parts)) {
    res.status(400).send('Invalid history format');
    return;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  const chat = model.startChat({
    history : req.body.history,
  })

  const msg = req.body.message
  // const result = await chat.sendMessage(msg);
  // const result = await chat.sendMessageStream(msg);
  
  // const response= await result.response;
  // if(!response.ok){
  //   if (response.status === 429) {
  //     res.status(429).send('Rate limit exceeded. Please try again later.');
  //     return;
  //   }
  //   console.log(response.status)
  // }
  // const text =  await response.text();
  // res.send(text);

  try {
    const result = await chat.sendMessageStream(msg);
    const response = await result.response;
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).send('Internal Server Error');
  }

})





app.listen(PORT , ()=>{
  console.log("listening on the port" + PORT)
})