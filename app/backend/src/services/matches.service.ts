import { where } from 'sequelize';
import MatchesModel from '../database/models/Matches';
import TeamsModel from '../database/models/Teams';

export default class serviceMatches {
  constructor(private matchesModel = MatchesModel) {}

  public async getAllMatches() {
    const allMatches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ] });
    console.log(allMatches);
    return allMatches;
  }

  public async getAllMatchesInProgress() {
    const matches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
      where: { inProgress: true } });
    console.log(matches);
    return matches;
  }

  public async getAllClosedMatches() {
    const matches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
      where: { inProgress: false } });
    console.log(matches);
    return matches;
  }
}
