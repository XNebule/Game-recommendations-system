const fs = require('fs')
const path = require('path')

const loadVectors = () => {
    const data = fs.readFileSync(
        path.join(__dirname, '../../../data/vectors.json'), 'utf-8'
    )
    return JSON.parse(data)
}
module.exports = loadVectors