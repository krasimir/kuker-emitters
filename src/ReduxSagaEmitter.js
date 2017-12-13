/* eslint-disable max-len */
import sanitize from './helpers/sanitize';
import message from './helpers/message';
import guard from './helpers/guard';

var store = null;

const getState = function () {
  if (store) return store.getState();
  return { '<unknown>': 'You forgot to call `emitter.setStore(<your store>)`. Please check https://github.com/krasimir/kuker-emitters' };
};

const sendMessage = function (data) {
  message({
    state: sanitize(getState()),
    ...data
  });
};

export default function ReduxSagaEmitter() {
  if (!guard()) return { sagaMonitor: null, setStore: () => {}};
  return {
    sagaMonitor: {
      effectTriggered({ effectId, parentEffectId, label, effect }) {
        sendMessage({
          type: '@saga_effectTriggered',
          ...sanitize({ effectId, parentEffectId, label, effect })
        });
      },
      effectResolved(effectId, result) {
        sendMessage({
          type: '@saga_effectResolved',
          ...sanitize({ effectId, result })
        });
      },
      effectRejected(effectId, error) {

        sendMessage({
          type: '@saga_effectRejected',
          ...sanitize({ effectId, error })
        });
      },
      effectCancelled(effectId) {
        sendMessage({
          type: '@saga_effectCancelled',
          effectId
        });
      },
      actionDispatched(action) {
        sendMessage({
          type: '@saga_actionDispatched',
          ...sanitize({ action })
        });
      }
    },
    setStore: function (s) { store = s; }
  };
};
