'use strict';

exports.__esModule = true;
exports.default = MachinaEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MachinaEmitter(machine) {
  var message = (0, _createMessenger2.default)('MachinaEmitter');

  machine.on('*', function (eventName, data) {
    message({
      type: 'Machina_' + eventName,
      label: typeof machine.state === 'string' ? machine.state : '',
      state: (0, _sanitize2.default)(machine.state),
      data: (0, _sanitize2.default)(data)
    });
  });
};
module.exports = exports['default'];