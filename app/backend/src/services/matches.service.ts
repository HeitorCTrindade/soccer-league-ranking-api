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
      console.log('---->: '+'getAllMatches');
    return allMatches;
  }

  public async getAllMatchesInProgress() {
    const matches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
      where: { inProgress: true } });
    console.log('---->: '+'getAllMatchesInProgress');
    return matches;
  }

  public async getAllClosedMatches() {
    const matches = await this.matchesModel.findAll({
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
      where: { inProgress: false } });
    console.log('getAllClosedMatches');
    return matches;
  }
}
