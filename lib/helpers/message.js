'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = message;
function message(data) {

  if (typeof window === 'undefined') return;

  window.top.postMessage(_extends({
    time: new Date().getTime()
  }, data), '*');
};
module.exports = exports['default'];