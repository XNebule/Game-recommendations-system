const express = require('express')
const router = express.Router()

const aC = require('./controller')

router.post('/register', aC.register)
router.post('/login', aC.login)

module.exports = router