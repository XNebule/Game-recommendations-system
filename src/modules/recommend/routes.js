const express = require('express')
const router = express.Router()

const recommendation = require('./controller')

router.post('/', recommendation.favGames)
router.get('/', recommendation.getRecommendations)
router.get('/:id', recommendation.recommend)

module.exports = router