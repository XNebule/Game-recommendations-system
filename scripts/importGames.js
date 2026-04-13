require('dotenv').config()

const fs = require('fs')
const csv = require('csv-parser')
const prisma = require('../src/config/prisma')

const run = async () => {
    const results = []

    fs.createReadStream("data/steam.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (!row.appid || !row.name) return;

        results.push({
          id: parseInt(row.appid),
          name: row.name,
        });
      })
      .on("end", async () => {
        console.log(Object.keys(prisma));
        await prisma.game.createMany({
          data: results,
          skipDuplicates: true,
        });

        console.log("✅ Games imported");
        process.exit();
      });
}

run()