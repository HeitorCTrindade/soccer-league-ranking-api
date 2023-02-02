import { RequestHandler } from 'express';
import LeaderboardService from '../services/leaderboard.service';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  getLeaderboard: RequestHandler = async (_req, res) => {
    const leaderboard = await this.leaderboardService.getLeaderboard();
    console.log(leaderboard);
    return res.status(200).json(leaderboard);
  };

  getLeaderboardPlayingAtHome: RequestHandler = async (_req, res) => {
    const leaderboard = await this.leaderboardService.getLeaderboardPlayingAtHome();
    console.log(leaderboard);
    return res.status(200).json(leaderboard);
  };

  getLeaderboardPlayingAtAway: RequestHandler = async (_req, res) => {
    const leaderboard = await this.leaderboardService.getLeaderboardPlayingAtAway();
    console.log(leaderboard);
    return res.status(200).json(leaderboard);
  };
}
