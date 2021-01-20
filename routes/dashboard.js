var express = require("express");
var router = express.Router();
var userModule = require("../module/user");
var passCatModel = require("../module/password_category");
var passModel = require("../module/add_password");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { query } = require("express");
var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});

function checkLoginUser(req, res, next) {
    var userToken = localStorage.getItem("userToken");

    try {
        if (req.session.userName) {
            var decoded = jwt.verify(userToken, "loginToken");
        } else {
            res.redirect("/");
        }
    } catch (err) {}

    next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}

function checkEmail(req, res, next) {
    var email = req.body.email;
    var checkexitemail = userModule.findOne({
        email: email,
    });
    checkexitemail.exec((err, data) => {
        if (err) throw error;
        if (data) {
            return res.render("signup", {
                title: "Password Management System",
                msg: "Email Already Exist",
            });
        }
        next();
    });
}

function checkUserName(req, res, next) {
    var uname = req.body.uname;
    var checkexitname = userModule.findOne({
        username: uname,
    });
    checkexitname.exec((err, data) => {
        if (err) throw error;
        if (data) {
            return res.render("signup", { title: "Password Management System", msg: "Username Already Exist"});
        }
        next();
    });
}


router.get("/", checkLoginUser, function (req, res, next) {
    var loginUser = req.session.userName;
    res.render("dashboard", { title: "Password Management System", loginUser: loginUser, msg: "" });
});

module.exports = router;