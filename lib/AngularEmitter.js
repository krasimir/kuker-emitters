'use strict';

exports.__esModule = true;
exports.isDebugElementComponent = exports.tokenName = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var CAN_NOT_FIND_ROOT = function CAN_NOT_FIND_ROOT(selector) {
  return 'AngularEmitter: I can not find the Angular root element using the "' + selector + '" selector.';
};
var NOT_IN_DEVELOPMENT_MODE = 'AngularEmitter: Please run Angular in development mode. "ng.probe" is not available.';
var INVALID_ROOT_INSTANCE = 'AngularEmitter: Invalid root instance';
var MISSING_NGZONE = 'AngularEmitter: Missing NgZone in ng.coreTokens';

var throttle = function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;

  var later = function later() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  if (!options) options = {};

  return function () {
    var now = Date.now();

    if (!previous && options.leading === false) previous = now;

    // eslint-disable-next-line
    var remaining = wait - (now - previous);

    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
var validateAPI = function validateAPI() {
  if (typeof window['ng'] === 'undefined' || typeof window['ng'].probe === 'undefined') {
    return false;
  }
  return true;
};
var getClassName = function getClassName(c) {
  if (c && c.constructor && c.constructor.name) {
    return c.constructor.name;
  }
  return 'unknown';
};
var functionName = function functionName(fn) {
  var extract = function extract(value) {
    return value.match(/^function ([^\(]*)\(/);
  };

  var name = fn.name;

  if (name == null || name.length === 0) {
    var match = extract(fn.toString());

    if (match != null && match.length > 1) {
      return match[1];
    }
    return fn.toString();
  }
  return name;
};

var tokenName = exports.tokenName = function tokenName(token) {
  return functionName(token) || token.toString();
};
var componentInstanceExistsInParentChain = function componentInstanceExistsInParentChain(debugElement) {
  var componentInstanceRef = debugElement.componentInstance;

  while (componentInstanceRef && debugElement.parent) {
    if (componentInstanceRef === debugElement.parent.componentInstance) {
      return true;
    }
    debugElement = debugElement.parent;
  }
  return false;
};

var isDebugElementComponent = exports.isDebugElementComponent = function isDebugElementComponent(element) {
  return !!element.componentInstance && !componentInstanceExistsInParentChain(element);
};
var getTree = function getTree(rootInstance) {

  var traverse = function traverse(node) {
    var parentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    // console.log(node);
    var isComponent = isDebugElementComponent(node);
    var providers = node.providerTokens.map(function (t) {
      return [tokenName(t), node.injector.get(t)];
    }).filter(function (provider) {
      return provider[1] !== node.componentInstance;
    }).map(function (provider) {
      return provider[0];
    });
    var item = {
      name: 'unknown',
      props: {},
      state: {},
      children: []
    };

    // name
    if (node.name && !isComponent) {
      item.name = node.name;
    } else if (node.componentInstance) {
      item.name = getClassName(node.componentInstance);
    }
    // props
    if (node.attributes && _typeof(node.attributes) === 'object') {
      for (var prop in node.attributes) {
        item.props[prop] = node.attributes[prop];
      }
    }
    // children
    if (node.children && node.children.length > 0) {
      item.children = node.children.map(function (child) {
        return traverse(child, node.context);
      }).filter(function (child) {
        return !!child;
      });
    }

    if (!isComponent && providers.length === 0) {
      return item;
    }

    // state
    if (node.context && node.context !== parentContext && isComponent) {
      for (var _prop in node.context) {
        item.state[_prop] = node.context[_prop];
      }
    }

    return item;
  };

  var tree = traverse(rootInstance);
  // console.log(tree);
  // console.log(rootInstance);

  return tree;
};
var subscribe = function subscribe(rootInstance, sendMessage) {
  if (!rootInstance) {
    console.error(INVALID_ROOT_INSTANCE);return;
  }
  if (!window['ng'].coreTokens || !window['ng'].coreTokens.NgZone) {
    console.error(MISSING_NGZONE);return;
  }
  var ngZone = rootInstance.injector.get(window['ng'].coreTokens.NgZone);

  if (ngZone) {
    ngZone.onStable.subscribe(throttle(function () {
      return sendMessage('@@angular_onStable');
    }, 800, {}));
    ngZone.onError.subscribe(function () {
      return sendMessage('@@angular_onError');
    });
    ngZone.onMicrotaskEmpty.subscribe(function () {
      return sendMessage('@@angular_onMicrotaskEmpty');
    });
    ngZone.onUnstable.subscribe(function () {
      return sendMessage('@@angular_onUnstable');
    });
  } else {
    console.error(MISSING_NGZONE);return;
  }
};
var AngularEmitter = function AngularEmitter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { rootSelector: 'app-root' };

  var findingRootAttempts = 5;
  var findingNGAPIAttempts = 5;
  var rootElement;
  var api;

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var message = (0, _createMessenger2.default)('AngularEmitter');
  var sendMessage = function sendMessage(data) {
    return message((0, _sanitize2.default)(data));
  };

  var findRoot = function findRoot(callback) {
    findingRootAttempts -= 1;
    rootElement = document.querySelector(options.rootSelector);
    if (rootElement) {
      callback();
    } else {
      if (findingRootAttempts === 0) {
        callback(CAN_NOT_FIND_ROOT(options.rootSelector));
      }
      setTimeout(function () {
        return findRoot(callback);
      }, 1000);
    }
  };
  var findNGAPI = function findNGAPI(callback) {
    findingNGAPIAttempts -= 1;
    api = window['ng'] ? window['ng'].probe : null;
    if (api) {
      callback();
    } else {
      if (findingNGAPIAttempts === 0) {
        callback(NOT_IN_DEVELOPMENT_MODE);
      } else {
        setTimeout(function () {
          return findNGAPI(callback);
        }, 1000);
      }
    }
  };

  findRoot(function (error) {
    if (error) {
      console.error(error);return;
    }
    findNGAPI(function (error) {
      if (error) {
        console.error(error);return;
      }
      var rootInstance = api(rootElement);
      var Router = rootInstance.injector.get(window['ng'].coreTokens.Router);

      if (Router && Router.config) {
        rootInstance.Router = { config: Router.config };
      }
      sendMessage({ type: '@@angular_rootDetected', state: getTree(rootInstance) });
      subscribe(rootInstance, function (type) {
        return sendMessage({ type: type, state: getTree(rootInstance) });
      });
    });
  });
};

exports.default = AngularEmitter;