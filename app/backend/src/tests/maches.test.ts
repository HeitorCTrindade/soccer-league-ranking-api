import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { allMatches, allMatchesInProgress, allMatchesClosed } from './mocks/maches.mock';


import MatchesModel from '../database/models/Matches';


import { Response } from 'superagent';

import { app } from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests Matches Endpont', () => {
  let chaiHttpResponse: Response;

  afterEach(sinon.restore);

  it('verify if route "/matchs" returns all matches correctly', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(allMatches as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/matches').send();
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(allMatches);    
  });  

  it('verify if route "/matchs" returns all matches in progress correctly', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesInProgress as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/matches?inProgress=true').send();
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(allMatchesInProgress);    
  });  

  it('verify if route "/matchs" returns all matches in progress correctly', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesClosed as any) ;
        
    chaiHttpResponse = await chai
       .request(app).get('/matches?inProgress=false').send();
           
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(allMatchesClosed);    
  });  
});