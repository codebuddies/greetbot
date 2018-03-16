const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const parsePayload = require('../src/app/util/incomingParser.js').parsePayload;

describe('incomingParser', function() {

  describe('no arguments', function() {

    before(function setBody() {
      req = {'body': {'command': '/welcome', 'text': '', 'user_id': user_id, 'token': slack_ver_token}};
    })

    it('should target the user_id', async function() {
      await parsePayload(req).then(res => {
        expect(res.target_channel_id[0]).to.equal(user_dm_id);
      });
    })

  });

  describe('with arguments', function() {

    describe('actions', function() {

      before(function setBody() {
        req = {'body': {'command': '/welcome', 'user_id': user_id, 'token': slack_ver_token}};
      })

      it('should pick up test keyword', async function() {
        req.body.text = 'test';
        await parsePayload(req).then(res => {
          expect(res.action).to.equal('test');
        });
      });

      it('should pick up post keyword', async function() {
        req.body.text = 'post';
        await parsePayload(req).then(res => {
          expect(res.action).to.equal('post');
        });
      });

      it('should pick up list keyword', async function() {
        req.body.text = 'list';
        await parsePayload(req).then(res => {
          expect(res.action).to.equal('list');
        });
      });

      it('should return to default if more than one action keyword', async function() {
        req.body.text = 'list post';
        await parsePayload(req).then(res => {
          expect(res.action).to.equal(undefined);
        });
      });

    })

    describe('channels', function() {

      before(function setBody() {
        req = {'body': {'command': '/welcome', 'user_id': user_id, 'token': slack_ver_token}};
      })

      it('should pick up #general', async function() {
        req.body.text = `<#${general_id}|general>`;
        await parsePayload(req).then(res => {
          expect(res.target_channel_id).to.eql([general_id]);
        });
      });

      it('should pick up multiple channels', async function() {
        req.body.text = `<#${general_id}|general> <#${other_channel_id}|random>`;
        await parsePayload(req).then(res => {
          expect(res.target_channel_id).to.eql([general_id, other_channel_id]);
        });
      });

    })

    describe('users', function() {

      before(function setBody() {
        req = {'body': {'command': '/welcome', 'user_id': user_id, 'token': slack_ver_token}};
      })

      it('should pick up one user', async function() {
        req.body.text = `<@${user_id}|${user_dm_name}>`;
        await parsePayload(req).then(res => {
          expect(res.target_user_id).to.eql([user_dm_id]);
        });
      });

      it('should pick up multiple users', async function() {
        req.body.text = `<@${user_id}|${user_dm_name}> <@${other_user_id}|${other_dm_name}>`;
        await parsePayload(req).then(res => {
          expect(res.target_user_id).to.eql([user_dm_id, other_dm_id]);
        });
      });

    })

    describe('action_arguments', function() {

      before(function setBody() {
        req = {'body': {'command': '/welcome', 'user_id': user_id, 'token': slack_ver_token}};
      });

      it('should default to an empty object', async function() {
        req.body.text = '';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({});
        });
      });

      it('should return a language', async function() {
        req.body.text = 'js';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'language': ['javascript']});
        });
      });

      it('should return multiple languages', async function() {
        req.body.text = 'js python';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'language': ['javascript', 'python']});
        });
      });

      it('should return a level', async function() {
        req.body.text = 'beg';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'level': ['beginner']});
        });
      });

      it('should return multiple levels', async function() {
        req.body.text = 'int moar';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'level': ['intermediate', 'advanced']});
        });
      });

      it('should return a type', async function() {
        req.body.text = 'book';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'media-type': ['book']});
        });
      });

      it('should return multiple types', async function() {
        req.body.text = 'class website';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'media-type': ['class', 'website']});
        });
      });

      it('should deal with all of the above', async function() {
        req.body.text = 'javascript beginner free book';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'language': ['javascript'], 'level': ['beginner'], 'media-cost-desc': ['free'], 'media-type': ['book']});
        });
      });

      it('should be case-insensitive', async function() {
        req.body.text = 'SPAM';
        await parsePayload(req).then(res => {
          expect(res.action_arguments).to.eql({'language': ['python']});
        });
      });

    });

  });
});
