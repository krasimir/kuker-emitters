/* eslint-disable max-len */
import sanitize from './helpers/sanitize';
import message from './helpers/message';

const icon = 'fa-caret-right';
const color = '#f7f5e3';
const uid = 'redux';

var store = null;

const getState = function () {
  if (store) return store.getState();
  return { '<unknown>': 'Please check https://github.com/krasimir/stent-dev-tools-emitters to learn how to get the state in here.' };
};

const sendMessage = function (data) {
  message({
    state: sanitize(getState()),
    icon,
    color,
    ...data
  }, uid);
};

const getEffectName = function (effect) {
  if (effect && typeof effect === 'object') {
    if (effect.root === true) {
      return 'root';
    }
    const keys = Object.keys(effect).filter(key => key.indexOf('@@') < 0);

    if (keys.length > 0) return keys[0];
  }
  return null;
};

const Emitter = () => {
  message({ pageRefresh: true, icon, color }, uid);

  return {
    sagaMonitor: {
      effectTriggered({ effectId, parentEffectId, label, effect }) {
        sendMessage({
          label: 'effectTriggered',
          effectName: getEffectName(effect),
          action: sanitize({
            effectId, parentEffectId, label, effect
          })
        });
      },
      effectResolved(effectId, result) {
        sendMessage({
          label: 'effectResolved',
          effect: result && result.name,
          action: sanitize({
            effectId, result
          })
        });
      },
      effectRejected(effectId, error) {
        sendMessage({
          label: 'effectRejected',
          action: sanitize({
            effectId, error
          })
        });
      },
      effectCancelled(effectId) {
        sendMessage({
          label: 'effectCancelled',
          action: sanitize({
            effectId
          })
        });
      },
      actionDispatched(action) {
        sendMessage({
          label: 'actionDispatched',
          action: sanitize({
            action
          })
        });
      }
    },
    setStore: s => (store = s)
  };
};

export default Emitter;
