'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var katalogCtrlStub = {
  index: 'katalogCtrl.index',
  show: 'katalogCtrl.show',
  create: 'katalogCtrl.create',
  upsert: 'katalogCtrl.upsert',
  patch: 'katalogCtrl.patch',
  destroy: 'katalogCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var katalogIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './katalog.controller': katalogCtrlStub
});

describe('Katalog API Router:', function() {
  it('should return an express router instance', function() {
    expect(katalogIndex).to.equal(routerStub);
  });

  describe('GET /api/kataloge', function() {
    it('should route to katalog.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'katalogCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/kataloge/:id', function() {
    it('should route to katalog.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'katalogCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/kataloge', function() {
    it('should route to katalog.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'katalogCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/kataloge/:id', function() {
    it('should route to katalog.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'katalogCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/kataloge/:id', function() {
    it('should route to katalog.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'katalogCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/kataloge/:id', function() {
    it('should route to katalog.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'katalogCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
