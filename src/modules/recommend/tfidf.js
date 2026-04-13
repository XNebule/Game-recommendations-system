const natural = require('natural')
const tfIdf = natural.TfIdf

const buildTfIdf = (games) => {
    const tfidf = new tfIdf()

    games.forEach(game => {
        tfidf.addDocument(game.text)
    })

    return tfidf
}

module.exports = buildTfIdf