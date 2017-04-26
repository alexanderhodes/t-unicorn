'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var produktCtrlStub = {
  index: 'produktCtrl.index',
  show: 'produktCtrl.show',
  create: 'produktCtrl.create',
  upsert: 'produktCtrl.upsert',
  patch: 'produktCtrl.patch',
  destroy: 'produktCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var produktIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './produkt.controller': produktCtrlStub
});

describe('Produkt API Router:', function() {
  it('should return an express router instance', function() {
    expect(produktIndex).to.equal(routerStub);
  });

  describe('GET /api/produkte', function() {
    it('should route to produkt.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'produktCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/produkte/:id', function() {
    it('should route to produkt.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'produktCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/produkte', function() {
    it('should route to produkt.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'produktCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/produkte/:id', function() {
    it('should route to produkt.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'produktCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/produkte/:id', function() {
    it('should route to produkt.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'produktCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/produkte/:id', function() {
    it('should route to produkt.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'produktCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
