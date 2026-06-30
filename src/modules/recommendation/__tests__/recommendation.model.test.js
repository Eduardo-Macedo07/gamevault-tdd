import { beforeEach, describe, expect, it } from 'vitest';
import * as RecommendationModel from '../recommendation.model.js';

describe('Recommendation Model - unitarios N3', () => {
  beforeEach(() => {
    RecommendationModel.resetStore();
  });

  it('T12 - cria e busca perfil por usuario', async () => {
    await RecommendationModel.createProfile({ userId: 1, favoriteGenres: ['RPG'], platforms: ['PC'], minScore: 4 });

    const profile = await RecommendationModel.findProfileByUserId(1);

    expect(profile).toHaveProperty('id', 1);
    expect(profile.favoriteGenres).toEqual(['RPG']);
  });

  it('T13 - remove recomendacao salva existente', async () => {
    await RecommendationModel.createSavedRecommendation({ userId: 1, gameId: 10, title: 'Hades' });

    await expect(RecommendationModel.deleteSavedRecommendation({ userId: 1, gameId: 10 })).resolves.toBe(1);
    await expect(RecommendationModel.listSavedRecommendations(1)).resolves.toEqual([]);
  });
});
