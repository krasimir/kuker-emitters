'use strict';

var _ = require('../');

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
}; /* eslint-disable no-unused-vars, no-undef */

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

describe('Given the BaseEmitter', function () {
  beforeEach(function () {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('and when we dispatch an event', function () {
    it('should dispatch an event to Kuker extension', function () {
      var emit = (0, _.BaseEmitter)();

      emit({
        type: 'foo',
        state: {
          a: ['b', 'c'],
          someFunc: function AAA() {},
          someGene: /*#__PURE__*/regeneratorRuntime.mark(function BBB() {
            return regeneratorRuntime.wrap(function BBB$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return 'aaa';

                  case 2:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, BBB, this);
          })
        },
        time: new Date().getTime(),
        title: 'aaaa'
      });

      expect(window.top.postMessage).to.be.calledWith({
        kuker: true,
        state: { a: ['b', 'c'], someFunc: 'function AAA()', someGene: 'function BBB()' },
        time: sinon.match.number,
        origin: sinon.match.string,
        title: 'aaaa',
        type: 'foo',
        emitter: 'BaseEmitter'
      }, '*');
    });
  });
});