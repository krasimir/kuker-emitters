'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createMessenger;
/* eslint-disable vars-on-top */
var PORT = exports.PORT = 8228;
var KUKER_EVENT = 'kuker-event';
var NODE_ORIGIN = 'node (PORT: ' + PORT + ')';

var isDefined = function isDefined(what) {
  return typeof what !== 'undefined';
};

function getOrigin() {
  if (isDefined(location) && isDefined(location.protocol) && isDefined(location.host)) {
    return location.protocol + '//' + location.host;
  }
  return 'unknown';
}

var messagesBeforeSetup = [];
var connections = null;
var app = null;
var isThereAnySocketServer = function isThereAnySocketServer() {
  return app !== null;
};
var isTheServerReady = false;

function createMessenger(emitterName) {
  var emitterDescription = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


  function enhanceEvent(origin, data) {
    return _extends({
      kuker: true,
      time: new Date().getTime(),
      origin: origin,
      emitter: emitterName
    }, data);
  }
  var socketPostMessage = function socketPostMessage(data) {
    if (isThereAnySocketServer() && connections !== null) {
      Object.keys(connections).forEach(function (id) {
        return connections[id].emit(KUKER_EVENT, [enhanceEvent(NODE_ORIGIN, data)]);
      });
    } else {
      messagesBeforeSetup.push(data);
    }
  };
  var browserPostMessage = function browserPostMessage(data) {
    window.postMessage(enhanceEvent(getOrigin(), data), '*');
  };

  // in node
  if (typeof window === 'undefined') {
    if (isThereAnySocketServer()) {
      socketPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
    } else {
      if (isTheServerReady) {
        return socketPostMessage;
      }
      var r = 'require';
      var socketIO = module[r]('socket.io');
      var http = module[r]('http');

      app = http.createServer(function (req, res) {
        res.writeHead(200);
        res.end('Kuker: Hi!');
      });
      var io = socketIO(app);

      io.on('connection', function (socket) {
        if (connections === null) connections = {};
        connections[socket.id] = socket;
        socket.on('disconnect', function (reason) {
          delete connections[socket.id];
        });
        // the very first client receives the pending messages
        // for the rest ... sorry :)
        if (messagesBeforeSetup.length > 0) {
          socketPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
          messagesBeforeSetup.forEach(function (data) {
            return socketPostMessage(data);
          });
          messagesBeforeSetup = [];
        }
        console.log('Kuker(Messenger): client connected (' + Object.keys(connections).length + ' in total)');
      });

      app.listen(PORT);
      isTheServerReady = true;
      console.log('Kuker(Messenger): server running at ' + PORT);
    }

    return socketPostMessage;
  }

  // in the browser
  browserPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
  return browserPostMessage;
};