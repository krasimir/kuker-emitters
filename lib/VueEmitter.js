'use strict';

exports.__esModule = true;
exports.default = VueEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HOOK_KEY = '__KUKER_VUE_HOOK__';
var detectAttempts = 100;

var detect = function detect(callback) {
  detectAttempts -= 1;

  if (window[HOOK_KEY] && window[HOOK_KEY].listen) {
    callback(null, window[HOOK_KEY]);
  } else {
    if (detectAttempts <= 0) {
      callback('VueEmitter: Kuker extension not installed or it is disabled.');
      return;
    }
    setTimeout(function () {
      return detect(callback);
    }, 100);
  }
};

function VueEmitter() {
  if (typeof window === 'undefined') return;

  var message = (0, _createMessenger2.default)('VueEmitter');
  var send = function send(data) {
    return message((0, _sanitize2.default)(data));
  };

  detect(function (error, hook) {
    if (error) {
      console.error(error);
      return;
    }
    hook.listen(function (type, payload) {
      // console.log(type);
      if (type === 'flush') {
        send({
          type: '@@vue_flush',
          state: payload,
          emitter: 'Vue'
        });
      } else if (type === 'ready') {
        send({
          type: '@@vue_ready',
          version: payload,
          state: {},
          emitter: 'Vue'
        });
      } else if (type === 'vuex:mutation') {
        try {
          send({
            type: '@@vuex_vuex:mutation',
            state: JSON.parse(payload.snapshot),
            mutation: payload.mutation,
            emitter: 'Vuex'
          });
        } catch (error) {
          console.error('VueEmitter: can not JSON.parse the payload of `vuex:mutation` event.');
        }
      } else if (type === 'vuex:init') {
        try {
          send({
            type: '@@vuex_vuex:init',
            state: JSON.parse(payload),
            emitter: 'Vuex'
          });
        } catch (error) {
          console.error('VueEmitter: can not JSON.parse the payload of `vuex:init` event.');
        }
      } else {
        send({
          type: '@@vue_' + type,
          state: payload,
          emitter: 'Vue'
        });
      }
    });
  });
};
module.exports = exports['default'];