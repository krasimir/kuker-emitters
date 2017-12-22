'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = MobXEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MobXEmitter(spy, stores) {
  var message = (0, _createMessenger2.default)('MobXEmitter');
  var emit = function emit(data) {
    return message((0, _sanitize2.default)(data));
  };
  var state = stores.reduce(function (result, store) {
    result[store.constructor.name] = store;
    return result;
  }, {});
  var indent = 0;

  spy(function (event) {
    var type = '@mobx_' + (event.type || 'spyReportEnd');

    if (event.spyReportEnd) indent -= 1;

    emit({
      type: type,
      state: state,
      event: _extends({}, event, { indent: indent })
    });

    if (event.spyReportStart) indent += 1;
  });
};
module.exports = exports['default'];