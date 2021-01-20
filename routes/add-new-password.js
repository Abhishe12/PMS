var express = require("express");
var router = express.Router();
var userModule = require("../module/user");
var passCatModel = require("../module/password_category");
var passModel = require("../module/add_password");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const {
    check,
    validationResult
} = require("express-validator");
const {
    query
} = require("express");
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
            return res.render("signup", {
                title: "Password Management System",
                msg: "Username Already Exist",
            });
        }
        next();
    });
}

router.get("/", checkLoginUser, function (req, res, next) {
    var loginUser = req.session.userName;
    getPassCat.exec(function (err, data) {
        if (err) throw error; {
            res.render("add-new-password", {
                title: " Password Management System",
                loginUser: loginUser,
                records: data,
                success: ""
            });
        }
    });
});

router.post("/", checkLoginUser, function (req, res, next) {
    var loginUser = req.session.userName;
    var pass_cat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    var password_deatils = new passModel({
        password_category: pass_cat,
        project_name: project_name,
        password_detail: pass_details
    });
    password_deatils.save(function (err, doc) {
        getPassCat.exec(function (err, data) {
            if (err) throw err;
            res.render("add-new-password", {
                title: " Password Management System",
                loginUser: loginUser,
                records: data,
                success: "password Details Inserted Successfully"
            });
        });
    });
});




module.exports = router;