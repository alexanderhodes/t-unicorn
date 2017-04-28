'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var optionCtrlStub = {
  index: 'optionCtrl.index',
  show: 'optionCtrl.show',
  create: 'optionCtrl.create',
  upsert: 'optionCtrl.upsert',
  patch: 'optionCtrl.patch',
  destroy: 'optionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var optionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './option.controller': optionCtrlStub
});

describe('Option API Router:', function() {
  it('should return an express router instance', function() {
    expect(optionIndex).to.equal(routerStub);
  });

  describe('GET /api/options', function() {
    it('should route to option.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'optionCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/options/:id', function() {
    it('should route to option.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'optionCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/options', function() {
    it('should route to option.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'optionCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/options/:id', function() {
    it('should route to option.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'optionCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/options/:id', function() {
    it('should route to option.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'optionCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/options/:id', function() {
    it('should route to option.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'optionCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
