const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

describe('#POST /welcome', function() {

  describe('no arguments', function() {

    before(function setBody() {
      body = {user_id: user_id, token: slack_ver_token};
    })

    it('should be valid', function(done) {
      body.command = '/welcome';
      body.text = '';
      request(greetbot).post('/welcome')
        .send(body)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

  });
});
