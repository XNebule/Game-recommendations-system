const buildUserProfile = (preferences, vectors) => {
  const profile = {};

  preferences.forEach((pref) => {
    const gameVector = vectors.find(
      (v) => Number(v.id) === Number(pref.gameId),
    );

    console.log("PREF:", pref.gameId);
    console.log("FOUND:", gameVector ? "YES" : "NO");

    if (!gameVector) return;

    for (let key in gameVector.vector) {
      profile[key] = (profile[key] || 0) + gameVector.vector[key];
    }
  });

  return profile;
}

module.exports = buildUserProfile;
