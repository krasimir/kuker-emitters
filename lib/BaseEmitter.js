'use strict';

exports.__esModule = true;
exports.default = BaseEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _message = require('./helpers/message');

var _message2 = _interopRequireDefault(_message);

var _guard = require('./helpers/guard');

var _guard2 = _interopRequireDefault(_guard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NOOP = function NOOP() {};

function BaseEmitter() {
  return (0, _guard2.default)() ? function (data) {
    return (0, _message2.default)((0, _sanitize2.default)(data));
  } : NOOP;
};
module.exports = exports['default'];