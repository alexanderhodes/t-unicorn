'use strict';

var app = require('../..');
import request from 'supertest';

var newStatement;

describe('Statement API:', function() {
  describe('GET /api/statements', function() {
    var statements;

    beforeEach(function(done) {
      request(app)
        .get('/api/statements')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          statements = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(statements).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/statements', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/statements')
        .send({
          name: 'New Statement',
          info: 'This is the brand new statement!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStatement = res.body;
          done();
        });
    });

    it('should respond with the newly created statement', function() {
      expect(newStatement.name).to.equal('New Statement');
      expect(newStatement.info).to.equal('This is the brand new statement!!!');
    });
  });

  describe('GET /api/statements/:id', function() {
    var statement;

    beforeEach(function(done) {
      request(app)
        .get(`/api/statements/${newStatement._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          statement = res.body;
          done();
        });
    });

    afterEach(function() {
      statement = {};
    });

    it('should respond with the requested statement', function() {
      expect(statement.name).to.equal('New Statement');
      expect(statement.info).to.equal('This is the brand new statement!!!');
    });
  });

  describe('PUT /api/statements/:id', function() {
    var updatedStatement;

    beforeEach(function(done) {
      request(app)
        .put(`/api/statements/${newStatement._id}`)
        .send({
          name: 'Updated Statement',
          info: 'This is the updated statement!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStatement = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStatement = {};
    });

    it('should respond with the original statement', function() {
      expect(updatedStatement.name).to.equal('New Statement');
      expect(updatedStatement.info).to.equal('This is the brand new statement!!!');
    });

    it('should respond with the updated statement on a subsequent GET', function(done) {
      request(app)
        .get(`/api/statements/${newStatement._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let statement = res.body;

          expect(statement.name).to.equal('Updated Statement');
          expect(statement.info).to.equal('This is the updated statement!!!');

          done();
        });
    });
  });

  describe('PATCH /api/statements/:id', function() {
    var patchedStatement;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/statements/${newStatement._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Statement' },
          { op: 'replace', path: '/info', value: 'This is the patched statement!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStatement = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStatement = {};
    });

    it('should respond with the patched statement', function() {
      expect(patchedStatement.name).to.equal('Patched Statement');
      expect(patchedStatement.info).to.equal('This is the patched statement!!!');
    });
  });

  describe('DELETE /api/statements/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/statements/${newStatement._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when statement does not exist', function(done) {
      request(app)
        .delete(`/api/statements/${newStatement._id}`)
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
