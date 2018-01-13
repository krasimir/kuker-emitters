import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';
import throttle from './helpers/throttle';

var detectAttempts = 100;

const detect = function (callback) {
  detectAttempts -= 1;
  const root = document && document.documentElement ? document.documentElement : false;

  if (root) {
    callback(null, root);
  } else {
    if (detectAttempts <= 0) {
      callback('HTMLEmitter: document.documentElement is not available');
      return;
    }
    setTimeout(() => detect(callback), 100);
  }
};

// credits: https://gist.github.com/sstur/7379870
function toJSON(node) {
  node = node || this;

  const obj = {
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
  const attrs = node.attributes;

  if (attrs) {
    let length = attrs.length;

    obj.props = {};
    for (let i = 0; i < length; i++) {
      let attr = attrs[i];

      obj.props[attr.nodeName] = attr.nodeValue;
    }
  }
  const childNodes = node.childNodes;

  if (childNodes) {
    const length = childNodes.length;

    obj.children = [];
    for (let i = 0; i < length; i++) {
      obj.children.push(toJSON(childNodes[i]));
    }
  }
  return obj;
}

export default function HTMLEmitter(options = { throttleTime: 1200 }) {
  if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return;

  detect((error, root) => {
    if (error) {
      console.error(error); return;
    }
    const message = createMessenger('HTMLEmitter');
    const send = data => message(sanitize(data));

    const observer = new MutationObserver(throttle(mutations => {
      send({ type: '@@HTML_mutation', state: toJSON(root) });
    }, options.throttleTime, {}));

    observer.observe(root, { attributes: true, childList: true, subtree: true });
  });
};
