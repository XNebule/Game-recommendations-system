require("dotenv").config();
const fs = require("fs");

const loadGames = require("../src/modules/recommend/loadData");
const preprocess = require("../src/modules/recommend/preprocess");
const buildTfIdf = require("../src/modules/recommend/tfidf");
const vectorize = require("../src/modules/recommend/vectorize");

const run = async () => {
  const games = await loadGames();

  const processed = games.map((g) => ({
    id: g.id,
    text: preprocess(g.text),
  }));

  const tfidf = buildTfIdf(processed);

  const vectors = processed.map((g, i) => ({
    id: g.id,
    vector: vectorize(tfidf, i),
  }));

  console.log(`TF-IDF vectors built`);

  fs.writeFileSync("data/vectors.json", JSON.stringify(vectors, null, 2));
  console.log(`Vectors saved to Data/vectors.json`);
};
run();
