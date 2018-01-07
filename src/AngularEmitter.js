import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

/* eslint-disable max-len */
const CAN_NOT_FIND_ROOT = selector => `AngularEmitter: I can not find the Angular root element using the "${ selector }" selector.`;
const NOT_IN_DEVELOPMENT_MODE = 'AngularEmitter: Please run Angular in development mode. "ng.probe" is not available.';
const INVALID_ROOT_INSTANCE = 'AngularEmitter: Invalid root instance';
const MISSING_NGZONE = 'AngularEmitter: Missing NgZone in ng.coreTokens';

const throttle = function (func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;

  var later = function () {
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
const validateAPI = function () {
  if (typeof window['ng'] === 'undefined' || typeof window['ng'].probe === 'undefined') {
    return false;
  }
  return true;
};
const getClassName = function (c) {
  if (c && c.constructor && c.constructor.name) {
    return c.constructor.name;
  }
  return 'unknown';
};
const functionName = (fn) => {
  const extract = (value) => value.match(/^function ([^\(]*)\(/);

  let name = fn.name;

  if (name == null || name.length === 0) {
    const match = extract(fn.toString());

    if (match != null && match.length > 1) {
      return match[1];
    }
    return fn.toString();
  }
  return name;
};

export const tokenName = token => functionName(token) || token.toString();
const componentInstanceExistsInParentChain = (debugElement) => {
  const componentInstanceRef = debugElement.componentInstance;

  while (componentInstanceRef && debugElement.parent) {
    if (componentInstanceRef === debugElement.parent.componentInstance) {
      return true;
    }
    debugElement = debugElement.parent;
  }
  return false;
};

export const isDebugElementComponent = (element) => !!element.componentInstance &&
  !componentInstanceExistsInParentChain(element);
const getTree = function (rootInstance) {

  const traverse = function (node, parentContext = null) {
    // console.log(node);
    const isComponent = isDebugElementComponent(node);
    const providers =
      node.providerTokens
        .map(t => [tokenName(t), node.injector.get(t)])
        .filter(provider => provider[1] !== node.componentInstance)
        .map(provider => provider[0]);
    const item = {
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
    if (node.attributes && typeof node.attributes === 'object') {
      for (let prop in node.attributes) {
        item.props[prop] = node.attributes[prop];
      }
    }
    // children
    if (node.children && node.children.length > 0) {
      item.children = node.children
        .map(child => traverse(child, node.context))
        .filter(child => !!child);
    }

    if (!isComponent && providers.length === 0) {
      return item;
    }

    // state
    if (node.context && node.context !== parentContext && isComponent) {
      for (let prop in node.context) {
        item.state[prop] = node.context[prop];
      }
    }

    return item;
  };

  const tree = traverse(rootInstance);
  // console.log(tree);
  // console.log(rootInstance);

  return tree;
};
const subscribe = function (rootInstance, sendMessage) {
  if (!rootInstance) {
    console.error(INVALID_ROOT_INSTANCE); return;
  }
  if (!window['ng'].coreTokens || !window['ng'].coreTokens.NgZone) {
    console.error(MISSING_NGZONE); return;
  }
  const ngZone = rootInstance.injector.get(window['ng'].coreTokens.NgZone);

  if (ngZone) {
    ngZone.onStable.subscribe(throttle(() => sendMessage('@@angular_onStable'), 800, {}));
    ngZone.onError.subscribe(() => sendMessage('@@angular_onError'));
    ngZone.onMicrotaskEmpty.subscribe(() => sendMessage('@@angular_onMicrotaskEmpty'));
    ngZone.onUnstable.subscribe(() => sendMessage('@@angular_onUnstable'));
  } else {
    console.error(MISSING_NGZONE); return;
  }
};
const AngularEmitter = function (options = { rootSelector: 'app-root' }) {
  var findingRootAttempts = 5;
  var findingNGAPIAttempts = 5;
  var rootElement;
  var api;

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const message = createMessenger('AngularEmitter');
  const sendMessage = data => message(sanitize(data));

  const findRoot = function (callback) {
    findingRootAttempts -= 1;
    rootElement = document.querySelector(options.rootSelector);
    if (rootElement) {
      callback();
    } else {
      if (findingRootAttempts === 0) {
        callback(CAN_NOT_FIND_ROOT(options.rootSelector));
      }
      setTimeout(() => findRoot(callback), 1000);
    }
  };
  const findNGAPI = function (callback) {
    findingNGAPIAttempts -= 1;
    api = window['ng'] ? window['ng'].probe : null;
    if (api) {
      callback();
    } else {
      if (findingNGAPIAttempts === 0) {
        callback(NOT_IN_DEVELOPMENT_MODE);
      } else {
        setTimeout(() => findNGAPI(callback), 1000);
      }
    }
  };

  findRoot(error => {
    if (error) {
      console.error(error); return;
    }
    findNGAPI(error => {
      if (error) {
        console.error(error); return;
      }
      const rootInstance = api(rootElement);
      const Router = rootInstance.injector.get(window['ng'].coreTokens.Router);

      sendMessage({
        type: '@@angular_rootDetected',
        state: getTree(rootInstance),
        Router: Router && Router.config ? { config: Router.config } : null
      });
      subscribe(rootInstance, type => sendMessage({ type, state: getTree(rootInstance) }));
    });
  });
};

export default AngularEmitter;
