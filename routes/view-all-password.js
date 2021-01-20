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
    var options = {
        offset: 1,
        limit: 3
    };

    passModel.paginate({}, options).then(function (result) {
        res.render("view-all-password", {
            title: " Password Management System",
            loginUser: loginUser,
            records: result.docs,
            current: result.offset,
            pages: Math.ceil(result.total / result.limit)

        });
    })

});



router.get("/:page", checkLoginUser, function (req, res, next) {
    var loginUser = req.session.userName;
    var perPage = 2;
    var page = req.params.page || 1;
    getAllPass.skip((perPage * page) - perPage)
        .limit(perPage).exec(function (err, data) {
            if (err) throw err;
            passModel.countDocuments({}).exec((err, count) => {
                res.render("view-all-password", {
                    title: " Password Management System",
                    loginUser: loginUser,
                    records: data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            });
        }) 

});


module.exports = router;


/*
router.get("/view-all-password/", checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var perPage = 2;
  var page = req.params.page || 1;
  getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function (err, data) {
      if (err) throw err;
      passModel.countDocuments({}).exec((err, count) => {
        res.render("view-all-password", {
          title: " Password Management System",
          loginUser: loginUser,
          records: data,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    })

});


router.get("/view-all-password/:page", checkLoginUser, function (req, res, next) {
  var loginUser = localStorage.getItem("loginUser");
  var perPage = 2;
  var page = req.params.page || 1;
  getAllPass.skip((perPage * page) - perPage)
    .limit(perPage).exec(function (err, data) {
      if (err) throw err;
      passModel.countDocuments({}).exec((err, count) => {
        res.render("view-all-password", {
          title: " Password Management System",
          loginUser: loginUser,
          records: data,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    })

});
*/