'use strict';

var _redux = require('redux');

var _ReduxSagaEmitter = require('../ReduxSagaEmitter');

var _ReduxSagaEmitter2 = _interopRequireDefault(_ReduxSagaEmitter);

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars, no-undef */
var initialState = {
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
var counter = function counter() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case 'INCREMENT':
      state.a.value += action.with;
      return state;
    case 'DECREMENT':
      state.a.value -= action.with;
      return state;
    default:
      return state;
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

var rootSaga = /*#__PURE__*/regeneratorRuntime.mark(function rootSaga() {
  var action, data, task;
  return regeneratorRuntime.wrap(function rootSaga$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.take)('INCREMENT');

        case 2:
          action = _context3.sent;
          _context3.next = 5;
          return (0, _effects.call)(api, action.with);

        case 5:
          data = _context3.sent;
          _context3.prev = 6;
          _context3.next = 9;
          return (0, _effects.call)(apiBroken);

        case 9:
          _context3.next = 13;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3['catch'](6);

        case 13:
          _context3.next = 15;
          return (0, _effects.fork)(apiTimeout);

        case 15:
          task = _context3.sent;


          task.cancel();

        case 17:
        case 'end':
          return _context3.stop();
      }
    }
  }, rootSaga, this, [[6, 11]]);
});

describe('Given the ReduxSagaEmitter', function () {
  beforeEach(function () {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('when adding the emitter as a Redux middleware', function () {
    describe('and when we dispatch an action', function () {
      it('should dispatch an event to Stent extension', function (done) {
        var emitter = (0, _ReduxSagaEmitter2.default)();
        var sagaMiddleware = (0, _reduxSaga2.default)({ sagaMonitor: emitter.sagaMonitor });
        var store = (0, _redux.createStore)(counter, (0, _redux.applyMiddleware)(sagaMiddleware));

        emitter.setStore(store);

        sagaMiddleware.run(rootSaga).done.then(function () {

          expect(window.top.postMessage).to.be.calledWith({
            pageRefresh: true,
            source: 'stent',
            icon: sinon.match.string,
            time: sinon.match.number,
            uid: sinon.match.string,
            color: sinon.match.string
          });

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effect: { args: [], root: true, saga: { __func: 'rootSaga' } },
              effectId: sinon.match.number,
              parentEffectId: sinon.match.number
            },
            effectName: 'root',
            label: 'effectTriggered(root)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effect: { '@@redux-saga/IO': true, TAKE: { pattern: 'INCREMENT' } },
              effectId: sinon.match.number,
              label: '',
              parentEffectId: sinon.match.number
            },
            effectName: 'TAKE',
            label: 'effectTriggered(TAKE)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effectId: sinon.match.number,
              result: {
                '@@redux-saga/TASK': true,
                cancel: { __func: 'cancel' },
                done: {},
                error: { __func: 'error' },
                id: sinon.match.number,
                isAborted: { __func: 'isAborted' },
                isCancelled: { __func: 'isCancelled' },
                isRunning: { __func: 'isRunning' },
                joiners: [],
                name: 'rootSaga',
                result: { __func: 'result' },
                setContext: { __func: 'setContext' }
              }
            },
            effectName: 'rootSaga',
            label: 'effectResolved(rootSaga)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: { action: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 } },
            label: 'actionDispatched',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effectId: sinon.match.number,
              error: {
                message: 'Sorry!',
                name: 'Error',
                stack: sinon.match.string
              }
            },
            label: 'effectRejected',
            state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: { effectId: sinon.match.number },
            label: 'effectCancelled',
            state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          done();
        });

        store.dispatch({ type: 'INCREMENT', with: 42, b: function b() {} });
      });
    });
  });
});