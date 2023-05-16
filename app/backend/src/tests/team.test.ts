import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { allTeamsMock, teamMock } from './mocks/team.mock';

import TeamsModel from '../database/models/Teams';
import TeamInterface from '../interfaces/ITeam';

import { Response } from 'superagent';

import { app } from '../app';
import Team from '../database/models/Teams';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests Teams Endpont', () => {
  let chaiHttpResponse: Response;

  afterEach(sinon.restore);

  it('verify if route "/teams" returns all teams', async () => {
    sinon.stub(TeamsModel, 'findAll').resolves(allTeamsMock as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/teams').send();
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(allTeamsMock);    
  });

  it('verify if route "/teams/:id" returns the searched team', async () => {
    sinon.stub(TeamsModel, 'findOne').resolves(teamMock as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/teams/:id').send();
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(teamMock);    
  });
});
