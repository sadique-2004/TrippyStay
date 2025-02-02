const express = require("express");
let app= express();

app.get("/",(req,res)=>{
    res.send("hi i am root");
});

app.get("/post", (req,res)=> {
    res.send("You are in post");
});
app.post("/post", (req,res)=> {
    res.send("post your data")
})
app.get("/post/:id", (req,res)=> {
    res.send("You are in  post and is page")
});

app.get("/users", (req,res)=> {
    res.send("User page");
});
app.get("/users/:id", (req,res) => {
    res.send("Users id");
})

app.listen(8080, () => {
    console.log("app is listining on port 0");
});