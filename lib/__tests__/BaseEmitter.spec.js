'use strict';

var _BaseEmitter = require('../BaseEmitter');

var _BaseEmitter2 = _interopRequireDefault(_BaseEmitter);

var _guard = require('../helpers/guard');

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

describe('Given the BaseEmitter', function () {
  before(function () {
    window[_guard.ID] = true;
  });
  after(function () {
    window[_guard.ID] = false;
  });
  beforeEach(function () {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('and when we dispatch an event', function () {
    it('should dispatch an event to Kuker extension', function () {
      var emit = (0, _BaseEmitter2.default)();

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
        state: { a: ['b', 'c'], someFunc: { __func: 'AAA' }, someGene: { __func: 'BBB' } },
        time: sinon.match.number,
        origin: sinon.match.string,
        kuker: true,
        title: 'aaaa',
        type: 'foo'
      }, '*');
    });
  });
});