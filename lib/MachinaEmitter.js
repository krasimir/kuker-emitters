'use strict';

exports.__esModule = true;
exports.default = MachinaEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _message = require('./helpers/message');

var _message2 = _interopRequireDefault(_message);

var _guard = require('./helpers/guard');

var _guard2 = _interopRequireDefault(_guard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MachinaEmitter(machine) {
  if (!(0, _guard2.default)()) return;

  machine.on('*', function (eventName, data) {
    (0, _message2.default)({
      type: 'Machina_' + eventName,
      label: typeof machine.state === 'string' ? machine.state : '',
      state: (0, _sanitize2.default)(machine.state),
      data: (0, _sanitize2.default)(data)
    });
  });
};
module.exports = exports['default'];