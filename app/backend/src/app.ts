import * as express from 'express';
import LoginController from './controllers/login.controller';
import TeamController from './controllers/team.controller';
import MatchesController from './controllers/matches.controller';
import LeaderboardController from './controllers/leaderboard.controller';

class App {
  public app: express.Express;
  constructor() {
    this.app = express();
    const loginController = new LoginController();
    const teamController = new TeamController();
    const mc = new MatchesController();
    const leaderBoardController = new LeaderboardController();
    this.config();
    this.app.get('/', (req, res) => res.json({ ok: true }));
    this.app.post('/login', loginController.validateLogin, loginController.login);
    this.app.get('/login/validate', loginController.validadeAuth, loginController.auth);
    this.app.get('/teams', teamController.getAllTeams);
    this.app.get('/teams/:id', teamController.getTeamById);
    this.app.get('/matches', mc.getAllMatches);
    this.app.patch('/matches/:id/finish', mc.finishMatch);
    this.app.patch('/matches/:id', mc.updateMatch);
    this.app.post('/matches', mc.validateToken, mc.validateNewMatch, mc.createNewMatch);
    this.app.get('/leaderboard', leaderBoardController.getLeaderboard);
    this.app.get('/leaderboard/home', leaderBoardController.getLeaderboardPlayingAtHome);
    this.app.get('/leaderboard/away', leaderBoardController.getLeaderboardPlayingAtAway);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
