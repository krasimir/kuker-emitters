/* eslint-disable no-use-before-define */

export const PORT = 8228;
const KUKER_EVENT = 'kuker-event';
const NEW_SESSION_EVENT = {
  type: 'NEW_SESSION',
  kuker: true,
  time: (new Date()).getTime(),
  origin: `node (PORT: ${ PORT })`
};
const connections = {};

const S = {
  state: 'setup',
  messages: [],
  log(what) {
    console.log(what);
  },
  postMessage(message) {
    var self = this;
    // console.log(this.state, message);

    if (this.state === 'ready') {
      Object.keys(connections).forEach(id => connections[id].emit(KUKER_EVENT, [ message ]));
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
    const r = 'require';
    const socketIO = module[r]('socket.io');
    const http = module[r]('http');

    const app = http.createServer(function (req, res) {
      res.writeHead(200);
      res.end('Hello world');
    });
    const io = socketIO(app);

    io.on('connection', function (socket) {
      connections[socket.id] = socket;
      socket.on('disconnect', reason => {
        delete connections[socket.id];
      });
      socket.emit(KUKER_EVENT, [ NEW_SESSION_EVENT ].concat(S.messages));
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

export default function postMessageViaSocket(message) {
  S.postMessage(message);
};
