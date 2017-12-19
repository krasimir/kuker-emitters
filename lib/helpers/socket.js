'use strict';

exports.__esModule = true;
exports.PORT = undefined;
exports.default = postMessageViaSocket;

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-use-before-define */
var PORT = exports.PORT = 8228;
var KUKER_EVENT = 'kuker-event';
var NEW_SESSION_EVENT = {
  type: 'NEW_SESSION',
  kuker: true,
  time: new Date().getTime(),
  origin: 'node (PORT: ' + PORT + ')'
};
var connections = {};
var app = _http2.default.createServer(function (req, res) {
  res.writeHead(200);
  res.end('Add http://localhost:' + PORT + '/socket.io/socket.io.js to your page.');
});
var io = (0, _socket2.default)(app);

io.on('connection', function (socket) {
  connections[socket.id] = socket;
  socket.on('disconnect', function (reason) {
    delete connections[socket.id];
  });
  socket.emit(KUKER_EVENT, [NEW_SESSION_EVENT].concat(S.messages));
  // socket.on('received', () => console.log('received'));
});

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
    this.log('Kuker Emitter socket server works at ' + PORT + ' port.');
    app.listen(PORT);
    this.state = 'ready';
    this.messages.forEach(function (message) {
      self.postMessage(message);
    });
  }
};

function postMessageViaSocket(message) {
  S.postMessage(message);
};