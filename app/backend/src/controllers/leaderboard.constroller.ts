import { RequestHandler } from 'express';
import LeaderboardService from '../services/leaderboard.service';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  getLeaderboardHome: RequestHandler = async (_req, res) => {
    const leaderboard = this.leaderboardService.getLeaderboard();
    return res.status(200).json({ leaderboard });
  };
}
