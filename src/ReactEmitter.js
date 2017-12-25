import createMessenger from './helpers/createMessenger';
import sanitize from './helpers/sanitize';

// Implementation taken from https://github.com/facebook/react-devtools/blob/master/backend/attachRenderer.js#L175-L181
// If this breaks make sure that it is in sync with the original
const getTag = function ({ name, props }) {
  return `<${ name }>`;
};
const Node = function (data) {
  const { children, ...otherProps } = data.props;

  return {
    name: data.name,
    props: sanitize({ ...otherProps }),
    state: sanitize(data.state),
    children: []
  };
};
const traverseReactTree = function (root, renderer, { getData, getData012, getDataFiber, getDisplayName }) {
  if (!root) return {};

  const isPre013 = !renderer.Reconciler;
  const walkNode = function (internalInstance) {
    const data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
    var item = Node(data);

    if (data.children && Array.isArray(data.children)) {
      item.children = data.children.map(child => walkNode(child));
    }
    return {
      [getTag(data)]: item
    };
  };

  return walkNode(root);
};

export default function ReactEmitter() {
  if (typeof window === 'undefined') return;

  const postMessage = createMessenger('ReactEmitter');
  const throttle = function (func, wait, options) {
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
  
  var tries = 5;

  const connect = function (callback) {
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      callback(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
      return;
    }
    if (tries >= 0) {
      tries -= 1;
      setTimeout(() => connect(callback), 1500);
    }
  }
  
  connect(hook => {
    var getState = null;

    hook.on('renderer-attached', function (attached) {
      const { helpers, renderer } = attached;

      helpers.walkTree(function (item, data) {
        // console.log(data);
      }, function (root) {
        const rootData = hook.__helpers.getData(root);

        if (rootData.name === 'TopLevelWrapper' && rootData.children && rootData.children.length === 1) {
          root = rootData.children[0];
        }
        getState = () => sanitize(traverseReactTree(root, renderer, hook.__helpers));
        console.log('Tree: ', getState());
        postMessage({
          type: '@@react_root_detected',
          state: getState()
        });
      });
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
