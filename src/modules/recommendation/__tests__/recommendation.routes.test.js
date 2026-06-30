import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../../app.js';
import * as recommendationService from '../recommendation.service.js';

vi.mock('../recommendation.service.js', () => ({
  createPreferenceProfile: vi.fn(),
  updatePreferenceProfile: vi.fn(),
  getRecommendations: vi.fn(),
  saveRecommendation: vi.fn(),
  listSavedRecommendations: vi.fn(),
  removeSavedRecommendation: vi.fn()
}));

describe('Recommendation Routes - integracao HTTP N3', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('I1 - POST /profiles cria perfil com 201', async () => {
    recommendationService.createPreferenceProfile.mockResolvedValueOnce({ message: 'criado', profile: { id: 1 } });

    const response = await request(app).post('/api/recommendations/profiles').send({ userId: 1 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('profile');
  });

  it('I2 - POST /profiles retorna 400 em validacao', async () => {
    recommendationService.createPreferenceProfile.mockRejectedValueOnce(new Error('Generos favoritos deve conter ao menos um item.'));

    const response = await request(app).post('/api/recommendations/profiles').send({ userId: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Generos favoritos deve conter ao menos um item.');
  });

  it('I3 - PUT /profiles/:userId atualiza perfil', async () => {
    recommendationService.updatePreferenceProfile.mockResolvedValueOnce({ message: 'atualizado', profile: { userId: 1 } });

    const response = await request(app).put('/api/recommendations/profiles/1').send({ minScore: 4 });

    expect(response.status).toBe(200);
    expect(recommendationService.updatePreferenceProfile).toHaveBeenCalledWith(1, { minScore: 4 });
  });

  it('I4 - PUT /profiles/:userId retorna 404 quando perfil nao existe', async () => {
    recommendationService.updatePreferenceProfile.mockRejectedValueOnce(new Error('Perfil de recomendacao nao encontrado.'));

    const response = await request(app).put('/api/recommendations/profiles/404').send({ minScore: 4 });

    expect(response.status).toBe(404);
  });

  it('I5 - GET /profiles/:userId/recommendations lista recomendacoes', async () => {
    recommendationService.getRecommendations.mockResolvedValueOnce([{ gameId: 1, title: 'Hades' }]);

    const response = await request(app).get('/api/recommendations/profiles/1/recommendations?limit=2');

    expect(response.status).toBe(200);
    expect(response.body.recommendations).toHaveLength(1);
    expect(recommendationService.getRecommendations).toHaveBeenCalledWith(1, 2);
  });

  it('I6 - GET /profiles/:userId/recommendations retorna 400 para limite invalido', async () => {
    recommendationService.getRecommendations.mockRejectedValueOnce(new Error('Limite deve ser um inteiro positivo.'));

    const response = await request(app).get('/api/recommendations/profiles/1/recommendations?limit=0');

    expect(response.status).toBe(400);
  });

  it('I7 - POST /saved salva recomendacao', async () => {
    recommendationService.saveRecommendation.mockResolvedValueOnce({ message: 'salva', recommendation: { id: 1 } });

    const response = await request(app).post('/api/recommendations/saved').send({ userId: 1, gameId: 10, title: 'Hades' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('recommendation');
  });

  it('I8 - POST /saved retorna 400 para duplicidade', async () => {
    recommendationService.saveRecommendation.mockRejectedValueOnce(new Error('Recomendacao ja foi salva por este usuario.'));

    const response = await request(app).post('/api/recommendations/saved').send({ userId: 1, gameId: 10, title: 'Hades' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Recomendacao ja foi salva por este usuario.');
  });

  it('I9 - GET /users/:userId/saved lista salvas', async () => {
    recommendationService.listSavedRecommendations.mockResolvedValueOnce([{ id: 1, title: 'Hades' }]);

    const response = await request(app).get('/api/recommendations/users/1/saved');

    expect(response.status).toBe(200);
    expect(response.body.recommendations[0]).toHaveProperty('title', 'Hades');
  });

  it('I10 - DELETE /users/:userId/saved/:gameId remove salva', async () => {
    recommendationService.removeSavedRecommendation.mockResolvedValueOnce({ message: 'removida' });

    const response = await request(app).delete('/api/recommendations/users/1/saved/10');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('removida');
  });

  it('I11 - DELETE /users/:userId/saved/:gameId retorna 404 quando nao existe', async () => {
    recommendationService.removeSavedRecommendation.mockRejectedValueOnce(new Error('Recomendacao salva nao encontrada.'));

    const response = await request(app).delete('/api/recommendations/users/1/saved/10');

    expect(response.status).toBe(404);
  });
});
