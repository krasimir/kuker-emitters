var BaseEmitter = require('../../lib/BaseEmitter');
var emit = BaseEmitter();

emit({ kuker: true, type: 'message1' });
emit({ kuker: true, type: 'message2' });

setTimeout(function () {
  emit({ kuker: true, type: 'message3' });
  emit({ kuker: true, type: 'message4' });
  emit({ kuker: true, type: 'message5' });
}, 4000);

setTimeout(function () {
  emit({ kuker: true, type: 'message6' });
  emit({ kuker: true, type: 'message7' });
}, 5000);
