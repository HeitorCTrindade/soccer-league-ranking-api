export default interface teamRankObj {
  id: number;
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

// [
//   {
//     "id": 1,
//     "homeTeamId": 16,
//     "homeTeamGoals": 1,
//     "awayTeamId": 8,
//     "awayTeamGoals": 1,
//     "inProgress": false,
//     "homeTeam": {
//       "teamName": "São Paulo"
//     },
//     "awayTeam": {
//       "teamName": "Grêmio"
//     }
//   },
//   {
//     "id": 2,
//     "homeTeamId": 9,
//     "homeTeamGoals": 1,
//     "awayTeamId": 14,
//     "awayTeamGoals": 1,
//     "inProgress": false,
//     "homeTeam": {
//       "teamName": "Internacional"
//     },
//     "awayTeam": {
//       "teamName": "Santos"
//     }
//   }
// ]
