import { RequestHandler } from 'express';
import MatchesService from '../services/matches.service';

export default class MactchesController {
  constructor(private matchesService = new MatchesService()) {}

  getAllMatches: RequestHandler = async (_req, res) => {
    const matches = await this.matchesService.getAllMatches();

    return res.status(200).json(matches);
  };
}
