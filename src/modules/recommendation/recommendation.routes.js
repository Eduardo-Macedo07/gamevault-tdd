import { Router } from 'express';
import * as recommendationController from './recommendation.controller.js';

const router = Router();

router.post('/profiles', recommendationController.createProfile);
router.put('/profiles/:userId', recommendationController.updateProfile);
router.get('/profiles/:userId/recommendations', recommendationController.getRecommendations);
router.post('/saved', recommendationController.saveRecommendation);
router.get('/users/:userId/saved', recommendationController.listSavedRecommendations);
router.delete('/users/:userId/saved/:gameId', recommendationController.removeSavedRecommendation);

export default router;
