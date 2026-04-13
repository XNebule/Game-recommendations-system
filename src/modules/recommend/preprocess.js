const natural = require('natural')

const tokenizer = new natural.WordTokenizer()
const stopwords = natural.stopwords
const custStopwords = [
    'game', 'play', 'player', 'players', 'one', 'two', 'new', 'use', 'using'
]

const preprocess = (text) => {
    let tokens = tokenizer.tokenize(text.toLowerCase())

    tokens = tokens.filter(
        word => !stopwords.includes(word) && !custStopwords.includes(word)
    )

    tokens = tokens.filter(word => word.length > 2)

    return tokens.join(' ')
}

module.exports = preprocess