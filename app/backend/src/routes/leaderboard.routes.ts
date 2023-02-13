import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const leaderboardRoutes = Router();

const leaderBoardController = new LeaderboardController();

leaderboardRoutes.get('/leaderboard/home', leaderBoardController.getLeaderboardPlayingAtHome);
leaderboardRoutes.get('/leaderboard/away', leaderBoardController.getLeaderboardPlayingAtAway);
leaderboardRoutes.get('/leaderboard', leaderBoardController.getLeaderboard);

export default leaderboardRoutes;
