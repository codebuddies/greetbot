const expect = require('chai').expect;
const request = require('supertest');
const greetbot = require('../src/index.js');

describe('Greetbot routes testing', function () {
  describe('#GET /', function () {
    it('should load a basic page', function (done) {
      request(greetbot).get('/')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('page should contain some basic intro text', function (done) {
      request(greetbot).get('/')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.text.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('#GET /templates', function() {
    it('should load a templates index page', function (done) {
      request(greetbot).get('/templates')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should contain some text', function (done) {
      request(greetbot).get('/templates')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.text.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('#GET /templates/resources', function() {
    it('should load a templates index page', function (done) {
      request(greetbot).get('/templates/resources')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should contain some text', function (done) {
      request(greetbot).get('/templates/resources')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.text.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('#GET /templates/bodies', function() {
    it('should load a templates index page', function (done) {
      request(greetbot).get('/templates/bodies')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should contain some text', function (done) {
      request(greetbot).get('/templates/bodies')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.text.length).to.not.equal(0);
          done();
        });
    });
  });

  describe('#GET /templates/resources/:name', function() {
    it('should load a templates/resources show page', function (done) {
      request(greetbot).get('/templates/resources/effectivejs')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should contain some text', function (done) {
      request(greetbot).get('/templates/resources/effectivejs')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.text.length).to.not.equal(0);
          done();
        });
    });
  });
  describe('#GET /templates/bodies/:name', function() {
    it('should load a templates/bodies show page', function (done) {
      request(greetbot).get('/templates/bodies/JSA')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('should contain some text', function (done) {
      request(greetbot).get('/templates/bodies/JSA')
        .end(function (err, res) {
          if (err) { console.log(err); }
          expect(res.text.length).to.not.equal(0);
          done();
        });
    });
  });
});
