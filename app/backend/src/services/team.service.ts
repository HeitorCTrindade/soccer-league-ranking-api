import TeamsModel from '../database/models/Teams';

export default class serviceTeam {
  constructor(private teamModel = TeamsModel) {}

  public async getAllTeams() {
    const allTeams = await this.teamModel.findAll();
    return allTeams;
  }

  public async getTeamById(id: number) {
    const team = await this.teamModel.findByPk(id);
    return team;
  }
}
