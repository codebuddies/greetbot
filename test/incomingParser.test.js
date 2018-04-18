// NOTE: This test suite tests the method parsePayload() in incomingParserJS.
const expect = require('chai').expect;
const parsePayload = require('../src/app/util/incomingParser').parsePayload;

describe('parsePayload()', function () {
  let req;

  beforeEach(function () {
    req = {
      'body': {
        'command': '/welcome',
        'text': 'test',
        'user_id': '1A2B'
      }
    };
  });

  // TODO: Better to test if certain keywords are valid and if not,
  // it should return undefined.
  describe('when invoked with no arguments', function () {
    it('should target the user_id', async function () {
      req.body.text = '';
      const res = await parsePayload(req);
      expect(res.target_channel_id[0]).to.equal(req.body.user_id);
    });
  });

  describe('when invoked with single keyword arguments', function () {
    it('should respond with the correct action', async function () {
      const res = await parsePayload(req);
      expect(res.action).to.equal(req.body.text);
    });
  });

  describe('when invoked with multiple keyword arguments', function () {
    it('should return an undefined action', async function () {
      req.body.text = 'list post';
      const res = await parsePayload(req);
      expect(res.action).to.equal(undefined);
    });
  });

  describe('when invoked with a channel', function () {
    it('should pick up the channel id as an array', async function () {
      req.body.text = '<#123|general>';
      const res = await parsePayload(req);

      expect(res.target_channel_id).to.be.an('array');
      expect(res.target_channel_id).to.eql(['123']);
    });

    it('should pick up multiple channels', async function () {
      req.body.text = '<#123|general> <#111|random>';
      const res = await parsePayload(req);
      expect(res.target_channel_id).to.eql(['123', '111']);
    });
  });

  describe('when invoked with user', function () {
    it('should pick up users as an array', async function () {
      req.body.text = '<@1A2B|stain88>';
      const res = await parsePayload(req);

      expect(res.target_user_id).to.be.an('array');
      expect(res.target_user_id).to.eql(['1A2B']);
    });

    it('should pick up multiple users in an array', async function () {
      req.body.text = `<@1A2B|stain88> <@1BBB|Bethany Tester`;
      const res = await parsePayload(req);

      expect(res.target_user_id).to.eql(['1A2B', '1BBB']);
    });
  });

  describe('when invoked with action_arguments', function () {
    it('should default to an empty object', async function () {
      req.body.text = '';
      const res = await parsePayload(req);

      expect(res.actionArguments).to.be.an('object');
      expect(res.actionArguments).to.eql({});
    });

    it('should return a language in an array', async function () {
      req.body.text = 'js';
      const res = await parsePayload(req);
      expect(res.actionArguments.language).to.be.an('array');
      expect(res.actionArguments).to.eql({ 'language': ['javascript'] });
    });

    it('should return multiple languages', async function () {
      req.body.text = 'js python';
      const res = await parsePayload(req);
      const expected = { 'language': ['javascript', 'python'] };

      expect(res.actionArguments).to.eql(expected);
    });

    it('should be case-insensitive', async function () {
      req.body.text = 'SPAM';
      const res = await parsePayload(req);

      expect(res.actionArguments).to.eql({ 'language': ['python'] });
    });
  });

  describe('when invoked with level as arguments', function () {
    it('should return a level', async function () {
      req.body.text = 'beg';
      const res = await parsePayload(req);

      expect(res.actionArguments).to.eql({ 'level': ['beginner'] });
    });

    it('should return multiple levels', async function () {
      req.body.text = 'int moar';
      const res = await parsePayload(req);
      const expected = { 'level': ['intermediate', 'advanced'] };

      expect(res.actionArguments).to.eql(expected);
    });
  });

  describe('when invoked with a media type', function () {
    it('should return the correct media type', async function () {
      req.body.text = 'book';
      const res = await parsePayload(req);

      expect(res.actionArguments).to.eql({ 'media-type': ['book'] });
    });

    it('should return multiple types', async function () {
      req.body.text = 'class website';
      const res = await parsePayload(req);
      const expected = { 'media-type': ['class', 'website'] };

      expect(res.actionArguments).to.eql(expected);
    });
  });

  // NOTE: This seems a little brittle - should these args be in a certain
  // order? - Angelo 4/18
  describe('when invoked with complex args for media-type', function () {
    it('should return an object the correct values', async function () {
      req.body.text = 'javascript beginner free book';
      const res = await parsePayload(req);
      const obj = res.actionArguments;

      expect(obj.language).to.eql(['javascript']);
      expect(obj.level).to.eql(['beginner']);
      expect(obj['media-cost-desc']).to.eql(['free']);
      expect(obj['media-type']).to.eql(['book']);
    });
  });
});
