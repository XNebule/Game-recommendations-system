const { generateKey } = require("crypto");
const fs = require("fs");
const path = require("path");

let CACHE = null;

/* CACHING */

const loadVector = () => {
  if (CACHE) return CACHE;

  const data = fs.readFileSync(
    path.join(process.cwd(), "data/vectors.json"),
    "utf-8",
  );

  CACHE = JSON.parse(data);
  console.log(`Vectors cached: ${CACHE.length}`);

  return CACHE;
};

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
  const vectors = loadVector()
  const target = vectors.find((g) => g.id === gameId);

  if (!target) {
    throw new Error("Game not found");
  }

  const results = vectors
    .filter((g) => g.id !== gameId)
    .map((g) => ({
      id: g.id,
      name: g.name,
      score: cosineSimilarity(target.vector, g.vector),
    }))
    .filter((g) => g.score > MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
  
  return results
};

/* Profile preference */

const buildUserProfile = (preferences, vectors) => {
  const profile = {};

  preferences.forEach((pref) => {
    const gameVector = vectors.find(
      (v) => Number(v.id) === Number(pref.gameId),
    );

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

const recommendFromProfile = (profileVector, vectors, topN = 20) => {
  const scores = [];

  for (let v of vectors) {
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
  const profile = buildUserProfile(preferences, vectors);

  if (Object.keys(profile).length === 0) {
    return [];
  }

  const result = recommendFromProfile(profile, vectors, 10);

  return result;
};

module.exports = {
  generateRecommendations, getSimilarGames
};
