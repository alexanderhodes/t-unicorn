'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var frageCtrlStub = {
  index: 'frageCtrl.index',
  show: 'frageCtrl.show',
  create: 'frageCtrl.create',
  upsert: 'frageCtrl.upsert',
  patch: 'frageCtrl.patch',
  destroy: 'frageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var frageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './frage.controller': frageCtrlStub
});

describe('Frage API Router:', function() {
  it('should return an express router instance', function() {
    expect(frageIndex).to.equal(routerStub);
  });

  describe('GET /api/fragen', function() {
    it('should route to frage.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'frageCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/fragen/:id', function() {
    it('should route to frage.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'frageCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/fragen', function() {
    it('should route to frage.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'frageCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/fragen/:id', function() {
    it('should route to frage.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'frageCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/fragen/:id', function() {
    it('should route to frage.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'frageCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/fragen/:id', function() {
    it('should route to frage.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'frageCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
