const prisma = require('../../config/prisma')

const lV = require('./loadVectors')
const buildUserProfile = require('./userProfile')
const rfp = require('./recommend')

const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId
        console.log("USER ID: ", userId)

        const preferences = await prisma.userPreference.findMany({
            where: { userId }
        })
        console.log("Preferences: ", preferences)

        if(preferences.length === 0) {
            return res.json({ Message: 'No preferences found' })
        }

        const vectors = lV()
        const profile = buildUserProfile(preferences, vectors)
        const results = rfp.recommendFromProfile(profile, vectors, 10)

        res.json(results)

    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}

const favGames = async (req, res) => {
    try {
        const userId = req.user.userId
        const { gameId } = req.body

        const result = await prisma.userPreference.create({
            data: {

                userId,
                gameId: Number(gameId)
            }
        })

        res.json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            Message: "Server Error",
            Error: err.message
        })
    }
}

module.exports = {
    getRecommendations, favGames
}