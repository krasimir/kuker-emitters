import sanitize from './helpers/sanitize';
import message from './helpers/message';
import guard from './helpers/guard';

export default function MachinaEmitter(machine) {
  if (!guard()) return;

  machine.on('*', function (eventName, data) {
    message({
      type: `Machina_${ eventName }`,
      state: sanitize(machine.state),
      data: sanitize(data)
    });
  });
};
