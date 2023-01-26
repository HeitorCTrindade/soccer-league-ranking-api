import { UserLogin, UserTokenData } from '../interfaces/UserLogin';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');
import { user, token, userLogin } from './mocks/login.service.mock';

import userModel from '../database/models/Users';

import { Response } from 'superagent';

import { app } from '../app';
import JWT from '../helpers/JWT';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests Login Unit', () => {
  let chaiHttpResponse: Response;

  afterEach(sinon.restore);

  it('Login is done correctly', async () => {
    sinon.stub(userModel, 'findOne').resolves(user as userModel) ;
    sinon.stub(bcrypt, 'compareSync').returns(true) ;
     
    chaiHttpResponse = await chai
       .request(app).post('/login').send(userLogin);
           
    const decodedToken = JWT.decodeToken(chaiHttpResponse.body.token) as UserTokenData;

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.have.property('token');
    expect(decodedToken.email).to.be.equal(user.email);
  });

  it('Login fails without email or password', async () => {
         
    chaiHttpResponse = await chai
       .request(app).post('/login').send({...userLogin, email: null});
    
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });    

    chaiHttpResponse = await chai
       .request(app).post('/login').send({...userLogin, password: null});
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });    
  });

  it('Login fails with invalid email', async () => {
         
    sinon.stub(userModel, 'findOne').resolves(null);

    chaiHttpResponse = await chai
       .request(app).post('/login').send({...userLogin, email: 'invalid@mail'});    
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' });   
  });

  it('Login fails with invalid password', async () => {
         
    sinon.stub(userModel, 'findOne').resolves(user as userModel) ;
    sinon.stub(bcrypt, 'compareSync').returns(false);

    chaiHttpResponse = await chai
       .request(app).post('/login').send({...userLogin, password: 'invalidPassword'});       
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' }); 
  });
});
