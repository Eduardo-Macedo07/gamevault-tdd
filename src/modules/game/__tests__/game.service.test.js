import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as gameService from '../game.service.js';
import GameModel from '../game.model.js';

vi.mock('../game.model.js', () => ({
  default: {
    findFavorite: vi.fn(),
    createFavorite: vi.fn(),
    deleteFavorite: vi.fn(),
    listFavoritesByUser: vi.fn(),
    findRating: vi.fn(),
    createRating: vi.fn(),
    updateRating: vi.fn(),
    listRatingsByGame: vi.fn(),
    listTopRated: vi.fn()
  }
}));

describe('Game Service', () => {
  const validGame = {
    userId: 1,
    gameId: 10,
    title: 'Hades',
    platform: 'PC',
    genre: 'Roguelike'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve adicionar jogo aos favoritos com sucesso', async () => {
    const createdFavorite = { id: 1, ...validGame };
    GameModel.findFavorite.mockResolvedValueOnce(null);
    GameModel.createFavorite.mockResolvedValueOnce(createdFavorite);

    const result = await gameService.addFavorite(validGame);

    expect(GameModel.findFavorite).toHaveBeenCalledWith({ userId: 1, gameId: 10 });
    expect(GameModel.createFavorite).toHaveBeenCalledWith(validGame);
    expect(result).toEqual({
      message: 'Jogo adicionado aos favoritos com sucesso!',
      favorite: createdFavorite
    });
  });

  it('deve impedir favorito duplicado', async () => {
    GameModel.findFavorite.mockResolvedValueOnce({ id: 1, ...validGame });

    await expect(gameService.addFavorite(validGame)).rejects.toThrow('Jogo ja esta nos favoritos.');
    expect(GameModel.createFavorite).not.toHaveBeenCalled();
  });

  it('deve validar titulo obrigatorio ao favoritar', async () => {
    await expect(gameService.addFavorite({ ...validGame, title: '  ' })).rejects.toThrow(
      'Titulo do jogo e obrigatorio.'
    );
    expect(GameModel.findFavorite).not.toHaveBeenCalled();
  });

  it('deve validar plataforma obrigatoria ao favoritar', async () => {
    await expect(gameService.addFavorite({ ...validGame, platform: '' })).rejects.toThrow(
      'Plataforma do jogo e obrigatoria.'
    );
  });

  it('deve validar userId positivo', async () => {
    await expect(gameService.addFavorite({ ...validGame, userId: 0 })).rejects.toThrow(
      'userId deve ser um inteiro positivo.'
    );
  });

  it('deve remover favorito com sucesso', async () => {
    GameModel.deleteFavorite.mockResolvedValueOnce(1);

    const result = await gameService.removeFavorite({ userId: 1, gameId: 10 });

    expect(GameModel.deleteFavorite).toHaveBeenCalledWith({ userId: 1, gameId: 10 });
    expect(result).toEqual({ message: 'Jogo removido dos favoritos com sucesso!' });
  });

  it('deve falhar ao remover favorito inexistente', async () => {
    GameModel.deleteFavorite.mockResolvedValueOnce(0);

    await expect(gameService.removeFavorite({ userId: 1, gameId: 10 })).rejects.toThrow(
      'Jogo favorito nao encontrado.'
    );
  });

  it('deve listar favoritos do usuario', async () => {
    const favorites = [{ id: 1, ...validGame }];
    GameModel.listFavoritesByUser.mockResolvedValueOnce(favorites);

    const result = await gameService.listFavorites(1);

    expect(GameModel.listFavoritesByUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(favorites);
  });

  it('deve registrar avaliacao com sucesso', async () => {
    const createdRating = { id: 1, ...validGame, score: 5, comment: 'Excelente' };
    GameModel.findRating.mockResolvedValueOnce(null);
    GameModel.createRating.mockResolvedValueOnce(createdRating);

    const result = await gameService.rateGame({ ...validGame, score: 5, comment: ' Excelente ' });

    expect(GameModel.createRating).toHaveBeenCalledWith({ ...validGame, score: 5, comment: 'Excelente' });
    expect(result.rating).toEqual(createdRating);
    expect(result.message).toBe('Avaliacao registrada com sucesso!');
  });

  it('deve impedir avaliacao duplicada por usuario e jogo', async () => {
    GameModel.findRating.mockResolvedValueOnce({ id: 1, userId: 1, gameId: 10, score: 4 });

    await expect(gameService.rateGame({ ...validGame, score: 4 })).rejects.toThrow(
      'Jogo ja avaliado por este usuario.'
    );
    expect(GameModel.createRating).not.toHaveBeenCalled();
  });

  it('deve validar nota menor que o minimo', async () => {
    await expect(gameService.rateGame({ ...validGame, score: 0 })).rejects.toThrow(
      'A nota deve ser um inteiro entre 1 e 5.'
    );
  });

  it('deve validar nota maior que o maximo', async () => {
    await expect(gameService.rateGame({ ...validGame, score: 6 })).rejects.toThrow(
      'A nota deve ser um inteiro entre 1 e 5.'
    );
  });

  it('deve atualizar avaliacao existente usando spyOn', async () => {
    const updatedRating = { id: 1, userId: 1, gameId: 10, score: 3, comment: 'Bom' };
    const updateSpy = vi.spyOn(GameModel, 'updateRating').mockResolvedValueOnce(updatedRating);

    const result = await gameService.updateRating({ userId: 1, gameId: 10, score: 3, comment: ' Bom ' });

    expect(updateSpy).toHaveBeenCalledWith({ userId: 1, gameId: 10 }, { score: 3, comment: 'Bom' });
    expect(result).toEqual({
      message: 'Avaliacao atualizada com sucesso!',
      rating: updatedRating
    });
  });

  it('deve falhar ao atualizar avaliacao inexistente', async () => {
    GameModel.updateRating.mockResolvedValueOnce(null);

    await expect(gameService.updateRating({ userId: 1, gameId: 10, score: 4 })).rejects.toThrow(
      'Avaliacao nao encontrada.'
    );
  });

  it('deve calcular media das avaliacoes de um jogo', async () => {
    GameModel.listRatingsByGame.mockResolvedValueOnce([
      { gameId: 10, score: 5 },
      { gameId: 10, score: 4 },
      { gameId: 10, score: 3 }
    ]);

    const result = await gameService.getAverageRating(10);

    expect(GameModel.listRatingsByGame).toHaveBeenCalledWith(10);
    expect(result).toEqual({ gameId: 10, average: 4, ratingsCount: 3 });
  });

  it('deve retornar media zero quando jogo nao possui avaliacoes', async () => {
    GameModel.listRatingsByGame.mockResolvedValueOnce([]);

    await expect(gameService.getAverageRating(10)).resolves.toEqual({
      gameId: 10,
      average: 0,
      ratingsCount: 0
    });
  });

  it('deve listar jogos mais bem avaliados respeitando limite', async () => {
    const topGames = [{ gameId: 10, title: 'Hades', average: 4.8, ratingsCount: 5 }];
    GameModel.listTopRated.mockResolvedValueOnce(topGames);

    const result = await gameService.getTopRatedGames(3);

    expect(GameModel.listTopRated).toHaveBeenCalledWith(3);
    expect(result).toEqual(topGames);
  });

  it('deve validar limite de ranking positivo', async () => {
    await expect(gameService.getTopRatedGames(0)).rejects.toThrow('Limite deve ser um inteiro positivo.');
  });
});
