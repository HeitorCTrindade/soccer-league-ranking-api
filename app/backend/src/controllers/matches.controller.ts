import { RequestHandler } from 'express';
import MatchesService from '../services/matches.service';

export default class MactchesController {
  constructor(private matchesService = new MatchesService()) {}

  getAllMatches: RequestHandler = async (req, res) => {
    const { inProgress } = req.query;

    if (inProgress === undefined) {
      const matches = await this.matchesService.getAllMatches();
      return res.status(200).json(matches);
    }

    const isInProgress:boolean = JSON.parse(inProgress as string);

    if (isInProgress === true) {
      const matches = await this.matchesService.getAllMatchesInProgress();
      return res.status(200).json(matches);
    }

    const allMatches = await this.matchesService.getAllClosedMatches();
    return res.status(200).json(allMatches);
  };
}
