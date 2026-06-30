import GameModel from './game.model.js';

const MIN_SCORE = 1;
const MAX_SCORE = 5;

const isBlank = (value) => typeof value !== 'string' || value.trim().length === 0;

const assertPositiveId = (value, fieldName) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} deve ser um inteiro positivo.`);
  }
};

export const normalizeGamePayload = (data) => ({
  userId: data.userId,
  gameId: data.gameId,
  title: typeof data.title === 'string' ? data.title.trim() : data.title,
  platform: typeof data.platform === 'string' ? data.platform.trim() : data.platform,
  genre: typeof data.genre === 'string' ? data.genre.trim() : data.genre
});

export const validateGameData = (data) => {
  if (!data || typeof data !== 'object') throw new Error('Dados do jogo sao obrigatorios.');

  const game = normalizeGamePayload(data);
  assertPositiveId(game.userId, 'userId');
  assertPositiveId(game.gameId, 'gameId');
  if (isBlank(game.title)) throw new Error('Titulo do jogo e obrigatorio.');
  if (isBlank(game.platform)) throw new Error('Plataforma do jogo e obrigatoria.');

  return game;
};

export const validateScore = (score) => {
  if (!Number.isInteger(score) || score < MIN_SCORE || score > MAX_SCORE) {
    throw new Error('A nota deve ser um inteiro entre 1 e 5.');
  }
};

export const addFavorite = async (data, model = GameModel) => {
  const game = validateGameData(data);
  const existingFavorite = await model.findFavorite({ userId: game.userId, gameId: game.gameId });
  if (existingFavorite) throw new Error('Jogo ja esta nos favoritos.');

  const favorite = await model.createFavorite(game);
  return {
    message: 'Jogo adicionado aos favoritos com sucesso!',
    favorite
  };
};

export const removeFavorite = async ({ userId, gameId }, model = GameModel) => {
  assertPositiveId(userId, 'userId');
  assertPositiveId(gameId, 'gameId');

  const removedCount = await model.deleteFavorite({ userId, gameId });
  if (!removedCount) throw new Error('Jogo favorito nao encontrado.');

  return { message: 'Jogo removido dos favoritos com sucesso!' };
};

export const listFavorites = async (userId, model = GameModel) => {
  assertPositiveId(userId, 'userId');
  return model.listFavoritesByUser(userId);
};

export const rateGame = async (data, model = GameModel) => {
  const game = validateGameData(data);
  validateScore(data.score);

  const existingRating = await model.findRating({ userId: game.userId, gameId: game.gameId });
  if (existingRating) throw new Error('Jogo ja avaliado por este usuario.');

  const rating = await model.createRating({
    ...game,
    score: data.score,
    comment: typeof data.comment === 'string' ? data.comment.trim() : data.comment
  });

  return {
    message: 'Avaliacao registrada com sucesso!',
    rating
  };
};

export const updateRating = async ({ userId, gameId, score, comment }, model = GameModel) => {
  assertPositiveId(userId, 'userId');
  assertPositiveId(gameId, 'gameId');
  validateScore(score);

  const updatedRating = await model.updateRating(
    { userId, gameId },
    { score, comment: typeof comment === 'string' ? comment.trim() : comment }
  );
  if (!updatedRating) throw new Error('Avaliacao nao encontrada.');

  return {
    message: 'Avaliacao atualizada com sucesso!',
    rating: updatedRating
  };
};

export const getAverageRating = async (gameId, model = GameModel) => {
  assertPositiveId(gameId, 'gameId');
  const ratings = await model.listRatingsByGame(gameId);
  if (ratings.length === 0) {
    return { gameId, average: 0, ratingsCount: 0 };
  }

  const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
  return {
    gameId,
    average: Number((total / ratings.length).toFixed(2)),
    ratingsCount: ratings.length
  };
};

export const getTopRatedGames = async (limit = 5, model = GameModel) => {
  if (!Number.isInteger(limit) || limit <= 0) throw new Error('Limite deve ser um inteiro positivo.');
  return model.listTopRated(limit);
};
