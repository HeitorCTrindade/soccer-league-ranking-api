import { NextFunction, Response, Request } from 'express';
import TeamService from '../services/team.service';

export default class TeamController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: TeamService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new TeamService();
  }

  getAllTeams = async () => {
    const teams = await this.service.getAllTeams();

    return this.res.status(200).json(teams);
  };

  getTeamById = async () => {
    const { id } = this.req.params;

    const team = await this.service.getTeamById(+id);

    return this.res.status(200).json(team);
  };
}
