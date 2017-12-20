'use strict';

exports.__esModule = true;
exports.default = postMessageViaSocket;
/* eslint-disable no-use-before-define */

var PORT = exports.PORT = 8228;
var KUKER_EVENT = 'kuker-event';
var ORIGIN = 'node (PORT: ' + PORT + ')';
var connections = {};

var S = {
  state: 'setup',
  log: function log(what) {
    console.log(what);
  },
  postMessage: function postMessage(message) {
    if (this.state === 'ready') {
      Object.keys(connections).forEach(function (id) {
        return connections[id].emit(KUKER_EVENT, [message]);
      });
      return;
    };
    if (this.state === 'setup-in-progress') {
      return;
    }
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
      // socket.on('received', () => console.log('received'));
    });

    // this.log('Kuker Emitter socket server works at ' + PORT + ' port.');
    app.listen(PORT);

    // *************************************** socket.io integration

    this.state = 'ready';
  }
};

function postMessageViaSocket(message) {
  S.postMessage(message);
};
postMessageViaSocket.origin = ORIGIN;