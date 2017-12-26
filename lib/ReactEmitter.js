'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ReactEmitter;

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Implementation taken from https://github.com/facebook/react-devtools/blob/master/backend/attachRenderer.js#L175-L181
// If this breaks make sure that it is in sync with the original

var tries = 5;

var getTag = function getTag(_ref) {
  var name = _ref.name,
      props = _ref.props;

  return '<' + name + '>';
};

var Node = function Node(data) {
  var _ref2 = data.props || {},
      children = _ref2.children,
      otherProps = _objectWithoutProperties(_ref2, ['children']);

  return {
    name: data.name,
    props: (0, _sanitize2.default)(_extends({}, otherProps)),
    state: (0, _sanitize2.default)(data.state),
    children: []
  };
};

var traverseReactTree = function traverseReactTree(root, renderer, _ref3) {
  var getData = _ref3.getData,
      getData012 = _ref3.getData012,
      getDataFiber = _ref3.getDataFiber,
      getDisplayName = _ref3.getDisplayName;

  if (!root) return {};

  var isPre013 = !renderer.Reconciler;
  var walkNode = function walkNode(internalInstance) {
    var _ref4;

    var data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
    var item = Node(data);

    if (data.children && Array.isArray(data.children)) {
      item.children = data.children.map(function (child) {
        return walkNode(child);
      });
    }
    return _ref4 = {}, _ref4[getTag(data)] = item, _ref4;
  };

  return walkNode(root);
};

var throttle = function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  var throttleMeta = { calls: 0, components: [] };

  var processThrottledCall = function processThrottledCall(_ref5) {
    var data = _ref5.data;

    throttleMeta.calls += 1;
    data && data.name && throttleMeta.components.push(data.name);
  };
  var resetThrottleMeta = function resetThrottleMeta() {
    throttleMeta = { calls: 0, components: [] };
  };
  var later = function later() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, [throttleMeta].concat(args));
    resetThrottleMeta();
    if (!timeout) context = args = null;
  };

  if (!options) options = {};

  return function () {
    var now = Date.now();

    processThrottledCall.apply(undefined, arguments);
    if (!previous && options.leading === false) previous = now;

    var remaining = wait - (now - previous);

    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, [throttleMeta].concat(args));
      resetThrottleMeta();
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

var connect = function connect(callback) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    callback(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
    return;
  }
  if (tries >= 0) {
    tries -= 1;
    setTimeout(function () {
      return connect(callback);
    }, 1500);
  }
};

function ReactEmitter() {
  if (typeof window === 'undefined') return;

  var postMessage = (0, _createMessenger2.default)('ReactEmitter');

  connect(function (hook) {
    var getState = function getState() {
      return {};
    };

    hook.on('renderer-attached', function (attached) {
      var helpers = attached.helpers,
          renderer = attached.renderer;

      var rootNode = null;

      (function findRootNode() {
        helpers.walkTree(function () {}, function (root) {
          var rootData = hook.__helpers.getData(root);

          rootNode = root;
          if (rootData.name === 'TopLevelWrapper' && rootData.children && rootData.children.length === 1) {
            root = rootData.children[0];
          }
          getState = function getState() {
            return (0, _sanitize2.default)(traverseReactTree(root, renderer, hook.__helpers));
          };
          postMessage({
            type: '@@react_root_detected',
            state: getState()
          });
        });
        if (rootNode === null) {
          setTimeout(findRootNode, 300);
        }
      })();
    });
    hook.on('root', throttle(function (_ref6) {
      var calls = _ref6.calls,
          components = _ref6.components;

      postMessage({
        type: '@@react_root',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
    hook.on('mount', throttle(function (_ref7) {
      var calls = _ref7.calls,
          components = _ref7.components;

      postMessage({
        type: '@@react_mount',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
    hook.on('update', throttle(function (_ref8) {
      var calls = _ref8.calls,
          components = _ref8.components;

      postMessage({
        type: '@@react_update',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
    hook.on('unmount', throttle(function (_ref9) {
      var calls = _ref9.calls,
          components = _ref9.components;

      postMessage({
        type: '@@react_unmount',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
  });
};
module.exports = exports['default'];