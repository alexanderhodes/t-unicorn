'use strict';

var app = require('../..');
import request from 'supertest';

var newProdukt;

describe('Produkt API:', function() {
  describe('GET /api/produkte', function() {
    var produkte;

    beforeEach(function(done) {
      request(app)
        .get('/api/produkte')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          produkte = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(produkte).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/produkte', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/produkte')
        .send({
          name: 'New Produkt',
          info: 'This is the brand new produkt!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newProdukt = res.body;
          done();
        });
    });

    it('should respond with the newly created produkt', function() {
      expect(newProdukt.name).to.equal('New Produkt');
      expect(newProdukt.info).to.equal('This is the brand new produkt!!!');
    });
  });

  describe('GET /api/produkte/:id', function() {
    var produkt;

    beforeEach(function(done) {
      request(app)
        .get(`/api/produkte/${newProdukt._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          produkt = res.body;
          done();
        });
    });

    afterEach(function() {
      produkt = {};
    });

    it('should respond with the requested produkt', function() {
      expect(produkt.name).to.equal('New Produkt');
      expect(produkt.info).to.equal('This is the brand new produkt!!!');
    });
  });

  describe('PUT /api/produkte/:id', function() {
    var updatedProdukt;

    beforeEach(function(done) {
      request(app)
        .put(`/api/produkte/${newProdukt._id}`)
        .send({
          name: 'Updated Produkt',
          info: 'This is the updated produkt!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedProdukt = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProdukt = {};
    });

    it('should respond with the original produkt', function() {
      expect(updatedProdukt.name).to.equal('New Produkt');
      expect(updatedProdukt.info).to.equal('This is the brand new produkt!!!');
    });

    it('should respond with the updated produkt on a subsequent GET', function(done) {
      request(app)
        .get(`/api/produkte/${newProdukt._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let produkt = res.body;

          expect(produkt.name).to.equal('Updated Produkt');
          expect(produkt.info).to.equal('This is the updated produkt!!!');

          done();
        });
    });
  });

  describe('PATCH /api/produkte/:id', function() {
    var patchedProdukt;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/produkte/${newProdukt._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Produkt' },
          { op: 'replace', path: '/info', value: 'This is the patched produkt!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedProdukt = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedProdukt = {};
    });

    it('should respond with the patched produkt', function() {
      expect(patchedProdukt.name).to.equal('Patched Produkt');
      expect(patchedProdukt.info).to.equal('This is the patched produkt!!!');
    });
  });

  describe('DELETE /api/produkte/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/produkte/${newProdukt._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when produkt does not exist', function(done) {
      request(app)
        .delete(`/api/produkte/${newProdukt._id}`)
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
