import * as recommendationService from './recommendation.service.js';

const sendError = (res, error) => {
  const status = error.message.includes('nao encontrad') ? 404 : 400;
  return res.status(status).json({ error: error.message });
};

export const createProfile = async (req, res) => {
  try {
    const result = await recommendationService.createPreferenceProfile(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const result = await recommendationService.updatePreferenceProfile(Number(req.params.userId), req.body);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const limit = req.query.limit === undefined ? 5 : Number(req.query.limit);
    const recommendations = await recommendationService.getRecommendations(Number(req.params.userId), limit);
    return res.status(200).json({ recommendations });
  } catch (error) {
    return sendError(res, error);
  }
};

export const saveRecommendation = async (req, res) => {
  try {
    const result = await recommendationService.saveRecommendation(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

export const listSavedRecommendations = async (req, res) => {
  try {
    const recommendations = await recommendationService.listSavedRecommendations(Number(req.params.userId));
    return res.status(200).json({ recommendations });
  } catch (error) {
    return sendError(res, error);
  }
};

export const removeSavedRecommendation = async (req, res) => {
  try {
    const result = await recommendationService.removeSavedRecommendation({
      userId: Number(req.params.userId),
      gameId: Number(req.params.gameId)
    });
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};
