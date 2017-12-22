'use strict';

var _redux = require('redux');

var _ = require('../');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */
var initialState = function initialState() {
  return {
    a: {
      value: 0
    },
    b: [1, 2, 3, 4],
    c: function c() {},
    d: /*#__PURE__*/regeneratorRuntime.mark(function d() {
      return regeneratorRuntime.wrap(function d$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case 'end':
              return _context.stop();
          }
        }
      }, d, this);
    })
  };
};
var counter = function counter(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      state.a.value += action.with;
      return state;
    case 'DECREMENT':
      state.a.value -= action.with;
      return state;
    default:
      return initialState();
  }
};

var api = function api() {
  return Promise.resolve([1, 2, 3]);
};
var apiBroken = function apiBroken() {
  return Promise.reject(new Error('Sorry!'));
};
var apiTimeout = /*#__PURE__*/regeneratorRuntime.mark(function apiTimeout() {
  return regeneratorRuntime.wrap(function apiTimeout$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.take)('UNKNOWN');

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, apiTimeout, this);
});

var myRootSaga = /*#__PURE__*/regeneratorRuntime.mark(function myRootSaga() {
  var action;
  return regeneratorRuntime.wrap(function myRootSaga$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.take)('INCREMENT');

        case 2:
          action = _context3.sent;

        case 3:
        case 'end':
          return _context3.stop();
      }
    }
  }, myRootSaga, this);
});
var myRootSaga2 = /*#__PURE__*/regeneratorRuntime.mark(function myRootSaga2() {
  return regeneratorRuntime.wrap(function myRootSaga2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return (0, _effects.call)(apiBroken);

        case 3:
          _context4.next = 7;
          break;

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4['catch'](0);

        case 7:
        case 'end':
          return _context4.stop();
      }
    }
  }, myRootSaga2, this, [[0, 5]]);
});
var myRootSaga3 = /*#__PURE__*/regeneratorRuntime.mark(function myRootSaga3() {
  var task;
  return regeneratorRuntime.wrap(function myRootSaga3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _effects.fork)(apiTimeout);

        case 2:
          task = _context5.sent;


          task.cancel();

        case 4:
        case 'end':
          return _context5.stop();
      }
    }
  }, myRootSaga3, this);
});
var messages = [];

describe('Given the ReduxSagaEmitter', function () {
  beforeEach(function () {
    messages = [];
    sinon.stub(window.top, 'postMessage').callsFake(function (message) {
      return messages.push(message);
    });
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('when adding the emitter as a Redux middleware', function () {
    describe('and when we dispatch an action', function () {
      describe('should dispatch an event to Kuker extension', function () {
        [{
          desc: 'should send effectTriggered(root) event',
          finder: function finder(m, i) {
            return i === 1;
          },
          expected: {
            type: '@saga_effectTriggered'
          },
          saga: myRootSaga,
          only: false
        }, {
          desc: 'should send effectResolved event',
          finder: function finder(m, i) {
            return i === 3;
          },
          expected: {
            type: '@saga_effectResolved'
          },
          saga: myRootSaga,
          only: false
        }, {
          desc: 'should send actionDispatched event',
          finder: function finder(m, i) {
            return i === 4;
          },
          expected: {
            type: '@saga_actionDispatched'
          },
          saga: myRootSaga,
          only: false
        }, {
          desc: 'should send effectRejected event',
          finder: function finder(m, i) {
            return i === 5;
          },
          expected: {
            type: '@saga_effectRejected'
          },
          saga: myRootSaga2,
          only: false
        }, {
          desc: 'should send effectCancelled event',
          finder: function finder(m, i) {
            return i === 5;
          },
          expected: {
            type: '@saga_effectCancelled'
          },
          saga: myRootSaga3,
          only: false
        }].forEach(function (_ref) {
          var expected = _ref.expected,
              desc = _ref.desc,
              saga = _ref.saga,
              only = _ref.only,
              finder = _ref.finder;

          (only ? it.only : it)(desc, function (done) {
            var emitter = (0, _.ReduxSagaEmitter)();
            var sagaMiddleware = (0, _reduxSaga2.default)({ sagaMonitor: emitter.sagaMonitor });
            var store = (0, _redux.createStore)(counter, (0, _redux.applyMiddleware)(sagaMiddleware));

            emitter.setStore(store);

            sagaMiddleware.run(saga).done.then(function () {
              if (only) {
                console.dir(messages.map(function (m, i) {
                  var _ref2;

                  return _ref2 = {}, _ref2[i] = m, _ref2;
                }), { depth: null });
              }
              expect(messages.find(finder)).to.containSubset(expected);
              done();
            }).catch(done);

            store.dispatch({ type: 'INCREMENT', with: 42, b: function b() {} });
          });
        });
      });
    });
  });
});