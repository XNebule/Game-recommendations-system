function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  for (let key of keys) {
    const a = Number(vecA[key]) || 0;
    const b = Number(vecB[key]) || 0;

    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  // 🔥 CRITICAL FIX
  if (!magA || !magB) return 0;

  const result = dot / (magA * magB);

  // 🔥 SAFETY
  if (isNaN(result)) return 0;

  return result;
}

module.exports = cosineSimilarity;
