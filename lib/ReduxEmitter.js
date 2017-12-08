'use strict';

exports.__esModule = true;
exports.default = ReduxEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _message = require('./helpers/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var icon = 'fa-gear';

function ReduxEmitter() {
  return function middleware(_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;

    var uid = 'redux' + new Date().getTime();

    (0, _message2.default)({ pageRefresh: true, icon: icon }, uid);

    return function (next) {
      return function (action) {
        var result = next(action);

        (0, _message2.default)({
          state: (0, _sanitize2.default)(getState()),
          label: action.type,
          action: (0, _sanitize2.default)(action),
          icon: icon
        }, uid);
        return result;
      };
    };
  };
};
module.exports = exports['default'];