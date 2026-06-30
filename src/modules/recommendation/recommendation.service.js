import RecommendationModel from './recommendation.model.js';

const DEFAULT_MIN_SCORE = 3;

const assertPositiveId = (value, fieldName) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} deve ser um inteiro positivo.`);
  }
};

const normalizeList = (values, fieldName) => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${fieldName} deve conter ao menos um item.`);
  }

  return values.map((value) => String(value).trim()).filter(Boolean);
};

const normalizeScore = (value = DEFAULT_MIN_SCORE) => {
  if (typeof value !== 'number' || value < 0 || value > 5) {
    throw new Error('Nota minima deve ser um numero entre 0 e 5.');
  }
  return value;
};

export const createPreferenceProfile = async (data, model = RecommendationModel) => {
  if (!data || typeof data !== 'object') throw new Error('Dados do perfil sao obrigatorios.');
  assertPositiveId(data.userId, 'userId');

  const existingProfile = await model.findProfileByUserId(data.userId);
  if (existingProfile) throw new Error('Perfil de recomendacao ja existe para este usuario.');

  const profile = await model.createProfile({
    userId: data.userId,
    favoriteGenres: normalizeList(data.favoriteGenres, 'Generos favoritos'),
    platforms: normalizeList(data.platforms, 'Plataformas'),
    minScore: normalizeScore(data.minScore)
  });

  return {
    message: 'Perfil de recomendacao criado com sucesso!',
    profile
  };
};

export const updatePreferenceProfile = async (userId, data, model = RecommendationModel) => {
  assertPositiveId(userId, 'userId');
  if (!data || typeof data !== 'object') throw new Error('Dados de atualizacao sao obrigatorios.');

  const changes = {};
  if (data.favoriteGenres !== undefined) {
    changes.favoriteGenres = normalizeList(data.favoriteGenres, 'Generos favoritos');
  }
  if (data.platforms !== undefined) {
    changes.platforms = normalizeList(data.platforms, 'Plataformas');
  }
  if (data.minScore !== undefined) {
    changes.minScore = normalizeScore(data.minScore);
  }

  const profile = await model.updateProfile(userId, changes);
  if (!profile) throw new Error('Perfil de recomendacao nao encontrado.');

  return {
    message: 'Perfil de recomendacao atualizado com sucesso!',
    profile
  };
};

export const getRecommendations = async (userId, limit = 5, model = RecommendationModel) => {
  assertPositiveId(userId, 'userId');
  if (!Number.isInteger(limit) || limit <= 0) throw new Error('Limite deve ser um inteiro positivo.');

  const profile = await model.findProfileByUserId(userId);
  if (!profile) throw new Error('Perfil de recomendacao nao encontrado.');

  const catalog = await model.listCatalogGames();
  const favoriteGenres = profile.favoriteGenres.map((genre) => genre.toLowerCase());
  const platforms = profile.platforms.map((platform) => platform.toLowerCase());

  return catalog
    .filter((game) => favoriteGenres.includes(game.genre.toLowerCase()))
    .filter((game) => platforms.includes(game.platform.toLowerCase()))
    .filter((game) => game.score >= profile.minScore)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((game) => ({
      ...game,
      reason: `Combina com ${game.genre} em ${game.platform}`
    }));
};

export const saveRecommendation = async (data, model = RecommendationModel) => {
  if (!data || typeof data !== 'object') throw new Error('Dados da recomendacao sao obrigatorios.');
  assertPositiveId(data.userId, 'userId');
  assertPositiveId(data.gameId, 'gameId');
  if (!data.title || String(data.title).trim().length === 0) throw new Error('Titulo do jogo e obrigatorio.');

  const existingRecommendation = await model.findSavedRecommendation({ userId: data.userId, gameId: data.gameId });
  if (existingRecommendation) throw new Error('Recomendacao ja foi salva por este usuario.');

  const recommendation = await model.createSavedRecommendation({
    userId: data.userId,
    gameId: data.gameId,
    title: String(data.title).trim(),
    reason: data.reason ? String(data.reason).trim() : null
  });

  return {
    message: 'Recomendacao salva com sucesso!',
    recommendation
  };
};

export const listSavedRecommendations = async (userId, model = RecommendationModel) => {
  assertPositiveId(userId, 'userId');
  return model.listSavedRecommendations(userId);
};

export const removeSavedRecommendation = async ({ userId, gameId }, model = RecommendationModel) => {
  assertPositiveId(userId, 'userId');
  assertPositiveId(gameId, 'gameId');

  const removedCount = await model.deleteSavedRecommendation({ userId, gameId });
  if (!removedCount) throw new Error('Recomendacao salva nao encontrada.');

  return { message: 'Recomendacao removida com sucesso!' };
};
