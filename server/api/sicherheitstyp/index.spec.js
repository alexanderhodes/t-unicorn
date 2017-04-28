'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var sicherheitstypCtrlStub = {
  index: 'sicherheitstypCtrl.index',
  show: 'sicherheitstypCtrl.show',
  create: 'sicherheitstypCtrl.create',
  upsert: 'sicherheitstypCtrl.upsert',
  patch: 'sicherheitstypCtrl.patch',
  destroy: 'sicherheitstypCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var sicherheitstypIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './sicherheitstyp.controller': sicherheitstypCtrlStub
});

describe('Sicherheitstyp API Router:', function() {
  it('should return an express router instance', function() {
    expect(sicherheitstypIndex).to.equal(routerStub);
  });

  describe('GET /api/sicherheitstypen', function() {
    it('should route to sicherheitstyp.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'sicherheitstypCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/sicherheitstypen/:id', function() {
    it('should route to sicherheitstyp.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'sicherheitstypCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/sicherheitstypen', function() {
    it('should route to sicherheitstyp.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'sicherheitstypCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/sicherheitstypen/:id', function() {
    it('should route to sicherheitstyp.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'sicherheitstypCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/sicherheitstypen/:id', function() {
    it('should route to sicherheitstyp.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'sicherheitstypCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/sicherheitstypen/:id', function() {
    it('should route to sicherheitstyp.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'sicherheitstypCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
