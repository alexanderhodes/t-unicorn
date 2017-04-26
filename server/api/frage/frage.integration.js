'use strict';

var app = require('../..');
import request from 'supertest';

var newFrage;

describe('Frage API:', function() {
  describe('GET /api/fragen', function() {
    var fragen;

    beforeEach(function(done) {
      request(app)
        .get('/api/fragen')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          fragen = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(fragen).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/fragen', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/fragen')
        .send({
          name: 'New Frage',
          info: 'This is the brand new frage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newFrage = res.body;
          done();
        });
    });

    it('should respond with the newly created frage', function() {
      expect(newFrage.name).to.equal('New Frage');
      expect(newFrage.info).to.equal('This is the brand new frage!!!');
    });
  });

  describe('GET /api/fragen/:id', function() {
    var frage;

    beforeEach(function(done) {
      request(app)
        .get(`/api/fragen/${newFrage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          frage = res.body;
          done();
        });
    });

    afterEach(function() {
      frage = {};
    });

    it('should respond with the requested frage', function() {
      expect(frage.name).to.equal('New Frage');
      expect(frage.info).to.equal('This is the brand new frage!!!');
    });
  });

  describe('PUT /api/fragen/:id', function() {
    var updatedFrage;

    beforeEach(function(done) {
      request(app)
        .put(`/api/fragen/${newFrage._id}`)
        .send({
          name: 'Updated Frage',
          info: 'This is the updated frage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedFrage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedFrage = {};
    });

    it('should respond with the original frage', function() {
      expect(updatedFrage.name).to.equal('New Frage');
      expect(updatedFrage.info).to.equal('This is the brand new frage!!!');
    });

    it('should respond with the updated frage on a subsequent GET', function(done) {
      request(app)
        .get(`/api/fragen/${newFrage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let frage = res.body;

          expect(frage.name).to.equal('Updated Frage');
          expect(frage.info).to.equal('This is the updated frage!!!');

          done();
        });
    });
  });

  describe('PATCH /api/fragen/:id', function() {
    var patchedFrage;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/fragen/${newFrage._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Frage' },
          { op: 'replace', path: '/info', value: 'This is the patched frage!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedFrage = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedFrage = {};
    });

    it('should respond with the patched frage', function() {
      expect(patchedFrage.name).to.equal('Patched Frage');
      expect(patchedFrage.info).to.equal('This is the patched frage!!!');
    });
  });

  describe('DELETE /api/fragen/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/fragen/${newFrage._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when frage does not exist', function(done) {
      request(app)
        .delete(`/api/fragen/${newFrage._id}`)
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
