import { Router } from 'express';
import MatchesController from '../controllers/matches.controller';

const matchesRoutes = Router();

const matchesController = new MatchesController();

matchesRoutes.get('/matches', matchesController.getAllMatches);
matchesRoutes.patch('/matches/:id/finish', matchesController.finishMatch);
matchesRoutes.patch('/matches/:id', matchesController.updateMatch);
matchesRoutes.post(
  '/matches',
  matchesController.validateToken,
  matchesController.validateNewMatch,
  matchesController.createNewMatch,
);

export default matchesRoutes;
