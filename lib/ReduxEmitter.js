'use strict';

exports.__esModule = true;
exports.default = ReduxEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NOOP = function NOOP() {
  return function (noop) {
    return noop;
  };
};

function ReduxEmitter() {
  var message = (0, _createMessenger2.default)('ReduxEmitter', 'Redux library');

  return function middleware(_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;

    return function (next) {
      return function (action) {
        var result = next(action);

        message({
          state: (0, _sanitize2.default)(getState()),
          type: '@redux_ACTION',
          action: (0, _sanitize2.default)(action)
        });
        return result;
      };
    };
  };
};
module.exports = exports['default'];