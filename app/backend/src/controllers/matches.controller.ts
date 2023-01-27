import { RequestHandler } from 'express';
import MatchesService from '../services/matches.service';

export default class MactchesController {
  constructor(private matchesService = new MatchesService()) {}

  getAllMatches: RequestHandler = async (req, res) => {
    const { inProgress } = req.query;

    if (!inProgress) {
      const matches = await this.matchesService.getAllMatches();
      return res.status(200).json(matches);
    }

    if (inProgress) {
      const matches = await this.matchesService.getAllMatchesInProgress();
      return res.status(200).json(matches);
    }

    const matches = await this.matchesService.getAllClosedMatches();
    return res.status(200).json(matches);
  };
}
