//const express = require('express');
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/employee", {
  useNewUrlParser: true
});
var conn = mongoose.connection;
var employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  etype: String,
  houlyrate: Number,
  totalHour: Number,
  total: Number
});
employeeSchema.methods.totalSalary = function () {
  return this.houlyrate * this.totalHour;
};

var employeeModel = mongoose.model("Employee", employeeSchema);
var employees = new employeeModel({
  name: "abhishek",
  email: "abhishek123@gmail.com",
  etype: "hourly",
  houlyrate: 10,
  totalHour: 16
});

employees.total = employees.totalSalary();
conn.on("connected", function () {
  console.log("connected successfully");
});

conn.on("disconnected", function () {
  console.log("Disconnected Successfully");
});

conn.on("error", console.error.bind(console, "connection error:"));
conn.once("open", function () {
  employees.save(function (err, res) {
    if (err) throw error;
    console.log(res);
    conn.close();
  });
  /*employeeModel.find({}, function (err, res) {
    if (err) throw error;
    console.log(res);
    conn.close();
  });*/
});