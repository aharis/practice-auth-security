//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.CONNECTDB, {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//const secretKey = "thisismysecretkey";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password,
    })

    user.save((err) => {
        if (err) {
            console.log(err)
        } else {
            res.render("secrets")
        }
    })
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log("eror server")
        } else {
            if (foundUser.password === password) {
                res.render("secrets")
            }
        }
    })
});

const PORT = 5000;
app.listen(PORT, () => { console.log(`Server running on port: ${PORT}!`) })