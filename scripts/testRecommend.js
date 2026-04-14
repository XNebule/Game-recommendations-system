const lV = require('../src/modules/recommend/loadVectors')
const recommend = require('../src/modules/recommend/recommend')

const testRec = () => {
    const vectors = lV()
    
    const targetGameId = vectors[0].id
    console.log('Target Game ID: ', targetGameId)
    
    const results = recommend.recommend(targetGameId, vectors, 50)
    
    console.log("Sample vector:", vectors[0]);
    console.log('Recommendations:')
    console.log(results)
}
testRec()