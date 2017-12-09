'use strict';

var _redux = require('redux');

var _ReduxSagaEmitter = require('../ReduxSagaEmitter');

var _ReduxSagaEmitter2 = _interopRequireDefault(_ReduxSagaEmitter);

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
      describe('should dispatch an event to Stent extension', function () {
        [{
          desc: 'should send a pageRefresh event',
          finder: function finder(m) {
            return m.pageRefresh === true;
          },
          expected: {
            pageRefresh: true
          },
          saga: myRootSaga
        }, {
          desc: 'should send effectTriggered(root) event',
          finder: function finder(m) {
            return m.type === 'effectTriggered(root)';
          },
          expected: {
            action: {
              effect: { args: [], root: true, saga: { __func: 'myRootSaga' } }
            },
            type: 'effectTriggered(root)',
            label: 'effectTriggered (myRootSaga)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga
        }, {
          desc: 'should send effectTriggered(TAKE) event',
          finder: function finder(m) {
            return m.type === 'effectTriggered(TAKE)';
          },
          expected: {
            action: {
              effect: { '@@redux-saga/IO': true, TAKE: { pattern: 'INCREMENT' } }
            },
            type: 'effectTriggered(TAKE)',
            label: 'effectTriggered (TAKE(INCREMENT))',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga
        }, {
          desc: 'should send effectResolved event',
          finder: function finder(m) {
            return m.type === 'effectResolved';
          },
          expected: {
            action: {
              result: {
                '@@redux-saga/TASK': true,
                cancel: { __func: 'cancel' },
                done: {},
                error: { __func: 'error' },
                isAborted: { __func: 'isAborted' },
                isCancelled: { __func: 'isCancelled' },
                isRunning: { __func: 'isRunning' },
                joiners: [],
                name: 'myRootSaga',
                result: { __func: 'result' },
                setContext: { __func: 'setContext' }
              }
            },
            label: 'effectResolved(myRootSaga)',
            type: 'effectResolved',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga
        }, {
          desc: 'should send effectResolved of a side effect',
          finder: function finder(m, i) {
            return i === 5;
          },
          expected: {
            action: { result: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 } },
            label: 'effectResolved',
            type: 'effectResolved',
            state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga
        }, {
          desc: 'should send actionDispatched event',
          finder: function finder(m, i) {
            return i === 4;
          },
          expected: {
            action: { action: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 } },
            label: 'actionDispatched (INCREMENT)',
            type: 'actionDispatched(INCREMENT)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga
        }, {
          desc: 'should send effectRejected event',
          finder: function finder(m) {
            return m.type === 'effectRejected';
          },
          expected: {
            label: 'effectRejected (Sorry!)',
            type: 'effectRejected',
            state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga2
        }, {
          desc: 'should send effectCancelled event',
          finder: function finder(m) {
            return m.type === 'effectCancelled';
          },
          expected: {
            label: 'effectCancelled',
            type: 'effectCancelled',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga3
        }, {
          desc: 'should send effectTriggered(apiTimeout) event',
          finder: function finder(m, i) {
            return i === 2;
          },
          expected: {
            action: {
              effect: {
                '@@redux-saga/IO': true,
                FORK: { args: [], context: null, fn: { __func: 'apiTimeout' } }
              },
              label: ''
            },
            type: 'effectTriggered(apiTimeout)',
            label: 'effectTriggered (apiTimeout())',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          },
          saga: myRootSaga3
        }, {
          desc: 'should send effectTriggered when takeEvery is used',
          finder: function finder(m, i) {
            return i === 2;
          },
          expected: {
            type: 'effectTriggered(takeEvery)',
            label: 'effectTriggered (takeEvery(INCREMENT,[object Object]))'
          },
          saga: /*#__PURE__*/regeneratorRuntime.mark(function saga() {
            var task;
            return regeneratorRuntime.wrap(function saga$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return (0, _effects.takeEvery)('INCREMENT', /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                      return regeneratorRuntime.wrap(function _callee$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              task.cancel();

                            case 1:
                            case 'end':
                              return _context6.stop();
                          }
                        }
                      }, _callee, this);
                    }));

                  case 2:
                    task = _context7.sent;

                  case 3:
                  case 'end':
                    return _context7.stop();
                }
              }
            }, saga, this);
          })
        }, {
          desc: 'should send effectTriggered when put is used',
          finder: function finder(m, i) {
            return i === 3;
          },
          expected: {
            type: 'actionDispatched(XXX)',
            label: 'actionDispatched (XXX)'
          },
          saga: /*#__PURE__*/regeneratorRuntime.mark(function saga() {
            return regeneratorRuntime.wrap(function saga$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return (0, _effects.put)({ type: 'XXX' });

                  case 2:
                  case 'end':
                    return _context8.stop();
                }
              }
            }, saga, this);
          }),
          only: false
        }, {
          desc: 'should send effectTriggered when call is used',
          finder: function finder(m, i) {
            return i === 2;
          },
          expected: {
            type: 'effectTriggered(api)',
            label: 'effectTriggered (api(a,b,42))'
          },
          saga: /*#__PURE__*/regeneratorRuntime.mark(function saga() {
            return regeneratorRuntime.wrap(function saga$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return (0, _effects.call)(api, 'a', 'b', 42);

                  case 2:
                  case 'end':
                    return _context9.stop();
                }
              }
            }, saga, this);
          }),
          only: false
        }, {
          desc: 'should send effectTriggered when fork is used',
          finder: function finder(m, i) {
            return i === 2;
          },
          expected: {
            type: 'effectTriggered(watcher)',
            label: 'effectTriggered (watcher())'
          },
          saga: /*#__PURE__*/regeneratorRuntime.mark(function saga() {
            return regeneratorRuntime.wrap(function saga$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return (0, _effects.fork)( /*#__PURE__*/regeneratorRuntime.mark(function watcher() {
                      return regeneratorRuntime.wrap(function watcher$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                            case 'end':
                              return _context10.stop();
                          }
                        }
                      }, watcher, this);
                    }));

                  case 2:
                  case 'end':
                    return _context11.stop();
                }
              }
            }, saga, this);
          }),
          only: false
        }, {
          desc: 'should send effectTriggered when select is used',
          finder: function finder(m, i) {
            return i === 2;
          },
          expected: {
            type: 'effectTriggered(getValue)',
            label: 'effectTriggered (getValue(42))'
          },
          saga: /*#__PURE__*/regeneratorRuntime.mark(function saga() {
            return regeneratorRuntime.wrap(function saga$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.next = 2;
                    return (0, _effects.select)(function getValue(state, param) {
                      return state.a.value;
                    }, 42);

                  case 2:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, saga, this);
          })
        }].forEach(function (_ref) {
          var expected = _ref.expected,
              desc = _ref.desc,
              saga = _ref.saga,
              only = _ref.only,
              finder = _ref.finder;

          (only ? it.only : it)(desc, function (done) {
            var emitter = (0, _ReduxSagaEmitter2.default)();
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