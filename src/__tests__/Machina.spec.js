import machina from 'machina';
import { ID } from '../helpers/guard';
import MachinaEmitter from '../MachinaEmitter';

const GREEN = 'GREEN';
const YELLOW = 'YELLOW';
const RED = 'RED';

const MachineConfiguration = {
  initialize: function (options) {},
  namespace: 'vehicle-signal',
  initialState: 'uninitialized',
  states: {
    uninitialized: {
      '*': function () {
        this.deferUntilTransition();
        this.transition('green');
      }
    },
    green: {
      _onEnter: function () {
        this.timer = setTimeout(function () {
          this.handle('timeout');
        }.bind(this), 30000);
        this.emit('vehicles', { status: GREEN });
      },
      timeout: 'green-interruptible',
      pedestrianWaiting: function () {
        this.deferUntilTransition('green-interruptible');
      },
      _onExit: function () {
        clearTimeout(this.timer);
      }
    },
    'green-interruptible': {
      pedestrianWaiting: 'yellow'
    },
    yellow: {
      _onEnter: function () {
        this.timer = setTimeout(function () {
          this.handle('timeout');
        }.bind(this), 5000);
        this.emit('vehicles', { status: YELLOW });
      },
      timeout: 'red',
      _onExit: function () {
        clearTimeout(this.timer);
      }
    },
    red: {
      _onEnter: function () {
        this.timer = setTimeout(function () {
          this.handle('timeout');
        }.bind(this), 1000);
        this.emit('vehicles', { status: RED });
      },
      _reset: 'green',
      _onExit: function () {
        clearTimeout(this.timer);
      }
    }
  },

  reset: function () {
    this.handle('_reset');
  },

  pedestrianWaiting: function () {
    this.handle('pedestrianWaiting');
  }
};

describe('Given the MachinaEmitter', function () {
  before(() => {
    window[ID] = true;
  });
  after(() => {
    window[ID] = false;
  });
  beforeEach(() => {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(() => {
    window.top.postMessage.restore();
  });
  describe('when we define a machine', function () {
    it('should dispatch events showing what the machine is doing', function () {
      const vehicleSignal = new machina.Fsm(MachineConfiguration);

      MachinaEmitter(vehicleSignal);

      vehicleSignal.pedestrianWaiting();
      vehicleSignal.reset();

      [
        {
          data: { delegated: false, inputType: 'pedestrianWaiting', namespace: 'vehicle-signal' },
          state: 'uninitialized',
          time: sinon.match.number,
          type: 'Machina_handling'
        },
        {
          data: {
            namespace: 'vehicle-signal',
            queuedArgs: {
              args: [{ delegated: false, inputType: 'pedestrianWaiting' }],
              type: 'transition'
            },
            state: 'uninitialized'
          },
          state: 'uninitialized',
          time: sinon.match.number,
          type: 'Machina_deferred'
        },
        {
          data: {
            action: 'uninitialized.*',
            fromState: 'uninitialized',
            namespace: 'vehicle-signal',
            toState: 'green'
          },
          state: 'green',
          time: sinon.match.number,
          type: 'Machina_transition'
        },
        {
          data: { status: 'GREEN' },
          state: 'green',
          time: sinon.match.number,
          type: 'Machina_vehicles'
        },
        {
          data: {
            action: 'uninitialized.*',
            fromState: 'uninitialized',
            namespace: 'vehicle-signal',
            toState: 'green'
          },
          state: 'green',
          time: sinon.match.number,
          type: 'Machina_transitioned'
        },
        {
          data: { delegated: false, inputType: 'pedestrianWaiting', namespace: 'vehicle-signal' },
          state: 'green',
          time: sinon.match.number,
          type: 'Machina_handling'
        },
        {
          data: { delegated: false, inputType: 'pedestrianWaiting', namespace: 'vehicle-signal' },
          state: 'green',
          time: sinon.match.number,
          type: 'Machina_handled'
        }
      ].forEach(expectation => {
        expect(window.top.postMessage).to.be.calledWith(expectation, '*');
      });
    });
  });
});