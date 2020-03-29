"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var express_1 = require("express");
var app = express_1["default"]();
var cors_1 = require("cors");
app.use(cors_1["default"]());
var express_formidable_1 = require("express-formidable");
app.use(express_formidable_1["default"]());
var mongoose_1 = require("mongoose");
mongoose_1["default"].connect("" + process.env.MONGODB_URI, { useNewUrlParser: true });
app.all("*", function (req, res) {
    return res.status(404).json({ message: "Page not found." });
});
app.listen("" + process.env.PORT, function () { return console.log("Server's runing..."); });
