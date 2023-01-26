import MatchesModel from '../database/models/Matches';
// import TeamsModel from '../database/models/Teams';

export default class serviceMatches {
  constructor(private matchesModel = MatchesModel) {}

  public async getAllMatches() {
    const allTeams = await this.matchesModel.findAll({
      include: [
        { model: Teams, as: 'teamName', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'teamName', attributes: { exclude: ['id'] } },
      ] });
    console.log(allTeams);
    return allTeams;
  }
}
