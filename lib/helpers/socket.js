'use strict';

exports.__esModule = true;
exports.default = postMessageViaSocket;
/* eslint-disable no-use-before-define */

var PORT = exports.PORT = 8228;
var KUKER_EVENT = 'kuker-event';
var ORIGIN = 'node (PORT: ' + PORT + ')';
var NEW_SESSION_EVENT = function NEW_SESSION_EVENT() {
  return {
    kuker: true,
    type: 'NEW_SESSION',
    origin: ORIGIN
  };
};
var connections = {};

var S = {
  state: 'setup',
  messages: [],
  log: function log(what) {
    console.log(what);
  },
  postMessage: function postMessage(message) {
    var self = this;
    // console.log(this.state, message);

    if (this.state === 'ready') {
      Object.keys(connections).forEach(function (id) {
        return connections[id].emit(KUKER_EVENT, [message]);
      });
      this.messages.push(message);
      return;
    };
    if (this.state === 'setup-in-progress') {
      this.messages.push(message);
      return;
    }
    this.messages.push(message);
    this.state = 'setup-in-progress';

    // *************************************** socket.io integration
    var r = 'require';
    var socketIO = module[r]('socket.io');
    var http = module[r]('http');

    var app = http.createServer(function (req, res) {
      res.writeHead(200);
      res.end('Hello world');
    });
    var io = socketIO(app);

    io.on('connection', function (socket) {
      connections[socket.id] = socket;
      socket.on('disconnect', function (reason) {
        delete connections[socket.id];
      });
      socket.emit(KUKER_EVENT, [NEW_SESSION_EVENT()].concat(S.messages));
      // socket.on('received', () => console.log('received'));
    });

    // this.log('Kuker Emitter socket server works at ' + PORT + ' port.');
    app.listen(PORT);

    // *************************************** socket.io integration

    this.state = 'ready';
    this.messages.forEach(function (message) {
      self.postMessage(message);
    });
  }
};

function postMessageViaSocket(message) {
  S.postMessage(message);
};
postMessageViaSocket.origin = ORIGIN;