require("dotenv").config();
const fs = require("fs");
const path = require("path");
const natural = require("natural");

const prisma = require("../src/config/prisma");

/* =========================
   1. LOAD DATA FROM DB
========================= */

const loadGames = async () => {
  const games = await prisma.game.findMany({
    include: {
      descriptions: true,
      tags: true,
    },
  });

  return games.map((game) => {
    const tagBoost = 3
    const tags = game.tags.map((t) => t.tag).join(" ");
    const boostedTags = Array(tagBoost).fill(tags).join(" ")

    const text = `
      ${game.name}
      ${game.descriptions?.shortDesc || ""}
      ${boostedTags}
    `;

    return {
      id: game.id,
      name: game.name,
      text,
    };
  });
};

/* =========================
   2. PREPROCESS TEXT
========================= */

const tokenizer = new natural.WordTokenizer();
const stopwords = natural.stopwords;

const custStopwords = [
  "game",
  "play",
  "player",
  "players",
  "one",
  "two",
  "new",
  "use",
  "using",
];

const preprocess = (text) => {
  let tokens = tokenizer.tokenize(text.toLowerCase());

  tokens = tokens.filter(
    (word) => !stopwords.includes(word) && !custStopwords.includes(word),
  );

  tokens = tokens.filter((word) => word.length > 2);

  return tokens.join(" ");
};

/* =========================
   3. BUILD TF-IDF
========================= */
const TfIdf = natural.TfIdf;

const buildTfIdf = (games) => {
  const tfidf = new TfIdf();

  games.forEach((game) => {
    tfidf.addDocument(game.text);
  });

  return tfidf;
};

/* =========================
   4. VECTORIZE (FIXED)
========================= */

const vectorize = (tfidf, index) => {
  const terms = tfidf.listTerms(index);
  const vector = {};

  const blacklist = ["world", "number", "complete", "based"];

  terms
    .filter((t) => !blacklist.includes(t.term))
    .slice(0, 100)
    .forEach((term) => {
      vector[term.term] = term.tfidf;
    });

  return vector;
};

/* =========================
   5. MAIN PIPELINE
========================= */
const run = async () => {
  try {
    console.log("🚀 Building TF-IDF vectors...");

    const games = await loadGames();
    const processed = games.map((g) => ({
      id: g.id,
      name: g.name,
      text: preprocess(g.text),
    }));

    console.log("Sample processed:", processed[0]);

    const normalize = (vector) => {
      const norm = Math.sqrt(
        Object.values(vector).reduce((sum, val) => sum + val * val, 0),
      );

      const result = {};
      for (let key in vector) {
        result[key] = vector[key] / norm;
      }

      return result;
    };
    const tfidf = buildTfIdf(processed);
    const vectors = processed.map((g, i) => ({
      id: g.id,
      name: g.name,
      vector: normalize(vectorize(tfidf, i)),
    }));

    const outputPath = path.join(process.cwd(), "data/vectors.json");

    fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2));

    console.log("✅ TF-IDF vectors built");
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 Total games: ${vectors.length}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

run();
