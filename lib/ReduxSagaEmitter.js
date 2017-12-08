'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable max-len */


var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _message = require('./helpers/message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var icon = 'fa-caret-right';
var color = '#f7f5e3';
var uid = 'redux';

var store = null;

var getState = function getState() {
  if (store) return store.getState();
  return { '<unknown>': 'Please check https://github.com/krasimir/stent-dev-tools-emitters to learn how to get the state in here.' };
};

var sendMessage = function sendMessage(data) {
  (0, _message2.default)(_extends({
    state: (0, _sanitize2.default)(getState()),
    icon: icon,
    color: color
  }, data), uid);
};

var getEffectName = function getEffectName(effect) {
  if (effect && (typeof effect === 'undefined' ? 'undefined' : _typeof(effect)) === 'object') {
    if (effect.root === true) {
      return 'root';
    }
    var keys = Object.keys(effect).filter(function (key) {
      return key.indexOf('@@') < 0;
    });

    if (keys.length > 0) return keys[0];
  }
  return null;
};

var Emitter = function Emitter() {
  (0, _message2.default)({ pageRefresh: true, icon: icon, color: color }, uid);

  return {
    sagaMonitor: {
      effectTriggered: function effectTriggered(_ref) {
        var effectId = _ref.effectId,
            parentEffectId = _ref.parentEffectId,
            label = _ref.label,
            effect = _ref.effect;

        sendMessage({
          label: 'effectTriggered',
          effectName: getEffectName(effect),
          action: (0, _sanitize2.default)({
            effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect
          })
        });
      },
      effectResolved: function effectResolved(effectId, result) {
        sendMessage({
          label: 'effectResolved',
          effect: result && result.name,
          action: (0, _sanitize2.default)({
            effectId: effectId, result: result
          })
        });
      },
      effectRejected: function effectRejected(effectId, error) {
        sendMessage({
          label: 'effectRejected',
          action: (0, _sanitize2.default)({
            effectId: effectId, error: error
          })
        });
      },
      effectCancelled: function effectCancelled(effectId) {
        sendMessage({
          label: 'effectCancelled',
          action: (0, _sanitize2.default)({
            effectId: effectId
          })
        });
      },
      actionDispatched: function actionDispatched(action) {
        sendMessage({
          label: 'actionDispatched',
          action: (0, _sanitize2.default)({
            action: action
          })
        });
      }
    },
    setStore: function setStore(s) {
      return store = s;
    }
  };
};

exports.default = Emitter;
module.exports = exports['default'];