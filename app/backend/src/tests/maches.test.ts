// import * as sinon from 'sinon';
// import * as chai from 'chai';
// // @ts-ignore
// import chaiHttp = require('chai-http');

// import MatchesModel from '../database/models/Matches';


// import { Response } from 'superagent';

// import { app } from '../app';

// chai.use(chaiHttp);

// const { expect } = chai;

// describe('Tests Matches Endpont', () => {
//   let chaiHttpResponse: Response;

//   afterEach(sinon.restore);

//   it('verify if route "/matchs" returns all matchs correctly', async () => {
//     sinon.stub(MatchesModel, 'findAll').resolves(allTeamsMock as any) ;
        
//     chaiHttpResponse = await chai
//        .request(app).get('/teams').send();
           
//     expect(chaiHttpResponse.status).to.be.equal(200);
//     expect(chaiHttpResponse.body).to.deep.equal(allTeamsMock);    
//   });  
// });