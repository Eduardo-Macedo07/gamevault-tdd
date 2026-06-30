import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as recommendationService from '../recommendation.service.js';
import RecommendationModel from '../recommendation.model.js';

const modelMock = vi.hoisted(() => ({
  findProfileByUserId: vi.fn(),
  createProfile: vi.fn(),
  updateProfile: vi.fn(),
  listCatalogGames: vi.fn(),
  findSavedRecommendation: vi.fn(),
  createSavedRecommendation: vi.fn(),
  listSavedRecommendations: vi.fn(),
  deleteSavedRecommendation: vi.fn()
}));

vi.mock('../recommendation.model.js', () => ({ default: modelMock }));

describe('Recommendation Service - unitarios N3', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('T1 - cria perfil de recomendacao com sucesso', async () => {
    const profile = { id: 1, userId: 1, favoriteGenres: ['RPG'], platforms: ['PC'], minScore: 4 };
    RecommendationModel.findProfileByUserId.mockResolvedValueOnce(null);
    RecommendationModel.createProfile.mockResolvedValueOnce(profile);

    const result = await recommendationService.createPreferenceProfile({
      userId: 1,
      favoriteGenres: [' RPG '],
      platforms: [' PC '],
      minScore: 4
    });

    expect(RecommendationModel.createProfile).toHaveBeenCalledWith({
      userId: 1,
      favoriteGenres: ['RPG'],
      platforms: ['PC'],
      minScore: 4
    });
    expect(result).toHaveProperty('profile', profile);
  });

  it('T2 - impede perfil duplicado', async () => {
    RecommendationModel.findProfileByUserId.mockResolvedValueOnce({ id: 1 });

    await expect(
      recommendationService.createPreferenceProfile({ userId: 1, favoriteGenres: ['RPG'], platforms: ['PC'] })
    ).rejects.toThrow('Perfil de recomendacao ja existe para este usuario.');
  });

  it('T3 - valida generos favoritos obrigatorios', async () => {
    RecommendationModel.findProfileByUserId.mockResolvedValueOnce(null);

    await expect(
      recommendationService.createPreferenceProfile({ userId: 1, favoriteGenres: [], platforms: ['PC'] })
    ).rejects.toThrow('Generos favoritos deve conter ao menos um item.');
  });

  it('T4 - valida nota minima entre 0 e 5', async () => {
    RecommendationModel.findProfileByUserId.mockResolvedValueOnce(null);

    await expect(
      recommendationService.createPreferenceProfile({
        userId: 1,
        favoriteGenres: ['RPG'],
        platforms: ['PC'],
        minScore: 9
      })
    ).rejects.toThrow('Nota minima deve ser um numero entre 0 e 5.');
  });

  it('T5 - atualiza perfil existente', async () => {
    const updated = { id: 1, userId: 1, favoriteGenres: ['Aventura'], platforms: ['Switch'], minScore: 4.5 };
    RecommendationModel.updateProfile.mockResolvedValueOnce(updated);

    const result = await recommendationService.updatePreferenceProfile(1, {
      favoriteGenres: ['Aventura'],
      platforms: ['Switch'],
      minScore: 4.5
    });

    expect(RecommendationModel.updateProfile).toHaveBeenCalledWith(1, {
      favoriteGenres: ['Aventura'],
      platforms: ['Switch'],
      minScore: 4.5
    });
    expect(result.profile).toBe(updated);
  });

  it('T6 - recomenda jogos filtrando genero, plataforma e nota', async () => {
    RecommendationModel.findProfileByUserId.mockResolvedValueOnce({
      userId: 1,
      favoriteGenres: ['RPG', 'Aventura'],
      platforms: ['PC'],
      minScore: 3
    });
    RecommendationModel.listCatalogGames.mockResolvedValueOnce([
      { gameId: 1, title: 'A', genre: 'RPG', platform: 'PC', score: 4.7 },
      { gameId: 2, title: 'B', genre: 'Corrida', platform: 'PC', score: 4.9 },
      { gameId: 3, title: 'C', genre: 'Aventura', platform: 'Switch', score: 4.9 },
      { gameId: 4, title: 'D', genre: 'RPG', platform: 'PC', score: 3.1 }
    ]);

    const result = await recommendationService.getRecommendations(1, 2);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('reason');
    expect(result.map((game) => game.gameId)).toEqual([1, 4]);
  });

  it('T7 - falha ao recomendar sem perfil', async () => {
    RecommendationModel.findProfileByUserId.mockResolvedValueOnce(null);

    await expect(recommendationService.getRecommendations(1)).rejects.toThrow(
      'Perfil de recomendacao nao encontrado.'
    );
  });

  it('T8 - salva recomendacao com sucesso usando spyOn', async () => {
    const createSpy = vi.spyOn(RecommendationModel, 'createSavedRecommendation').mockResolvedValueOnce({
      id: 1,
      userId: 1,
      gameId: 10,
      title: 'Hades',
      reason: 'Combina com Roguelike'
    });
    RecommendationModel.findSavedRecommendation.mockResolvedValueOnce(null);

    const result = await recommendationService.saveRecommendation({
      userId: 1,
      gameId: 10,
      title: ' Hades ',
      reason: 'Combina com Roguelike'
    });

    expect(createSpy).toHaveBeenCalledWith({
      userId: 1,
      gameId: 10,
      title: 'Hades',
      reason: 'Combina com Roguelike'
    });
    expect(result.message).toBe('Recomendacao salva com sucesso!');
  });

  it('T9 - impede recomendacao salva duplicada', async () => {
    RecommendationModel.findSavedRecommendation.mockResolvedValueOnce({ id: 1 });

    await expect(
      recommendationService.saveRecommendation({ userId: 1, gameId: 10, title: 'Hades' })
    ).rejects.toThrow('Recomendacao ja foi salva por este usuario.');
  });

  it('T10 - lista recomendacoes salvas', async () => {
    const saved = [{ id: 1, userId: 1, gameId: 10, title: 'Hades' }];
    RecommendationModel.listSavedRecommendations.mockResolvedValueOnce(saved);

    await expect(recommendationService.listSavedRecommendations(1)).resolves.toEqual(saved);
  });

  it('T11 - remove recomendacao salva', async () => {
    RecommendationModel.deleteSavedRecommendation.mockResolvedValueOnce(1);

    await expect(
      recommendationService.removeSavedRecommendation({ userId: 1, gameId: 10 })
    ).resolves.toEqual({ message: 'Recomendacao removida com sucesso!' });
  });
});
