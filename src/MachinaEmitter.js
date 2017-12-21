import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

export default function MachinaEmitter(machine) {
  const message = createMessenger();

  machine.on('*', function (eventName, data) {
    message({
      type: `Machina_${ eventName }`,
      label: typeof machine.state === 'string' ? machine.state : '',
      state: sanitize(machine.state),
      data: sanitize(data)
    });
  });
};
