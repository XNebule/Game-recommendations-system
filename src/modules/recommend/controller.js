const prisma = require("../../config/prisma");

const { generateRecommendations } = require("./services");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const preferences = await prisma.userPreference.findMany({
      where: { userId },
    });

    if (preferences.length === 0) {
      return res.json({ Message: "No preferences found" });
    }

    const results = generateRecommendations(preferences);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const favGames = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { gameId } = req.body;

    const result = await prisma.userPreference.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId: Number(gameId),
        },
      },
      update: {}, // do nothing if exists
      create: {
        userId,
        gameId: Number(gameId),
      },
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      Message: "Server Error",
      Error: err.message,
    });
  }
};

module.exports = {
  getRecommendations,
  favGames,
};
