const express = require('express')
const router = express.Router()

const rC = require('./controller')

router.post('/', rC.favGames)
router.get('/', rC.getRecommendations)

module.exports = router