/* eslint-disable vars-on-top */
export const PORT = 8228;
const KUKER_EVENT = 'kuker-event';
const NODE_ORIGIN = `node (PORT: ${ PORT })`;

const isDefined = what => typeof what !== 'undefined';

function getOrigin() {
  if (isDefined(location) && isDefined(location.protocol) && isDefined(location.host)) {
    return location.protocol + '//' + location.host;
  }
  return 'unknown';
}

var messagesBeforeSetup = [];
var connections = null;
var app = null;
var isThereAnySocketServer = () => app !== null;
var isTheServerReady = false;

export default function createMessenger(emitterName, emitterDescription = '') {

  function enhanceEvent(origin, data) {
    return {
      kuker: true,
      time: (new Date()).getTime(),
      origin,
      emitter: emitterName,
      ...data
    };
  }
  const socketPostMessage = function (data) {
    if (isThereAnySocketServer() && connections !== null) {
      Object.keys(connections).forEach(
        id => connections[id].emit(KUKER_EVENT, [ enhanceEvent(NODE_ORIGIN, data) ])
      );
    } else {
      messagesBeforeSetup.push(data);
    }
  };
  const browserPostMessage = function (data) {
    window.postMessage(enhanceEvent(getOrigin(), data), '*');
  };

  // in node
  if (typeof window === 'undefined') {
    if (isThereAnySocketServer()) {
      socketPostMessage({ type: 'NEW_EMITTER', emitterDescription });
    } else {
      if (isTheServerReady) {
        return socketPostMessage;
      }
      const r = 'require';
      const socketIO = module[r]('socket.io');
      const http = module[r]('http');

      app = http.createServer(function (req, res) {
        res.writeHead(200);
        res.end('Kuker: Hi!');
      });
      const io = socketIO(app);

      io.on('connection', function (socket) {
        if (connections === null) connections = {};
        connections[socket.id] = socket;
        socket.on('disconnect', reason => {
          delete connections[socket.id];
        });
        // the very first client receives the pending messages
        // for the rest ... sorry :)
        if (messagesBeforeSetup.length > 0) {
          socketPostMessage({ type: 'NEW_EMITTER', emitterDescription });
          messagesBeforeSetup.forEach(data => socketPostMessage(data));
          messagesBeforeSetup = [];
        }
        console.log(`Kuker(Messenger): client connected (${ Object.keys(connections).length } in total)`);
      });

      app.listen(PORT);
      isTheServerReady = true;
      console.log(`Kuker(Messenger): server running at ${ PORT }`);
    }

    return socketPostMessage;
  }

  // in the browser
  browserPostMessage({ type: 'NEW_EMITTER', emitterDescription });
  return browserPostMessage;
};
