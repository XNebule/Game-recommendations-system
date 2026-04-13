require("dotenv").config();

const express = require("express");
const app = require('./app')
const port = process.env.PORT

const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        })
    } catch (err) {
        console.error("Error starting server: ", err)
    }
}

startServer()