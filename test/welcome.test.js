const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const parsePayload = require('../src/app/util/incomingParser.js').parsePayload;

describe('#POST /welcome', function() {

  describe('no arguments', function() {

    before(function setBody() {
      req = {'body': {'command': '/welcome', 'text': '', 'user_id': user_id, 'token': slack_ver_token}};
    })

    it.skip('should be valid', function(done) {
      request(greetbot).post('/welcome')
        .send(req.body)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

  });
});
