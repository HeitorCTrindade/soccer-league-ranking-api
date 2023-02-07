import teamRankObj from '../interfaces/TeamRanking';
import MatchesService from './matches.service';
import MatchesModel from '../database/models/Matches';
import TeamService from './team.service';

const df:teamRankObj = {
  id: 998,
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
  private closedMatches :MatchesModel[] = [];

  constructor(private sM = new MatchesService(), private tS = new TeamService()) {}

  private async leaderboardUpdate() {
    // await this.updateLeaderboardHomeAway(HOME);
    // await this.updateLeaderboardHomeAway(AWAY);
    await this.updateLeaderboard();
    this.fillStats();
    this.sortLeaderBoard();
  }

  private async leaderboardUpdateHomeAway(isHomeTeam: boolean) {
    // await this.fillLeaderboard();
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

  private whoWinOrDraw2(match: MatchesModel, indexhT:number, indexaT: number) {
    if (match.homeTeamGoals > match.awayTeamGoals) {
      this.teamRanking[indexhT].totalPoints += 3;
      this.teamRanking[indexhT].totalVictories += 1;
      this.teamRanking[indexaT].totalLosses += 1;
    } else if (match.homeTeamGoals === match.awayTeamGoals) {
      this.teamRanking[indexhT].totalPoints += 1;
      this.teamRanking[indexaT].totalPoints += 1;
      this.teamRanking[indexhT].totalDraws += 1;
      this.teamRanking[indexaT].totalDraws += 1;
    } else {
      this.teamRanking[indexaT].totalPoints += 3;
      this.teamRanking[indexaT].totalVictories += 1;
      this.teamRanking[indexhT].totalLosses += 1;
    }
  }

  public async updateLeaderboard() {
    const closedMatches = await this.sM.getAllClosedMatches();
    closedMatches.forEach((match) => {
      // console.log('Match: \n', this.teamRanking);
      const indexhT = this.teamRanking.findIndex((team) => +team.id === +match.homeTeamId);
      const indexaT = this.teamRanking.findIndex((team) => +team.id === +match.awayTeamId);
      // POR ALGUM MOTIVO TEAM VEM COMO INDEFINido nA BUSCA.
      if (!this.teamRanking[indexhT] || !this.teamRanking[indexaT]) {
        console.log('Undefined - ', indexhT, indexaT);
      } else {
        this.teamRanking[indexhT].totalGames += 1;
        this.teamRanking[indexaT].totalGames += 1;

        this.teamRanking[indexhT].goalsFavor += match.homeTeamGoals;
        this.teamRanking[indexaT].goalsFavor += match.awayTeamGoals;

        this.teamRanking[indexhT].goalsOwn += match.awayTeamGoals;
        this.teamRanking[indexaT].goalsOwn += match.homeTeamGoals;
        this.whoWinOrDraw2(match, indexhT, indexaT);
      }
    });
  }

  public async updateLeaderboardHomeAway(isHomeTeam: boolean) {
    const closedMatches = await this.sM.getAllClosedMatches();
    closedMatches.forEach((match) => {
      const teamToUpdatedStatus = isHomeTeam
        ? this.teamRanking.find((t) => +t.id === +match.homeTeamId) as teamRankObj
        : this.teamRanking.find((t) => +t.id === +match.awayTeamId) as teamRankObj;

      if (!teamToUpdatedStatus) {
        console.log('whareverHomeAway');
      } else {
        teamToUpdatedStatus.totalGames += 1;
        teamToUpdatedStatus.goalsFavor += isHomeTeam ? match.homeTeamGoals : match.awayTeamGoals;
        teamToUpdatedStatus.goalsOwn += isHomeTeam ? match.awayTeamGoals : match.homeTeamGoals;
        Leaderboard.whoWinOrDraw(match, isHomeTeam
          ? teamToUpdatedStatus : undefined, isHomeTeam ? undefined : teamToUpdatedStatus);
      }
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
    this.teamRanking = [];
    await this.fillLeaderboard();
    await this.leaderboardUpdate();
    const filteredBug = this.teamRanking.filter((teamRank) => teamRank.totalPoints !== 0);
    return filteredBug.map((teamRank) => {
      const { id, ...formatedRank } = teamRank;
      return formatedRank;
    });
  }

  public async getLeaderboardPlayingAtHome() {
    this.teamRanking = [];
    await this.fillLeaderboard();
    await this.leaderboardUpdateHomeAway(HOME);
    return this.teamRanking.map((teamRank) => {
      const { id, ...formatedRank } = teamRank;
      return formatedRank;
    });
  }

  public async getLeaderboardPlayingAtAway() {
    this.teamRanking = [];
    await this.fillLeaderboard();
    await this.leaderboardUpdateHomeAway(AWAY);
    return this.teamRanking.map((teamRank) => {
      const { id, ...formatedRank } = teamRank;
      return formatedRank;
    });
  }
}

// public async getLeaderboard() {
//   await this.leaderboardUpdate();

//   const retorno = this.teamRanking.map((teamRank) => {
//     const { id, ...formatedRank } = teamRank;
//     return formatedRank;
//   });

//   console.log("\n"+JSON.stringify(retorno));

//   return retorno;
// }

// public async getLeaderboardPlayingAtHome() {
//   await this.leaderboardUpdateHomeAway(HOME);
//   const retorno = this.teamRanking.map((teamRank) => {
//     const { id, ...formatedRank } = teamRank;
//     return formatedRank;
//   });

//   console.log("\n"+JSON.stringify(retorno));

//   return retorno;
// }

// public async getLeaderboardPlayingAtAway() {
//   await this.leaderboardUpdateHomeAway(AWAY);
//   const retorno = this.teamRanking.map((teamRank) => {
//     const { id, ...formatedRank } = teamRank;
//     return formatedRank;
//   });

//   console.log("\n"+JSON.stringify(retorno));

//   return retorno;
// }

// public async updateLeaderboardHomeAway(isHomeTeam: boolean) {
//   const closedMatches = await this.sM.getAllClosedMatches();
//   closedMatches.forEach((match) => {
//     const teamToUpdatedStatus = isHomeTeam
//       ? this.teamRanking.find((t) => {
//         console.log("["+t.id+"]-");
//         console.log("["+match.homeTeamId+"]");
//         return t.id === match.awayTeamId;
//       }) as teamRankObj
//       : this.teamRanking.find((t) => {
//         console.log("["+t.id+"]-");
//         console.log("["+match.awayTeamId+"]");
//         return t.id === match.awayTeamId;
//       }) as teamRankObj;
