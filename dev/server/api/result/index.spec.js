'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var resultCtrlStub = {
  index: 'resultCtrl.index',
  show: 'resultCtrl.show',
  create: 'resultCtrl.create',
  upsert: 'resultCtrl.upsert',
  patch: 'resultCtrl.patch',
  destroy: 'resultCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var resultIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './result.controller': resultCtrlStub
});

describe('Result API Router:', function() {
  it('should return an express router instance', function() {
    expect(resultIndex).to.equal(routerStub);
  });

  describe('GET /api/results', function() {
    it('should route to result.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'resultCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/results/:id', function() {
    it('should route to result.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'resultCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/results', function() {
    it('should route to result.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'resultCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/results/:id', function() {
    it('should route to result.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'resultCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/results/:id', function() {
    it('should route to result.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'resultCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/results/:id', function() {
    it('should route to result.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'resultCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
