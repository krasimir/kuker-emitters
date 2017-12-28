'use strict';

var _sanitize = require('../sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCircular = function getCircular() {
  var object = {};

  object.arr = [object, object];
  object.arr.push(object.arr);
  object.obj = object;
  return object;
};

describe('When using the `sanitize` helper', function () {
  describe('and we pass data to it', function () {
    [{
      data: null,
      expected: null
    }, {
      data: 'a string',
      expected: 'a string'
    }, {
      data: {
        foo: 'bar',
        bar: ['foo']
      },
      expected: {
        foo: 'bar',
        bar: ['foo']
      }
    }, {
      data: {
        foo: {
          zoo: function zoo() {}
        },
        bar: [/*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }), new Promise(function () {}), function () {}, new Error('Ops')]
      },
      expected: sinon.match({
        foo: { zoo: 'function zoo()' },
        bar: ['function _callee()', {}, '<anonymous>', sinon.match({
          message: 'Ops',
          name: 'Error'
        })]
      })
    }, {
      data: { bar: 10, foo: getCircular() },
      expected: {
        bar: 10,
        foo: {
          arr: ['<circular>', '<circular>', '<circular>'],
          obj: '<circular>'
        }
      }
    }].forEach(function (testCase, i) {
      it('should satisfy test case #' + i, function () {
        var spy = sinon.spy();

        // console.log(sanitize(testCase.data, true));
        spy((0, _sanitize2.default)(testCase.data, true));
        expect(spy).to.be.calledWith(testCase.expected);
      });
    });
  });
});