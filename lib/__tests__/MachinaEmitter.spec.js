'use strict';

var _machina = require('machina');

var _machina2 = _interopRequireDefault(_machina);

var _guard = require('../helpers/guard');

var _MachinaEmitter = require('../MachinaEmitter');

var _MachinaEmitter2 = _interopRequireDefault(_MachinaEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GREEN = 'GREEN';
var YELLOW = 'YELLOW';
var RED = 'RED';

var MachineConfiguration = {
  initialize: function initialize(options) {},
  namespace: 'vehicle-signal',
  initialState: 'uninitialized',
  states: {
    uninitialized: {
      '*': function _() {
        this.deferUntilTransition();
        this.transition('green');
      }
    },
    green: {
      _onEnter: function _onEnter() {
        this.timer = setTimeout(function () {
          this.handle('timeout');
        }.bind(this), 30000);
        this.emit('vehicles', { status: GREEN });
      },
      timeout: 'green-interruptible',
      pedestrianWaiting: function pedestrianWaiting() {
        this.deferUntilTransition('green-interruptible');
      },
      _onExit: function _onExit() {
        clearTimeout(this.timer);
      }
    },
    'green-interruptible': {
      pedestrianWaiting: 'yellow'
    },
    yellow: {
      _onEnter: function _onEnter() {
        this.timer = setTimeout(function () {
          this.handle('timeout');
        }.bind(this), 5000);
        this.emit('vehicles', { status: YELLOW });
      },
      timeout: 'red',
      _onExit: function _onExit() {
        clearTimeout(this.timer);
      }
    },
    red: {
      _onEnter: function _onEnter() {
        this.timer = setTimeout(function () {
          this.handle('timeout');
        }.bind(this), 1000);
        this.emit('vehicles', { status: RED });
      },
      _reset: 'green',
      _onExit: function _onExit() {
        clearTimeout(this.timer);
      }
    }
  },

  reset: function reset() {
    this.handle('_reset');
  },

  pedestrianWaiting: function pedestrianWaiting() {
    this.handle('pedestrianWaiting');
  }
};

describe('Given the MachinaEmitter', function () {
  before(function () {
    window[_guard.ID] = true;
  });
  after(function () {
    window[_guard.ID] = false;
  });
  beforeEach(function () {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('when we define a machine', function () {
    it('should dispatch events showing what the machine is doing', function () {
      var vehicleSignal = new _machina2.default.Fsm(MachineConfiguration);

      (0, _MachinaEmitter2.default)(vehicleSignal);

      vehicleSignal.pedestrianWaiting();
      vehicleSignal.reset();

      [{
        data: { delegated: false, inputType: 'pedestrianWaiting', namespace: 'vehicle-signal' },
        state: 'uninitialized',
        label: 'uninitialized',
        time: sinon.match.number,
        type: 'Machina_handling'
      }, {
        data: {
          namespace: 'vehicle-signal',
          queuedArgs: {
            args: [{ delegated: false, inputType: 'pedestrianWaiting' }],
            type: 'transition'
          },
          state: 'uninitialized'
        },
        state: 'uninitialized',
        label: 'uninitialized',
        time: sinon.match.number,
        type: 'Machina_deferred'
      }, {
        data: {
          action: 'uninitialized.*',
          fromState: 'uninitialized',
          namespace: 'vehicle-signal',
          toState: 'green'
        },
        state: 'green',
        label: 'green',
        time: sinon.match.number,
        type: 'Machina_transition'
      }, {
        data: { status: 'GREEN' },
        state: 'green',
        label: 'green',
        time: sinon.match.number,
        type: 'Machina_vehicles'
      }, {
        data: {
          action: 'uninitialized.*',
          fromState: 'uninitialized',
          namespace: 'vehicle-signal',
          toState: 'green'
        },
        state: 'green',
        label: 'green',
        time: sinon.match.number,
        type: 'Machina_transitioned'
      }, {
        data: { delegated: false, inputType: 'pedestrianWaiting', namespace: 'vehicle-signal' },
        state: 'green',
        label: 'green',
        time: sinon.match.number,
        type: 'Machina_handling'
      }, {
        data: { delegated: false, inputType: 'pedestrianWaiting', namespace: 'vehicle-signal' },
        state: 'green',
        label: 'green',
        time: sinon.match.number,
        type: 'Machina_handled'
      }].forEach(function (expectation) {
        expect(window.top.postMessage).to.be.calledWith(expectation, '*');
      });
    });
  });
});