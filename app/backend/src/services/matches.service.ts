import MatchesModel from '../database/models/Matches';
import TeamsModel from '../database/models/Teams';

export default class serviceMatches {
  constructor(private matchesModel = MatchesModel) {}

  public async getAllMatches() {
    const allTeams = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ] });
    console.log(allTeams);
    return allTeams;
  }
}
