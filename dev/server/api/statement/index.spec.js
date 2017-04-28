'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var statementCtrlStub = {
  index: 'statementCtrl.index',
  show: 'statementCtrl.show',
  create: 'statementCtrl.create',
  upsert: 'statementCtrl.upsert',
  patch: 'statementCtrl.patch',
  destroy: 'statementCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var statementIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './statement.controller': statementCtrlStub
});

describe('Statement API Router:', function() {
  it('should return an express router instance', function() {
    expect(statementIndex).to.equal(routerStub);
  });

  describe('GET /api/statements', function() {
    it('should route to statement.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'statementCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/statements/:id', function() {
    it('should route to statement.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'statementCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/statements', function() {
    it('should route to statement.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'statementCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/statements/:id', function() {
    it('should route to statement.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'statementCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/statements/:id', function() {
    it('should route to statement.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'statementCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/statements/:id', function() {
    it('should route to statement.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'statementCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
