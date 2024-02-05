const express = require('express');
const fetch = require('node-fetch');
require("dotenv").config();

const app = express();

app.set("view engine ", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

const port = process.env.port || 3000;

app.get("/" , (req , res) => {
    res.render("index.ejs");
})

app.post("/convert-mp3" ,async (req , res) => {
    const videoID = req.body.videoID;
    // let videoIDS = videoLink.slice(32);
    if(
        videoID === undefined || 
        videoID === "" ||
        videoID === null 
    ){
        res.render("index.ejs", {success : false , message : "Please enter a video ID"});
    }else{
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,{
            "method" : "GET",
            "headers" : {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        });
        const fetchResponse = await fetchAPI.json();
        if (fetchResponse.status === "ok") {
            res.render("index.ejs" , {success : true , song_link : fetchResponse.link , song_title : fetchResponse.title});
        } else {
            res.render("index.ejs", {success : false , message : fetchResponse.msg})
        }
    }
})

app.listen(port , () =>{
    console.log(`listening on port : ${port}`);
})
