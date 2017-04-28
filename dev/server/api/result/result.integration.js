'use strict';

var app = require('../..');
import request from 'supertest';

var newResult;

describe('Result API:', function() {
  describe('GET /api/results', function() {
    var results;

    beforeEach(function(done) {
      request(app)
        .get('/api/results')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          results = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(results).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/results', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/results')
        .send({
          name: 'New Result',
          info: 'This is the brand new result!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newResult = res.body;
          done();
        });
    });

    it('should respond with the newly created result', function() {
      expect(newResult.name).to.equal('New Result');
      expect(newResult.info).to.equal('This is the brand new result!!!');
    });
  });

  describe('GET /api/results/:id', function() {
    var result;

    beforeEach(function(done) {
      request(app)
        .get(`/api/results/${newResult._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          result = res.body;
          done();
        });
    });

    afterEach(function() {
      result = {};
    });

    it('should respond with the requested result', function() {
      expect(result.name).to.equal('New Result');
      expect(result.info).to.equal('This is the brand new result!!!');
    });
  });

  describe('PUT /api/results/:id', function() {
    var updatedResult;

    beforeEach(function(done) {
      request(app)
        .put(`/api/results/${newResult._id}`)
        .send({
          name: 'Updated Result',
          info: 'This is the updated result!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedResult = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedResult = {};
    });

    it('should respond with the original result', function() {
      expect(updatedResult.name).to.equal('New Result');
      expect(updatedResult.info).to.equal('This is the brand new result!!!');
    });

    it('should respond with the updated result on a subsequent GET', function(done) {
      request(app)
        .get(`/api/results/${newResult._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let result = res.body;

          expect(result.name).to.equal('Updated Result');
          expect(result.info).to.equal('This is the updated result!!!');

          done();
        });
    });
  });

  describe('PATCH /api/results/:id', function() {
    var patchedResult;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/results/${newResult._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Result' },
          { op: 'replace', path: '/info', value: 'This is the patched result!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedResult = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedResult = {};
    });

    it('should respond with the patched result', function() {
      expect(patchedResult.name).to.equal('Patched Result');
      expect(patchedResult.info).to.equal('This is the patched result!!!');
    });
  });

  describe('DELETE /api/results/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/results/${newResult._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when result does not exist', function(done) {
      request(app)
        .delete(`/api/results/${newResult._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
