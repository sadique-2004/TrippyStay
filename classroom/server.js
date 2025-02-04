const express = require("express");
let app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get("/getcookies", (req,res)=>{
    res.cookie("name", "Sadique");
    res.cookie("age", 25);
    res.cookie("city", "Samastipur");
    res.cookie("MadeIn", "India");
    res.send("sent you some cookies");
});

app.get("/greet", (req,res)=>{
    let {name="Babu Bhaiya"} = req.cookies;
    res.send(`Hello ${name} Welcom in the world of hacking. Dont warry i get your some information hahaha !`);
})

app.get('/', (req,res)=> {
    console.dir(req.cookies);
    res.send("Hii i am developer sadique");
});

// create basic routs for posts
app.get('/posts', (req,res)=> {
    res.send("Hii i am post");
});

// update routes
app.put('/posts/:id', (req,res)=> {
    res.send(`Hii i am update request with id ${req.params.id}`);
});

// delete routes
app.delete('/posts/:id', (req,res)=> {
    res.send(`Hii i am delete request with id ${req.params.id}`);
});

// create routes
app.post('/posts', (req,res)=> {
    res.send("Hii i am post request");
});

// index routes
app.get('/users', (req,res)=> {
    res.send("Hii i am user");
});

// user routes
app.get('/users/:id', (req,res)=> {
    res.send(`Hii i am user with id ${req.params.id}`);
})

//  delete routes
app.delete('/users/:id', (req,res)=> {
    res.send(`Hii i am delete request with id ${req.params.id}`);
});

// post routes
app.post('/users', (req,res)=> {
    res.send("Hii i am post request");
});


app.listen(3000, ()=>{
    console.log("App is listening on post 3000");
});