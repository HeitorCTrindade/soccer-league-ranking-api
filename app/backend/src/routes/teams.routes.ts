import { Router } from 'express';
import TeamController from '../controllers/team.controller';

const teamsRoutes = Router();

// teamsRoutes.get('/teams', teamController.getAllTeams);
// teamsRoutes.get('/teams/:id', teamController.getTeamById);

teamsRoutes.get(
  '/teams',
  (req, res, next) => new TeamController(req, res, next).getAllTeams(),
);

teamsRoutes.get(
  '/teams/:id',
  (req, res, next) => new TeamController(req, res, next).getTeamById(),
);

export default teamsRoutes;
