var BaseEmitter = require('../../lib/BaseEmitter');
var http = require('http');
var PORT = 3333;

var app = http.createServer(function (req, res) {
  var emit = BaseEmitter();

  emit({ kuker: true, type: 'message1' });
  emit({ kuker: true, type: 'message2' });

  setTimeout(function () {
    emit({ kuker: true, type: 'message3' });
    emit({ kuker: true, type: 'message4' });
    emit({ kuker: true, type: 'message5' });
  }, 1000);

  setTimeout(function () {
    emit({ kuker: true, type: 'message6' });
    emit({ kuker: true, type: 'message7' });
  }, 2000);

  res.writeHead(200);
  res.end('Hello world');
});

app.listen(PORT);
console.log('Open http://localhost:' + PORT);
