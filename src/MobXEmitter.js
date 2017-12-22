import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

export default function MobXEmitter(spy, stores) {
  const message = createMessenger('MobXEmitter');
  const emit = data => message(sanitize(data));
  const state = stores.reduce((result, store) => {
    result[store.constructor.name] = store;
    return result;
  }, {});
  var indent = 0;

  spy(event => {
    const type = `@mobx_${ event.type || 'spyReportEnd' }`;

    if (event.spyReportEnd) indent -= 1;

    emit({
      type,
      state,
      event: { ...event, indent }
    });

    if (event.spyReportStart) indent += 1;
  });
};
