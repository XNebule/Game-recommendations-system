require("dotenv").config();

const fs = require("fs");
const csv = require("csv-parser");
const prisma = require("../src/config/prisma");

const run = async () => {
  const results = [];

  // 🔥 Step 1: get all valid game IDs
  const games = await prisma.game.findMany({
    select: { id: true },
  });

  const validGameIds = new Set(games.map((g) => g.id));

  if (!fs.existsSync("data/steam_description_data.csv")) {
    console.error("❌ File not found!");
    process.exit(1);
  }

  fs.createReadStream("data/steam_description_data.csv")
    .pipe(csv())
    .on("data", (row) => {
      const gameId = parseInt(row.steam_appid);

      if (!gameId || !validGameIds.has(gameId)) return;

      results.push({
        gameId,
        shortDesc: row.short_description || "",
        detailedDesc: row.detailed_description || "",
      });
    })
    .on("end", async () => {
      console.log(Object.keys(prisma));
      const BATCH_SIZE = 1000;

      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);

        await prisma.gameDescription.createMany({
          data: batch,
          skipDuplicates: true,
        });

        console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1}`);
      }

      console.log("✅ Descriptions imported safely");
      process.exit();
    });
};

run();
