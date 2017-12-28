'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable max-len */


exports.default = ReduxSagaEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = null;

var getState = function getState() {
  if (store) return store.getState();
  return { '<unknown>': 'You forgot to call `emitter.setStore(<your store>)`. Please check https://github.com/krasimir/kuker-emitters' };
};

var NOOP = { sagaMonitor: null, setStore: function setStore() {} };

function ReduxSagaEmitter() {
  var message = (0, _createMessenger2.default)('ReduxEmitter', 'Redux-Saga library');
  var sendMessage = function sendMessage(data) {
    message(_extends({
      state: (0, _sanitize2.default)(getState())
    }, data));
  };

  return {
    sagaMonitor: {
      effectTriggered: function effectTriggered(_ref) {
        var effectId = _ref.effectId,
            parentEffectId = _ref.parentEffectId,
            label = _ref.label,
            effect = _ref.effect;

        sendMessage(_extends({
          type: '@saga_effectTriggered'
        }, (0, _sanitize2.default)({ effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect })));
      },
      effectResolved: function effectResolved(effectId, result) {
        sendMessage(_extends({
          type: '@saga_effectResolved'
        }, (0, _sanitize2.default)({ effectId: effectId, result: result })));
      },
      effectRejected: function effectRejected(effectId, error) {

        sendMessage(_extends({
          type: '@saga_effectRejected'
        }, (0, _sanitize2.default)({ effectId: effectId, error: error })));
      },
      effectCancelled: function effectCancelled(effectId) {
        sendMessage({
          type: '@saga_effectCancelled',
          effectId: effectId
        });
      },
      actionDispatched: function actionDispatched(action) {
        sendMessage(_extends({
          type: '@saga_actionDispatched'
        }, (0, _sanitize2.default)({ action: action })));
      }
    },
    setStore: function setStore(s) {
      store = s;
    }
  };
};
module.exports = exports['default'];