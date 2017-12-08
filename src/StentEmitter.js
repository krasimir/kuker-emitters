import sanitize from './helpers/sanitize';
import message from './helpers/message';

var Machine, uid;

const postMessage = (data) => {
  if (window && window.top && window.top.postMessage) {
    const machines = Object.keys(Machine.machines)
      .map(name => ({ name, state: sanitize(Machine.machines[name].state) }));

    message({ state: machines, ...data }, uid);
  } else {
    console.error('There is no window.postMessage available');
  }
};
const formatYielded = yielded => {
  var y = yielded;

  if (yielded && yielded.__type === 'call') {
    let funcName = yielded.func.name;

    if (funcName === '') { funcName = '<anonymous>'; };
    try {
      y = sanitize(yielded);
    } catch (error) {
      y = { __type: 'call' };
    }
    y.func = funcName;
  }

  return y;
};

const getMetaInfo = meta => {
  return Object.assign({}, meta, {
    middlewares: Machine.middlewares.length
  });
};

const StentEmitter = {
  __sanitize: sanitize,
  __formatYielded: formatYielded,
  __message: message,
  __initialize(m, uniqueId) {
    Machine = m;
    uid = uniqueId;
  },
  onMachineCreated(machine) {
    postMessage({
      type: 'onMachineCreated',
      machine: sanitize(machine),
      meta: getMetaInfo()
    });
  },
  onActionDispatched(actionName, ...args) {
    postMessage({
      type: 'onActionDispatched',
      actionName,
      args: sanitize(args),
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onActionProcessed(actionName, ...args) {
    postMessage({
      type: 'onActionProcessed',
      actionName,
      args: sanitize(args),
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onStateWillChange() {
    postMessage({
      type: 'onStateWillChange',
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onStateChanged() {
    postMessage({
      type: 'onStateChanged',
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onGeneratorStep(yielded) {
    postMessage({
      type: 'onGeneratorStep',
      yielded: formatYielded(yielded),
      meta: getMetaInfo()
    });
  },
  onGeneratorEnd(value) {
    postMessage({
      type: 'onGeneratorEnd',
      value: sanitize(value),
      meta: getMetaInfo()
    });
  },
  onGeneratorResumed(value) {
    postMessage({
      type: 'onGeneratorResumed',
      value: sanitize(value),
      meta: getMetaInfo()
    });
  },
  onMachineConnected(machines, meta) {
    postMessage({
      type: 'onMachineConnected',
      meta: getMetaInfo({ ...meta, ...{ machines: sanitize(machines) }})
    });
  },
  onMachineDisconnected(machines, meta) {
    postMessage({
      type: 'onMachineDisconnected',
      meta: getMetaInfo({ ...meta, ...{ machines: sanitize(machines) }})
    });
  },
  onMiddlewareRegister() {
    postMessage({
      pageRefresh: true
    });
  }
};

export default StentEmitter;
