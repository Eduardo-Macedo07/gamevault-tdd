const profiles = [];
const savedRecommendations = [];

const catalogGames = [
  { gameId: 1, title: 'Hades', genre: 'Roguelike', platform: 'PC', score: 4.9 },
  { gameId: 2, title: 'Forza Horizon 5', genre: 'Corrida', platform: 'Xbox', score: 4.7 },
  { gameId: 3, title: 'Zelda Tears of the Kingdom', genre: 'Aventura', platform: 'Switch', score: 4.9 },
  { gameId: 4, title: 'Stardew Valley', genre: 'Simulacao', platform: 'PC', score: 4.8 },
  { gameId: 5, title: 'Celeste', genre: 'Plataforma', platform: 'PC', score: 4.6 }
];

export const resetStore = () => {
  profiles.length = 0;
  savedRecommendations.length = 0;
};

export const findProfileByUserId = async (userId) =>
  profiles.find((profile) => profile.userId === userId) || null;

export const createProfile = async (profile) => {
  const created = { id: profiles.length + 1, ...profile };
  profiles.push(created);
  return created;
};

export const updateProfile = async (userId, changes) => {
  const profile = await findProfileByUserId(userId);
  if (!profile) return null;
  Object.assign(profile, changes);
  return profile;
};

export const listCatalogGames = async () => [...catalogGames];

export const findSavedRecommendation = async ({ userId, gameId }) =>
  savedRecommendations.find((item) => item.userId === userId && item.gameId === gameId) || null;

export const createSavedRecommendation = async (recommendation) => {
  const created = { id: savedRecommendations.length + 1, ...recommendation };
  savedRecommendations.push(created);
  return created;
};

export const listSavedRecommendations = async (userId) =>
  savedRecommendations.filter((item) => item.userId === userId);

export const deleteSavedRecommendation = async ({ userId, gameId }) => {
  const index = savedRecommendations.findIndex((item) => item.userId === userId && item.gameId === gameId);
  if (index === -1) return 0;
  savedRecommendations.splice(index, 1);
  return 1;
};

export default {
  resetStore,
  findProfileByUserId,
  createProfile,
  updateProfile,
  listCatalogGames,
  findSavedRecommendation,
  createSavedRecommendation,
  listSavedRecommendations,
  deleteSavedRecommendation
};
