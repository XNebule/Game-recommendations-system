require('dotenv').config()

const prisma = require('../../config/prisma')

const loadGames = async () => {
  const games = await prisma.game.findMany({
    include: {
      descriptions: true,
      tags: true,
    },
  });

  return games.map((game) => {
    const tags = game.tags.map((t) => t.tag).join(" ");

    const text = `
        ${game.name}
        ${game.descriptions?.shortDesc || ""}
        ${game.descriptions?.detailedDesc || ""}\
        ${tags}
        `;

    return {
      id: game.id,
      text,
    };
  });
};

module.exports = loadGames