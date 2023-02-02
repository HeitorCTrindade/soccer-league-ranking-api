import teamRankObj from '../interfaces/TeamRanking';
import MatchesService from './matches.service';
import MatchesModel from '../database/models/Matches';
import TeamService from './team.service';

export default class Leaderboard {
  private teamRanking :teamRankObj[] = [];

  constructor(private sM = new MatchesService(), private tS = new TeamService()) {
    // this.leaderboardUpdate();
  }

  private async leaderboardUpdate() {
    this.teamRanking = [];
    await this.fillLeaderboard();
    await this.updateLeaderboardHome();
    this.fillStats();
    this.sortLeaderBoard();
  }

  public async fillLeaderboard() {
    const allteams = await this.tS.getAllTeams();
    allteams.forEach((team) => {
      const newteamRankObj:teamRankObj = {
        id: team.id,
        name: team.teamName,
        totalPoints: 0,
        totalGames: 0,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
        goalsBalance: 0,
        efficiency: '0.00',
      };
      this.teamRanking.push(newteamRankObj);
    });
  }

  private static whoWinOrDraw(match: MatchesModel, hT: teamRankObj, aT: teamRankObj) {
    const homeT = hT;
    const awayT = aT;
    if (match.homeTeamGoals > match.awayTeamGoals) {
      homeT.totalPoints += 3;
      homeT.totalVictories += 1;
      awayT.totalLosses += 1;
    } else if (match.homeTeamGoals === match.awayTeamGoals) {
      homeT.totalPoints += 1;
      awayT.totalPoints += 1;
      homeT.totalDraws += 1;
      awayT.totalDraws += 1;
    } else {
      awayT.totalPoints += 3;
      awayT.totalVictories += 1;
      homeT.totalLosses += 1;
    }
  }

  public async updateLeaderboardHome() {
    const closedMatches = await this.sM.getAllClosedMatches();
    closedMatches.forEach((match) => {
      const hT = this.teamRanking.find((team) => team.id === match.homeTeamId) as teamRankObj;
      const aT = this.teamRanking.find((team) => team.id === match.awayTeamId) as teamRankObj;
      hT.totalGames += 1;
      aT.totalGames += 1;
      hT.goalsFavor += match.homeTeamGoals;
      hT.goalsOwn += match.awayTeamGoals;
      aT.goalsFavor += match.awayTeamGoals;
      aT.goalsOwn += match.homeTeamGoals;
      Leaderboard.whoWinOrDraw(match, hT, aT);
    });
  }

  public fillStats() {
    this.teamRanking.forEach((team) => {
      const t = team;
      t.efficiency = ((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2);
      t.goalsBalance = team.goalsFavor - team.goalsOwn;
    });
  }

  private sortLeaderBoard() {
    this.teamRanking.sort((a, b) => {
      if (a.totalPoints === b.totalPoints) {
        if (a.totalVictories === b.totalVictories) {
          if (a.goalsBalance === b.goalsBalance) {
            if (a.goalsFavor === b.goalsFavor) {
              return a.goalsOwn - b.goalsOwn;
            }
            return b.goalsFavor - a.goalsFavor;
          }
          return b.goalsBalance - a.goalsBalance;
        }
        return b.totalVictories - a.totalVictories;
      }
      return a.totalPoints < b.totalPoints ? 1 : -1;
    });
  }

  public async getLeaderboard() {
    await this.leaderboardUpdate();
    return this.teamRanking.map((teamRank) => {
      const { id, ...formatedRank } = teamRank;
      return formatedRank;
    });
  }

  public async getLeaderboardPlayingAtHome() {
    // await this.leaderboardUpdate();
    // return this.teamRanking.map((teamRank) => {
    //   const { id, ...formatedRank } = teamRank;
    //   return formatedRank;
    // });
    return this.teamRanking;
  }

  public async getLeaderboardPlayingAtAway() {
    // await this.leaderboardUpdate();
    // return this.teamRanking.map((teamRank) => {
    //   const { id, ...formatedRank } = teamRank;
    //   return formatedRank;
    // });
    return this.teamRanking;
  }
}
