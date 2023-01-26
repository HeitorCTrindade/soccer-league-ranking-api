import teamsModel from '../database/models/Teams';

export default class serviceTeam {
  constructor(private teamModel = teamsModel) {}

  public async getAllTeams() {
    const allTeams = await this.teamModel.findAll();
    return allTeams;
  }

  public async getTeamsById(id: number) {
    const team = await this.teamModel.findByPk(id);
    return team;
  }
}
