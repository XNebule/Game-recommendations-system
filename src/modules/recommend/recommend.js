const cS = require("./cosine");

const recommend = (targetGameId, vectors, topN = 10) => {
  const target = vectors.find((v) => v.id === targetGameId);

  if (!target) {
    console.log("Target game not found");
    return [];
  }

  const scores = [];

  for (let v of vectors) {
    if (v.id === targetGameId) continue;

    const similarity = cS(target.vector, v.vector);

    scores.push({
      gameId: v.id,
      score: similarity,
    });
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, topN);
};

const recommendFromProfile = (profileVector, vectors, topN = 20) => {
  const scores = [];

  for (let v of vectors) {
    const similarity = cS(profileVector, v.vector);

    scores.push({
      gameId: v.id,
      score: similarity,
    });
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, topN);
};

module.exports = { recommend, recommendFromProfile };
