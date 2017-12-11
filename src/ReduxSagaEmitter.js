/* eslint-disable max-len */
import sanitize from './helpers/sanitize';
import message from './helpers/message';

const uid = 'redux';

var store = null;

const getState = function () {
  if (store) return store.getState();
  return { '<unknown>': 'Please check https://github.com/krasimir/stent-dev-tools-emitters to learn how to get the state in here.' };
};

const sendMessage = function (data) {
  message({
    state: sanitize(getState()),
    ...data
  }, uid);
};

const Emitter = () => {
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
    setStore: s => (store = s)
  };
};

export default Emitter;
