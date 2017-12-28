'use strict';

var _redux = require('redux');

var _ = require('../');

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

describe('Given the ReduxEmitter', function () {
  beforeEach(function () {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('when adding the emitter as a Redux middleware', function () {
    describe('and when we dispatch an action', function () {
      it('should dispatch an event to Kuker extension', function () {
        var middleware = (0, _.ReduxEmitter)();
        var store = (0, _redux.createStore)(counter, (0, _redux.applyMiddleware)(middleware));

        store.dispatch({ type: 'INCREMENT', with: 42, b: function b() {} });

        expect(window.top.postMessage).to.be.calledWith({
          action: { b: 'function b()', type: 'INCREMENT', with: 42 },
          type: '@redux_ACTION',
          state: { a: { value: 42 }, b: [1, 2, 3, 4], c: 'function c()', d: 'function d()' },
          time: sinon.match.number,
          origin: sinon.match.string,
          kuker: true,
          emitter: 'ReduxEmitter'
        });
      });
    });
  });
});