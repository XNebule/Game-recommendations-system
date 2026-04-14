const fs = require('fs')
const path = require('path')

let VECTOR_CACHE = null

const loadVectorsOnce = () => {
    if (VECTOR_CACHE) return VECTOR_CACHE

    const data = fs.readFileSync(
        path.join(process.cwd(), 'data/vectors.json'),
        'utf-8'
    )

    VECTOR_CACHE = JSON.parse(data)

    console.log(`Vectors cached: ${VECTOR_CACHE.length}`)

    return VECTOR_CACHE
}

const getVectors = () => VECTOR_CACHE || loadVectorsOnce()

module.exports = {
    loadVectorsOnce,
    getVectors
}