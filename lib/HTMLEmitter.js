'use strict';

exports.__esModule = true;
exports.default = HTMLEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

var _throttle = require('./helpers/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var detectAttempts = 100;

var detect = function detect(callback) {
  detectAttempts -= 1;
  var root = document && document.documentElement ? document.documentElement : false;

  if (root) {
    callback(null, root);
  } else {
    if (detectAttempts <= 0) {
      callback('HTMLEmitter: document.documentElement is not available');
      return;
    }
    setTimeout(function () {
      return detect(callback);
    }, 100);
  }
};

// credits: https://gist.github.com/sstur/7379870
function toJSON(node) {
  node = node || this;

  var obj = {
    nodeType: node.nodeType
  };

  if (node.tagName) {
    obj.name = node.tagName.toLowerCase();
  } else if (node.nodeName) {
    obj.name = node.nodeName.toLowerCase();
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  var attrs = node.attributes;

  if (attrs) {
    var length = attrs.length;

    obj.props = {};
    for (var i = 0; i < length; i++) {
      var attr = attrs[i];

      obj.props[attr.nodeName] = attr.nodeValue;
    }
  }
  var childNodes = node.childNodes;

  if (childNodes) {
    var _length = childNodes.length;

    obj.children = [];
    for (var _i = 0; _i < _length; _i++) {
      obj.children.push(toJSON(childNodes[_i]));
    }
  }
  return obj;
}

function HTMLEmitter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { throttleTime: 1200 };

  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;

  detect(function (error, root) {
    if (error) {
      console.error(error);return;
    }
    var message = (0, _createMessenger2.default)('HTMLEmitter');
    var send = function send(data) {
      return message((0, _sanitize2.default)(data));
    };

    var observer = new MutationObserver((0, _throttle2.default)(function (mutations) {
      send({ type: '@@HTML_mutation', state: toJSON(root) });
    }, options.throttleTime, {}));

    observer.observe(root, { attributes: true, childList: true, subtree: true });
  });
};
module.exports = exports['default'];