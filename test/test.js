const server = require('../index');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'));
const apiAddress = 'http://localhost:3000';

const getItemSchema = require('../schemas/itemSchema.json');

var assert = require('assert');

describe('API test', function() {
    before(() => server.start());
    after(()=> server.close());
    // Test post item acceptable
    describe('Create an item', function() {
        it('should accept correct data', async function() {
            await chai.request(apiAddress)
            .post('/items')
            .auth("tester", "testerpassword")
            .send({
               "title": "test title",
               "description": "What a test",
               "category": "Home",
               "location": "Oulu",
               "price": 10,
               "datePosting": "2019-08-24",
               "deliveryType": "Pick-Up"
            })
            .then(response => {
                expect(response).to.have.status(201);
            })
            .catch(err => {throw err});
        })
    })
    // Post item to fail
    describe('Create an item', function() {
        it('should refuse data', async function() {
            await chai.request(apiAddress)
            .post('/items')
            .auth("tester", "testerpassword")
            .send({
               "title": 10032,
               "category": "Home",
               "location": "Oulu",
               "images": ["img1"],
               "price": 10,
               "datePosting": "2019-08-24",
               "deliveryType": "Pick-Up"
            })
            .then(response => {
                expect(response).to.have.status(400);
            })
            .catch(err => {throw err});
        })
    })

    // Login fail
    describe('Login', function() {
        it('should accept correct data', async function() {
            await chai.request(apiAddress)
            .post('/auth')
            .send({
               "username": "tester",
            })
            .then(response => {
                expect(response).to.have.status(401);
            })
            .catch(err => {throw err});
        })
    })

    describe('Create new user', function() {
        it('should accept correct data', async function() {
            await chai.request(apiAddress)
            .post('/newuser')
            .send({
               "username": "tester",
               "email": "ciao@oulu.fi",
               "password": "newPassword"
            })
            .then(response => {
                expect(response).to.have.status(201);
            })
            .catch(err => {throw err});
        })
    })

    describe('Create new user', function() {
        it('should refuse the new user', async function() {
            await chai.request(apiAddress)
            .post('/newuser')
            .send({
               "username": "tester"
            })
            .then(response => {
                expect(response).to.have.status(406);
            })
            .catch(err => {throw err});
        })
    })

    describe('Get item by location', function() {
        it('should give right data', async function() {
            await chai.request(apiAddress)
            .get('/items?location=Oulu')
            .send({
            })
            .then(response => {
                expect(response).to.have.status(200);
            })
            .catch(err => {throw err});
        })
    })

    describe('Get item by location', function() {
        it('should return error', async function() {
            await chai.request(apiAddress)
            .get('/items?location=')
            .send({
            })
            .then(response => {
                expect(response).to.have.status(400);
            })
            .catch(err => {throw err});
        })
    })
})