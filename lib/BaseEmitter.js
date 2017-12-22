'use strict';

exports.__esModule = true;
exports.default = BaseEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BaseEmitter() {
  var message = (0, _createMessenger2.default)('BaseEmitter');

  return function (data) {
    return message((0, _sanitize2.default)(data));
  };
};
module.exports = exports['default'];