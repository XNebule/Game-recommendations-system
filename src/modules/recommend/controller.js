const prisma = require('../../config/prisma')

const lV = require('./loadVectors')
const buildUserProfile = require('./userProfile')
const rfp = require('./recommend')

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.userId

        const preferences = await prisma.userPreference.findMany({
            where: { userId }
        })

        if(preferences === 0) {
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