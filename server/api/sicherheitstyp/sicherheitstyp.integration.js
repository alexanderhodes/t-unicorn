'use strict';

var app = require('../..');
import request from 'supertest';

var newSicherheitstyp;

describe('Sicherheitstyp API:', function() {
  describe('GET /api/sicherheitstypen', function() {
    var sicherheitstypen;

    beforeEach(function(done) {
      request(app)
        .get('/api/sicherheitstypen')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          sicherheitstypen = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(sicherheitstypen).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/sicherheitstypen', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/sicherheitstypen')
        .send({
          name: 'New Sicherheitstyp',
          info: 'This is the brand new sicherheitstyp!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSicherheitstyp = res.body;
          done();
        });
    });

    it('should respond with the newly created sicherheitstyp', function() {
      expect(newSicherheitstyp.name).to.equal('New Sicherheitstyp');
      expect(newSicherheitstyp.info).to.equal('This is the brand new sicherheitstyp!!!');
    });
  });

  describe('GET /api/sicherheitstypen/:id', function() {
    var sicherheitstyp;

    beforeEach(function(done) {
      request(app)
        .get(`/api/sicherheitstypen/${newSicherheitstyp._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          sicherheitstyp = res.body;
          done();
        });
    });

    afterEach(function() {
      sicherheitstyp = {};
    });

    it('should respond with the requested sicherheitstyp', function() {
      expect(sicherheitstyp.name).to.equal('New Sicherheitstyp');
      expect(sicherheitstyp.info).to.equal('This is the brand new sicherheitstyp!!!');
    });
  });

  describe('PUT /api/sicherheitstypen/:id', function() {
    var updatedSicherheitstyp;

    beforeEach(function(done) {
      request(app)
        .put(`/api/sicherheitstypen/${newSicherheitstyp._id}`)
        .send({
          name: 'Updated Sicherheitstyp',
          info: 'This is the updated sicherheitstyp!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSicherheitstyp = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSicherheitstyp = {};
    });

    it('should respond with the original sicherheitstyp', function() {
      expect(updatedSicherheitstyp.name).to.equal('New Sicherheitstyp');
      expect(updatedSicherheitstyp.info).to.equal('This is the brand new sicherheitstyp!!!');
    });

    it('should respond with the updated sicherheitstyp on a subsequent GET', function(done) {
      request(app)
        .get(`/api/sicherheitstypen/${newSicherheitstyp._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let sicherheitstyp = res.body;

          expect(sicherheitstyp.name).to.equal('Updated Sicherheitstyp');
          expect(sicherheitstyp.info).to.equal('This is the updated sicherheitstyp!!!');

          done();
        });
    });
  });

  describe('PATCH /api/sicherheitstypen/:id', function() {
    var patchedSicherheitstyp;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/sicherheitstypen/${newSicherheitstyp._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Sicherheitstyp' },
          { op: 'replace', path: '/info', value: 'This is the patched sicherheitstyp!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSicherheitstyp = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSicherheitstyp = {};
    });

    it('should respond with the patched sicherheitstyp', function() {
      expect(patchedSicherheitstyp.name).to.equal('Patched Sicherheitstyp');
      expect(patchedSicherheitstyp.info).to.equal('This is the patched sicherheitstyp!!!');
    });
  });

  describe('DELETE /api/sicherheitstypen/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/sicherheitstypen/${newSicherheitstyp._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when sicherheitstyp does not exist', function(done) {
      request(app)
        .delete(`/api/sicherheitstypen/${newSicherheitstyp._id}`)
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
