import teamRankObj from '../interfaces/TeamRanking';
import MatchesService from './matches.service';
import MatchesModel from '../database/models/Matches';
import TeamService from './team.service';

const df:teamRankObj = {
  id: 999,
  name: 'XABLAU',
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

const HOME = true;
const AWAY = false;

export default class Leaderboard {
  private teamRanking :teamRankObj[] = [];

  constructor(private sM = new MatchesService(), private tS = new TeamService()) {
    this.leaderboardUpdate();
  }

  private async leaderboardUpdate() {
    this.teamRanking = [];
    await this.fillLeaderboard();
    await this.updateLeaderboardHomeAway(HOME);
    await this.updateLeaderboardHomeAway(AWAY);
    this.fillStats();
    this.sortLeaderBoard();
  }

  private async leaderboardUpdateAwayHome(isHomeTeam: boolean) {
    this.teamRanking = [];
    await this.fillLeaderboard();
    await this.updateLeaderboardHomeAway(isHomeTeam);
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

  private static whoWinOrDraw(match: MatchesModel, hT: teamRankObj = df, aT: teamRankObj = df) {
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

  // public async updateLeaderboard() {
  //   const closedMatches = await this.sM.getAllClosedMatches();
  //   // console.log('EROO!!! ---'
  //   // +closedMatches);
  //   closedMatches.forEach((match) => {
  //     const hT = this.teamRanking.find((team) => team.id === match.homeTeamId) as teamRankObj;
  //     const aT = this.teamRanking.find((team) => team.id === match.awayTeamId) as teamRankObj;
  //     // console.log('L Away at.totalGames: '+hT.totalGames);
  //     // console.log('L Away at.totalGames: '+aT.totalGames);
  //     hT.totalGames += 1;
  //     aT.totalGames += 1;
  //     hT.goalsFavor += match.homeTeamGoals;
  //     hT.goalsOwn += match.awayTeamGoals;
  //     aT.goalsFavor += match.awayTeamGoals;
  //     aT.goalsOwn += match.homeTeamGoals;
  //     Leaderboard.whoWinOrDraw(match, hT, aT);
  //   });
  // }

  public async updateLeaderboardHomeAway(isHomeTeam: boolean) {
    const closedMatches = await this.sM.getAllClosedMatches();
    closedMatches.forEach((match) => {
      const team = isHomeTeam
        ? this.teamRanking.find((t) => t.id === match.homeTeamId) as teamRankObj
        : this.teamRanking.find((t) => t.id === match.awayTeamId) as teamRankObj;
      team.totalGames += 1;
      team.goalsFavor += isHomeTeam ? match.homeTeamGoals : match.awayTeamGoals;
      team.goalsOwn += isHomeTeam ? match.awayTeamGoals : match.homeTeamGoals;
      Leaderboard.whoWinOrDraw(match, isHomeTeam ? team : undefined, isHomeTeam ? undefined : team);
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
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
      if (b.goalsBalance !== a.goalsBalance) return b.goalsBalance - a.goalsBalance;
      if (b.goalsFavor !== a.goalsFavor) return b.goalsFavor - a.goalsFavor;
      return b.goalsOwn - a.goalsOwn;
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
    await this.leaderboardUpdateAwayHome(HOME);
    return this.teamRanking.map((teamRank) => {
      const { id, ...formatedRank } = teamRank;
      return formatedRank;
    });
  }

  public async getLeaderboardPlayingAtAway() {
    await this.leaderboardUpdateAwayHome(AWAY);
    return this.teamRanking.map((teamRank) => {
      const { id, ...formatedRank } = teamRank;
      return formatedRank;
    });
  }
}
