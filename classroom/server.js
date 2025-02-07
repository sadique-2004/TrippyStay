const express = require("express");
let app = express();
const session = require('express-session');

app.get("/",(req,res)=>{
    res.render('index.ejs');
})



app.listen(3000, ()=>{
    console.log("App is listening on post 3000");
});