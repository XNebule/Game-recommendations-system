require("dotenv").config();
const express = require("express");

const recommend = require("./modules/recommend/routes");

const app = express();

app.use(express.json());

app.use('/api/recommend', recommend)

module.exports = app;
