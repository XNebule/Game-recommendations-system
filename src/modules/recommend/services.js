const { generateKey } = require("crypto");
const fs = require("fs");
const path = require("path");

let CACHE = null;
let vectorMap = new Map()
const resultCache = new Map()

/* CACHING */

const loadVector = () => {
  if (CACHE) return CACHE;

  const data = fs.readFileSync(
    path.join(process.cwd(), "data/vectors.json"),
    "utf-8",
  );

  CACHE = JSON.parse(data);
  vectorMap = new Map(CACHE.map((g) => [g.id, g]))
  console.log(`Vectors cached: ${CACHE.length}`);

  return CACHE;
};

/* Normalize */

const normalize = (vector) => {
  const norm = Math.sqrt(
    Object.values(vector).reduce((sum, val) => sum + val * val, 0)
  )

  if (norm === 0) return vector

  const result = {}
  for (let key in vector) {
    result[key] = vector[key] / norm
  }

  return result
}

/* Cosine Similarity */

const cosineSimilarity = (vecA, vecB) => {
  let score = 0;

  for (let key in vecA) {
    if (vecB[key]) {
      score += vecA[key] * vecB[key];
    }
  }

  return score;
};

/* Get similar games */

const getSimilarGames = (gameId, topN = 5) => {
  const MIN_SCORE = 0.1

  loadVector()

  const cacheKey = `${gameId}-${topN}`

  if (resultCache.has(cacheKey)) {
    return resultCache.get(cacheKey)
  }
  
  const target = vectorMap.get(gameId)

  if (!target) {
    throw new Error("Game not found");
  }

  const results = []

  for (let g of CACHE) {
    if (g.id === gameId) continue

    const score = cosineSimilarity(target.vector, g.vector)

    if (score > MIN_SCORE) {
      results.push({
        id: g.id,
        name: g.name,
        similarity: score
      })
    }
  }

  results.sort((a, b) => b.similarity - a.similarity)
  const finalResults = results.slice(0, topN)

  resultCache.set(cacheKey, finalResults)
  
  return finalResults
};

/* Profile preference */

const buildUserProfile = (preferences) => {
  const profile = {};

  preferences.forEach((pref) => {
    const gameVector = vectorMap.get(Number(pref.gameId))

    console.log("Preference:", pref.gameId);
    console.log("Found:", gameVector ? "Yes" : "No");

    if (!gameVector) return;

    for (let key in gameVector.vector) {
      profile[key] = (profile[key] || 0) + gameVector.vector[key];
    }
  });

  return profile;
};

/* Recommendations */

const recommendFromProfile = (profileVector, vectors, preferences, topN = 20) => {
  const prefId = new Set(preferences.map(p => Number(p.gameId)))
  const scores = [];

  for (let v of vectors) {
    if (prefId.has(Number(v.id))) continue


    const cosine = cosineSimilarity(profileVector, v.vector);

    scores.push({
      gameId: v.id,
      score: cosine,
    });
  }

  const result = scores.sort((a, b) => b.score - a.score).slice(0, topN);
  return result;
};

/* Main Recommendations calculation */

const generateRecommendations = (preferences) => {
  const vectors = loadVector();
  const rawProfile = buildUserProfile(preferences)

  if (Object.keys(rawProfile).length === 0) {
    return []
  }

  const profile = normalize(rawProfile)
  const result = recommendFromProfile(profile, vectors, preferences, 10)

  return result;
};

module.exports = {
  generateRecommendations, getSimilarGames
};
