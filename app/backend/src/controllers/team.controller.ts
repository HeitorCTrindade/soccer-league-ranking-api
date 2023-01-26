import { RequestHandler } from 'express';
import TeamService from '../services/team.service';

export default class LoginController {
  constructor(private teamsLogin = new TeamService()) {}

  getAllTeams: RequestHandler = async (_req, res) => {
    const teams = await this.teamsLogin.getAllTeams();

    return res.status(200).json(teams);
  };

  getTeamById: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const team = await this.teamsLogin.getTeamById(+id);

    return res.status(200).json(team);
  };
}
