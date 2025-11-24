const express = require('express');
const dotenv =require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const userRouter = require('./routes/userRoute.js');
const currentUserRoute = require('./routes/currentUserRoute.js');
const { geminiResponse } = require('./gemini.js');

dotenv.config();    

const app = express();
const PORT = process.env.PORT || 5000;  


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/api/auth',userRouter)
app.use('/api/user',currentUserRoute)

app.get('/', async(req, res) => {
    let prompt = req.query.prompt;
    let data = await geminiResponse(prompt)
    res.json(data);
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});