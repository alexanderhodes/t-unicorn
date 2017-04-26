'use strict';

var app = require('../..');
import request from 'supertest';

var newKatalog;

describe('Katalog API:', function() {
  describe('GET /api/kataloge', function() {
    var kataloge;

    beforeEach(function(done) {
      request(app)
        .get('/api/kataloge')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          kataloge = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(kataloge).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/kataloge', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/kataloge')
        .send({
          name: 'New Katalog',
          info: 'This is the brand new katalog!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newKatalog = res.body;
          done();
        });
    });

    it('should respond with the newly created katalog', function() {
      expect(newKatalog.name).to.equal('New Katalog');
      expect(newKatalog.info).to.equal('This is the brand new katalog!!!');
    });
  });

  describe('GET /api/kataloge/:id', function() {
    var katalog;

    beforeEach(function(done) {
      request(app)
        .get(`/api/kataloge/${newKatalog._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          katalog = res.body;
          done();
        });
    });

    afterEach(function() {
      katalog = {};
    });

    it('should respond with the requested katalog', function() {
      expect(katalog.name).to.equal('New Katalog');
      expect(katalog.info).to.equal('This is the brand new katalog!!!');
    });
  });

  describe('PUT /api/kataloge/:id', function() {
    var updatedKatalog;

    beforeEach(function(done) {
      request(app)
        .put(`/api/kataloge/${newKatalog._id}`)
        .send({
          name: 'Updated Katalog',
          info: 'This is the updated katalog!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedKatalog = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedKatalog = {};
    });

    it('should respond with the original katalog', function() {
      expect(updatedKatalog.name).to.equal('New Katalog');
      expect(updatedKatalog.info).to.equal('This is the brand new katalog!!!');
    });

    it('should respond with the updated katalog on a subsequent GET', function(done) {
      request(app)
        .get(`/api/kataloge/${newKatalog._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let katalog = res.body;

          expect(katalog.name).to.equal('Updated Katalog');
          expect(katalog.info).to.equal('This is the updated katalog!!!');

          done();
        });
    });
  });

  describe('PATCH /api/kataloge/:id', function() {
    var patchedKatalog;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/kataloge/${newKatalog._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Katalog' },
          { op: 'replace', path: '/info', value: 'This is the patched katalog!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedKatalog = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedKatalog = {};
    });

    it('should respond with the patched katalog', function() {
      expect(patchedKatalog.name).to.equal('Patched Katalog');
      expect(patchedKatalog.info).to.equal('This is the patched katalog!!!');
    });
  });

  describe('DELETE /api/kataloge/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/kataloge/${newKatalog._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when katalog does not exist', function(done) {
      request(app)
        .delete(`/api/kataloge/${newKatalog._id}`)
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
