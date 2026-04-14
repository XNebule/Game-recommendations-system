require("dotenv").config();
const express = require("express");

const authMiddleware = require('./middleware/auth')
const recommend = require("./modules/recommend/routes");
const auth = require('./modules/auth/routes')

const app = express();

app.use(express.json());

app.use('/api/auth', auth)
app.use('/api/recommend', authMiddleware, recommend)

module.exports = app;
