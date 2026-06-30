import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as recommendationController from '../recommendation.controller.js';
import * as recommendationService from '../recommendation.service.js';

vi.mock('../recommendation.service.js', () => ({
  createPreferenceProfile: vi.fn(),
  updatePreferenceProfile: vi.fn(),
  getRecommendations: vi.fn(),
  saveRecommendation: vi.fn(),
  listSavedRecommendations: vi.fn(),
  removeSavedRecommendation: vi.fn()
}));

describe('Recommendation Controller - unitarios N3', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('T14 - createProfile retorna status 201', async () => {
    recommendationService.createPreferenceProfile.mockResolvedValueOnce({ message: 'ok', profile: { id: 1 } });
    const req = { body: { userId: 1 } };
    const res = mockRes();

    await recommendationController.createProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'ok', profile: { id: 1 } });
  });

  it('T15 - getRecommendations retorna erro 404 quando service informa nao encontrado', async () => {
    recommendationService.getRecommendations.mockRejectedValueOnce(new Error('Perfil de recomendacao nao encontrado.'));
    const req = { params: { userId: '1' }, query: {} };
    const res = mockRes();

    await recommendationController.getRecommendations(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Perfil de recomendacao nao encontrado.' });
  });
});
