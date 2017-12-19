'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = message;

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOrigin() {
  if (typeof location !== 'undefined' && location.protocol && location.host && location.pathname) {
    return location.protocol + '//' + location.host;
  }
  return '';
}

function message(data) {
  if (typeof window === 'undefined') {
    (0, _socket2.default)(data);
    return;
  }

  window.postMessage(_extends({
    kuker: true,
    time: new Date().getTime(),
    origin: getOrigin()
  }, data), '*');
};
module.exports = exports['default'];