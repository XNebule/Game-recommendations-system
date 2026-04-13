const fs = require('fs')

const loadVectors = () => {
    const data = fs.readFileSync('data/vectors.json')
    return JSON.parse(data)
}

module.exports = loadVectors