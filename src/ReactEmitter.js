import createMessenger from './helpers/createMessenger';
import sanitize from './helpers/sanitize';

// Implementation taken from https://github.com/facebook/react-devtools/blob/master/backend/attachRenderer.js#L175-L181
// If this breaks make sure that it is in sync with the original

var tries = 5;

export const Node = function (data = {}) {
  // eslint-disable-next-line
  const { children, ...otherProps } = data.props || {};

  return {
    name: data.name,
    props: sanitize({ ...otherProps }),
    state: sanitize(data.state),
    children: []
  };
};

export const traverseReactTree = function (root, renderer, { getData, getData012, getDataFiber, getDisplayName }) {
  if (!root) return {};

  const isPre013 = !renderer.Reconciler;
  const walkNode = function (internalInstance) {
    const data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
    var item = Node(data);

    if (data.children && Array.isArray(data.children)) {
      item.children = data.children.map(child => walkNode(child));
    }
    return item;
  };

  return walkNode(root);
};

export const throttle = function (func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  var throttleMeta = { calls: 0, components: [] };

  var processThrottledCall = function ({ data }) {
    throttleMeta.calls += 1;
    data && data.name && throttleMeta.components.push(data.name);
  };
  var resetThrottleMeta = function () {
    throttleMeta = { calls: 0, components: [] };
  };
  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, [throttleMeta, ...args]);
    resetThrottleMeta();
    if (!timeout) context = args = null;
  };

  if (!options) options = {};

  return function () {
    var now = Date.now();

    processThrottledCall(...arguments);
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
      result = func.apply(context, [throttleMeta, ...args]);
      resetThrottleMeta();
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

const connect = function (callback) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    callback(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
    return;
  }
  if (tries >= 0) {
    tries -= 1;
    setTimeout(() => connect(callback), 1500);
  }
};

export default function ReactEmitter() {
  if (typeof window === 'undefined') return;

  const postMessage = createMessenger('ReactEmitter');

  connect(hook => {
    var getState = () => ({});

    hook.on('renderer-attached', function (attached) {
      const { helpers, renderer } = attached;
      var rootNode = null;

      (function findRootNode() {
        helpers.walkTree(() => {}, function (root) {
          const rootData = hook.__helpers.getData(root);

          rootNode = root;
          if (rootData.name === 'TopLevelWrapper' && rootData.children && rootData.children.length === 1) {
            root = rootData.children[0];
          }
          getState = () => sanitize(traverseReactTree(root, renderer, hook.__helpers));
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
    hook.on('root', throttle(({ calls, components }) => {
      postMessage({
        type: '@@react_root',
        state: getState(),
        calls,
        components
      });
    }), 100);
    hook.on('mount', throttle(({ calls, components }) => {
      postMessage({
        type: '@@react_mount',
        state: getState(),
        calls,
        components
      });
    }), 100);
    hook.on('update', throttle(({ calls, components }) => {
      postMessage({
        type: '@@react_update',
        state: getState(),
        calls,
        components
      });
    }), 100);
    hook.on('unmount', throttle(({ calls, components }) => {
      postMessage({
        type: '@@react_unmount',
        state: getState(),
        calls,
        components
      });
    }), 100);
  });
};
