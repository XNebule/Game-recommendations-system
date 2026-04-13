const vectorize = (tfidf, index) => {
    const terms = tfidf.listTerms(index)

    const vector = {}

    terms.forEach(term => {
        vector[term.term] = term.tfidf
    })

    terms.slice(0, 100)

    return vector
}

module.exports = vectorize