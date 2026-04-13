require("dotenv").config();

const fs = require("fs");
const csv = require("csv-parser");
const prisma = require("../src/config/prisma");

const run = async () => {
  const results = [];

  const games = await prisma.game.findMany({
    select: { id: true },
  });

  const validGameIds = new Set(games.map((g) => g.id));

  if (!fs.existsSync("data/steamspy_tag_data.csv")) {
    console.error("❌ File not found!");
    process.exit(1);
  }

  fs.createReadStream("data/steamspy_tag_data.csv")
    .pipe(csv())
    .on("data", (row) => {
      const gameId = parseInt(row.appid);

      if (!gameId || !validGameIds.has(gameId)) return;

      Object.keys(row).forEach((key) => {
        if (key !== "appid" && row[key] !== "0") {
          results.push({
            gameId,
            tag: key,
          });
        }
      });
    })
    .on("end", async () => {
      console.log(Object.keys(prisma));
      const BATCH_SIZE = 1000;

      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);

        await prisma.gameTag.createMany({
          data: batch,
          skipDuplicates: true,
        });

        console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1}`);
      }

      console.log("✅ Tags imported safely");
      process.exit();
    });
};

run();
