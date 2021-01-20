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
    var decoded = jwt.verify(userToken, "loginToken");
  } catch (err) {
    res.redirect("/");
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
 }

function checkEmail(req, res, next) {
   var email = req.body.email;
  var checkexitemail = userModule.findOne({ email: email });
  checkexitemail.exec((err, data) => { 
    if (err) throw error;
    if (data) {
      return res.render("signup", { title: "Password Management System",  msg: "Email Already Exist" });
    }
    next();
  });
}

function checkUserName(req, res, next) {
  var uname = req.body.uname;
  var checkexitname = userModule.findOne({ username: uname });
  checkexitname.exec((err, data) => {
    if (err) throw error;
    if (data) {
      return res.render("signup", { title: "Password Management System", msg: "Username Already Exist" });
    }
    next();
  });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  var loginUser = req.session.userName;
  if (req.session.userName) {
    res.redirect("./dashboard");
  } else {
    res.render("index", { title: "Password Management System ", msg: "" });
  }
});

router.post("/", function (req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  var checkUser = userModule.findOne({ username: username});
  checkUser.exec((err, data) => {
    if (err) throw err;
    var getUserID = data._id;
    var getPassword = data.password;
    if (bcrypt.compareSync(password, getPassword)) {
      var token = jwt.sign({ userId: getUserID },"loginToken");
      localStorage.setItem("userToken", token);
      localStorage.setItem("loginUser", username);
      req.session.userName = username;
      res.redirect("/dashboard");
    } else {
      res.render("index", { title: "Password Management System ", msg: "Invalid Username and Password." });
    }
  });
});

router.get("/signup", function (req, res, next) {
  var loginUser = req.session.userName;
  if (req.session.userName) {
    res.redirect("./dashboard");
  } else {
    res.render("signup", { title: "Password Management System", msg: "" });
  }
});

router.post("/signup", checkUserName, checkEmail, function (req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
  var password = req.body.password;
  var confpassword = req.body.confpassword;
  if (password != confpassword) {
    return res.render("signup", { title: "Password Management System", msg: "Password Not Matched", });
  } else {
    password = bcrypt.hashSync(req.body.password, 10);
    var userdetails = new userModule({
      username: username,
      email: email,
      password: password,
    });
    userdetails.save((err, doc) => {
      if (err) throw err;
      res.render("signup", { title: "Password Management System", msg: "User Register Successfully" });
    });
  }
});

router.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.redirect("/");
    }
  });
  localStorage.removeItem("userToken");
  localStorage.removeItem("loginUser");
  res.redirect("/");
});

module.exports = router;