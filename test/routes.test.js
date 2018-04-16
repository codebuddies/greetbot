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
});
