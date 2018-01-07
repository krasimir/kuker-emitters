'use strict';

exports.__esModule = true;

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

var AUGURY_TOKEN_ID_METADATA_KEY = '__augury_token_id';

/* ***************************************** HELPERS ***************************************** */
/* ******************************************************************************************* */
/* ******************************************************************************************* */
/* ******************************************************************************************* */

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
var tokenName = function tokenName(token) {
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
var isDebugElementComponent = function isDebugElementComponent(element) {
  return !!element.componentInstance && !componentInstanceExistsInParentChain(element);
};
var getComponentName = function getComponentName(element) {
  if (element.componentInstance && element.componentInstance.constructor && !componentInstanceExistsInParentChain(element)) {
    return functionName(element.componentInstance.constructor);
  } else if (element.name) {
    return element.name;
  }

  return element.nativeElement.tagName.toLowerCase();
};
var getComponentProviders = function getComponentProviders(element, name) {
  var providers = [];

  if (element.providerTokens && element.providerTokens.length > 0) {
    providers = element.providerTokens.map(function (t) {
      return [tokenName(t), element.injector.get(t)];
    }).filter(function (provider) {
      return provider[1] !== element.componentInstance;
    }).map(function (provider) {
      return provider[0];
    });
  }
  return providers;
};
var injectedParameterDecorators = function injectedParameterDecorators(instance) {
  return Reflect.getOwnMetadata('parameters', instance.constructor) || [];
};
var parameterTypes = function parameterTypes(instance) {
  return Reflect.getOwnMetadata('design:paramtypes', instance.constructor) || [];
};
var getDependencies = function getDependencies(instance) {
  var parameterDecorators = injectedParameterDecorators(instance);
  var normalizedParamTypes = parameterTypes(instance).map(function (type, i) {
    return type ? type : parameterDecorators[i].filter(function (decorator) {
      return decorator.toString() === '@Inject';
    })[0].token;
  });

  return normalizedParamTypes.map(function (paramType, i) {
    return {
      id: Reflect.getMetadata(AUGURY_TOKEN_ID_METADATA_KEY, paramType),
      name: functionName(paramType) || paramType.toString(),
      decorators: parameterDecorators[i] ? parameterDecorators[i].map(function (d) {
        return d.toString();
      }) : []
    };
  });
};

/* ***************************************** Kuker specific ********************************** */
/* ******************************************************************************************* */
/* ******************************************************************************************* */
/* ******************************************************************************************* */

var getTree = function getTree(rootInstance) {

  var traverse = function traverse(element) {
    var parentContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var name = getComponentName(element);
    var isComponent = isDebugElementComponent(element);
    var providers = getComponentProviders(element);
    var item = {
      name: name,
      providers: providers,
      props: {},
      state: {},
      children: [],
      dependencies: isDebugElementComponent(element) ? getDependencies(element.componentInstance) : []
    };

    // props
    if (element.attributes && _typeof(element.attributes) === 'object') {
      for (var prop in element.attributes) {
        item.props[prop] = element.attributes[prop];
      }
    }
    // children
    if (element.children && element.children.length > 0) {
      item.children = element.children.map(function (child) {
        return traverse(child, element.context);
      }).filter(function (child) {
        return !!child;
      });
    }

    if (!isComponent && providers.length === 0) {
      return item;
    }

    // state
    if (element.context && element.context !== parentContext && isComponent) {
      for (var _prop in element.context) {
        item.state[_prop] = element.context[_prop];
      }
    }

    return item;
  };

  console.log(traverse(rootInstance));
  return traverse(rootInstance);
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

      sendMessage({
        type: '@@angular_rootDetected',
        state: getTree(rootInstance),
        Router: Router && Router.config ? { config: Router.config } : null
      });
      subscribe(rootInstance, function (type) {
        return sendMessage({ type: type, state: getTree(rootInstance) });
      });
    });
  });
};

exports.default = AngularEmitter;
module.exports = exports['default'];