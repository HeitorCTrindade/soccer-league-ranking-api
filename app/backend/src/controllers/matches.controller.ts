import { RequestHandler } from 'express';
import { INTEGER } from 'sequelize';
import JWT from '../helpers/JWT';
import MatchesService from '../services/matches.service';
import TeamService from '../services/team.service';

export default class MactchesController {
  constructor(
    private matchesService = new MatchesService(),
    private teamService = new TeamService(),
  ) {}

  getAllMatches: RequestHandler = async (req, res) => {
    const { inProgress } = req.query;

    if (inProgress === undefined) {
      const matches = await this.matchesService.getAllMatches();
      return res.status(200).json(matches);
    }

    const isInProgress: boolean = JSON.parse(inProgress as string);

    if (isInProgress === true) {
      const matches = await this.matchesService.getAllMatchesInProgress();
      return res.status(200).json(matches);
    }

    const allMatches = await this.matchesService.getAllClosedMatches();
    return res.status(200).json(allMatches);
  };

  createNewMatch: RequestHandler = async (req, res) => {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    const newMatch = { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals };

    console.log(newMatch);

    const isCreate = await this.matchesService.createNewMatch(newMatch);
    return res.status(201).json(isCreate);
  };

  validateNewMatch: RequestHandler = async (req, res, next) => {
    const { homeTeamId, awayTeamId } = req.body;
    
    console.log('hoT: -'+homeTeamId+'AwT: -'+awayTeamId);
    
    console.log(parseInt(homeTeamId, 10) === parseInt(awayTeamId, 10));

    if (parseInt(homeTeamId, 10) === parseInt(awayTeamId, 10)) {
      return res
        .status(422).json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const isHomeTeamRegistered = await this.teamService.getTeamById(+homeTeamId);
    const isAwayTeamRegistered = await this.teamService.getTeamById(+awayTeamId);

    console.log(isHomeTeamRegistered);
    console.log(isHomeTeamRegistered === null);

    if (isHomeTeamRegistered === null || isAwayTeamRegistered === null) {
      return res
        .status(404).json({ message: 'There is no team with such id!' });
    }

    next();
  };

  // criar um middleware de validação de token

  validateToken: RequestHandler = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(400).json({ message: 'Token not found' });
    }

    try {
      JWT.decodeToken(authorization);
      // req.body.roleUser = decodeToken;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  };
}
