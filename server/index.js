require(".dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//ROUTES
app.use("api/posts", postRoutes);

//health check
app.get("api/health", (req, res)=>{
    res.json({status: "ok" , message: "Server is running"});
})

//Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blogdb";

mongoose.connect(MONGO_URI)
    .then(() =>{
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log(`Console running in ${PORT}`))
    })
    .catch((err) =>{
        console.error("error connecting to mongoDB", err.message);
        process.exit(1);
    });