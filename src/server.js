require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT

const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server running on ${port}`)
        })
    } catch (err) {
        console.error("Error starting server: ", err)
    }
}

startServer()