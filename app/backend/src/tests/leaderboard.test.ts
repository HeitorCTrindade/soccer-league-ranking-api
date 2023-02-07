import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { allMatchesClosed } from './mocks/maches.mock';
import { allTeamsMock } from './mocks/team.mock';
import { leaderboardFull, leaderboardHome, leaderboardAway } from './mocks/leaderboard.mock';


import MatchesModel from '../database/models/Matches';
import TeamsModel from '../database/models/Teams';


import { Response } from 'superagent';

import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests LeaderBoard Endpont', () => {
  let chaiHttpResponse: Response;

  afterEach(sinon.restore);

  it('verify if route "/leaderboard" returns LeaderBoard correctly', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(allTeamsMock as any) ;
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesClosed as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/leaderboard').send();    
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardFull);    
  });  

  it('verify if route "/leaderboard/home" returns LeaderBoard correctly', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(allTeamsMock as any) ;
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesClosed as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/leaderboard/home').send();

           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardHome);    
  });  

  it('verify if route "/leaderboard/away" returns LeaderBoard correctly', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(allTeamsMock as any) ;
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesClosed as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/leaderboard/away').send();
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(leaderboardAway);    
  });  
});