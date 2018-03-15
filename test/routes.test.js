const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

describe('Greetbot routes testing', function() {

  describe('#GET /', function() {

    it('should load a basic page', function(done) {
      request(greetbot).get('/')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('page should contain some basic intro text', function(done) {
      request(greetbot).get('/')
        .end(function(err, res) {
          expect(res.text).to.include('<h2>The Welcome/Code of Conduct app for CodeBuddies is running.</h2> <p>Follow the instructions in the README on GitHub to clone/configure this Slack App & your environment variables.</p>');
          done();
        });
    });
  });

});
