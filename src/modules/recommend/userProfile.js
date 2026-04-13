const buildUserProfile = (preferences, vectors) => {
    const profile = {}

    preferences.forEach(pref => {
        const gameVector = vectors.find(v => v.id === pref.gameId)

        if (!gameVector) return

        for (let key in gameVector.vector) {
            profile[key] = (profile[key] || 0) + gameVector.vector[key]
        }
    });

    return profile
}

module.exports = buildUserProfile