const favorites = [];
const ratings = [];

const nextFavoriteId = () => favorites.length + 1;
const nextRatingId = () => ratings.length + 1;

export const resetStore = () => {
  favorites.length = 0;
  ratings.length = 0;
};

export const findFavorite = async ({ userId, gameId }) =>
  favorites.find((favorite) => favorite.userId === userId && favorite.gameId === gameId) || null;

export const createFavorite = async (favorite) => {
  const created = {
    id: nextFavoriteId(),
    userId: favorite.userId,
    gameId: favorite.gameId,
    title: favorite.title,
    platform: favorite.platform,
    genre: favorite.genre ?? null
  };
  favorites.push(created);
  return created;
};

export const deleteFavorite = async ({ userId, gameId }) => {
  const index = favorites.findIndex((favorite) => favorite.userId === userId && favorite.gameId === gameId);
  if (index === -1) return 0;
  favorites.splice(index, 1);
  return 1;
};

export const listFavoritesByUser = async (userId) =>
  favorites.filter((favorite) => favorite.userId === userId);

export const findRating = async ({ userId, gameId }) =>
  ratings.find((rating) => rating.userId === userId && rating.gameId === gameId) || null;

export const createRating = async (rating) => {
  const created = {
    id: nextRatingId(),
    userId: rating.userId,
    gameId: rating.gameId,
    title: rating.title,
    score: rating.score,
    comment: rating.comment ?? null
  };
  ratings.push(created);
  return created;
};

export const updateRating = async ({ userId, gameId }, changes) => {
  const rating = await findRating({ userId, gameId });
  if (!rating) return null;
  Object.assign(rating, changes);
  return rating;
};

export const listRatingsByGame = async (gameId) =>
  ratings.filter((rating) => rating.gameId === gameId);

export const listTopRated = async (limit = 5) => {
  const grouped = ratings.reduce((acc, rating) => {
    const current = acc.get(rating.gameId) ?? {
      gameId: rating.gameId,
      title: rating.title,
      total: 0,
      count: 0
    };
    current.total += rating.score;
    current.count += 1;
    acc.set(rating.gameId, current);
    return acc;
  }, new Map());

  return Array.from(grouped.values())
    .map((game) => ({
      gameId: game.gameId,
      title: game.title,
      average: Number((game.total / game.count).toFixed(2)),
      ratingsCount: game.count
    }))
    .sort((a, b) => b.average - a.average || b.ratingsCount - a.ratingsCount)
    .slice(0, limit);
};

export default {
  resetStore,
  findFavorite,
  createFavorite,
  deleteFavorite,
  listFavoritesByUser,
  findRating,
  createRating,
  updateRating,
  listRatingsByGame,
  listTopRated
};
