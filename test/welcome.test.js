// NOTE: Skipping welcome test as `/welcome` could be deprecated soon.
// Angelo 4/18
// const expect = require('chai').expect;
// const request = require('supertest');
// const greetbot = require('../src/index.js');
//
// describe.skip('#POST /welcome', function () {
//   describe('no arguments', function () {
//     const req = { 'body':
//                   { 'command': '/welcome',
//                     'text': ''
//                     // 'user_id': user_id,
//                     // 'token': slack_ver_token }
//                   }
//     };
//
//     it('should be valid', function (done) {
//       request(greetbot).post('/welcome')
//         .send(req.body)
//         .end(function (err, res) {
//           if (err) { console.log(err); }
//           expect(res.statusCode).to.equal(200);
//           done();
//         });
//     });
//   });
// });
