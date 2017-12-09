/* eslint-disable max-len */
import sanitize from './helpers/sanitize';
import message from './helpers/message';

const icon = 'fa-circle-o';
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

const readFromPath = function (object, path, fallback = '') {
  if (!object) return fallback;

  const parts = path.split('.');
  const key = parts.shift();

  if (object[key]) {
    if (parts.length > 0) {
      return readFromPath(object[key], parts.join('.'), fallback);
    }
    return object[key];
  }
  return fallback;
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
        const action = sanitize({ effectId, parentEffectId, label, effect });
        const effectName = getEffectName(effect) || '';
        const saga = readFromPath(action, 'effect.saga.__func', false);
        const fn = readFromPath(action, `effect.${ effectName }.fn.__func`, false);
        const selector = readFromPath(action, `effect.${ effectName }.selector.__func`, false);
        const args = readFromPath(action, `effect.${ effectName }.args`, false);
        const pattern = readFromPath(action, `effect.${ effectName }.pattern`, false);

        let eventLabel = 'effectTriggered';
        let type = 'effectTriggered' + (effectName ? `(${ effectName })` : '');

        if (saga) {
          eventLabel = 'effectTriggered' + (saga ? ` (${ saga })` : '');
        } else if (pattern) {
          eventLabel = 'effectTriggered' + (pattern ? ` (${ effectName }(${ pattern }))` : '');
        } else if (fn) {
          if (args) {
            eventLabel = 'effectTriggered' + (fn ? ` (${ fn }(${ args }))` : '');
            type = `effectTriggered(${ fn })`;
          } else {
            eventLabel = 'effectTriggered' + (fn ? ` (${ effectName }(${ fn }))` : '');
          }
        } else if (selector) {
          if (args) {
            eventLabel = 'effectTriggered' + (selector ? ` (${ selector }(${ args }))` : '');
            type = `effectTriggered(${ selector })`;
          } else {
            eventLabel = 'effectTriggered' + (selector ? ` (${ effectName }(${ selector }))` : '');
          }
        }

        sendMessage({
          type,
          label: eventLabel,
          action
        });
      },
      effectResolved(effectId, result) {
        const effectName = (result && result.name) || '';
        const action = sanitize({ effectId, result });

        sendMessage({
          label: 'effectResolved' + (effectName ? `(${ effectName })` : ''),
          type: 'effectResolved',
          action
        });
      },
      effectRejected(effectId, error) {
        const errorMessage = readFromPath(error, 'message', false);

        sendMessage({
          label: 'effectRejected' + (errorMessage ? ` (${ errorMessage })` : ''),
          type: 'effectRejected',
          action: sanitize({ effectId, error })
        });
      },
      effectCancelled(effectId) {
        sendMessage({
          label: 'effectCancelled',
          type: 'effectCancelled',
          action: sanitize({ effectId })
        });
      },
      actionDispatched(action) {
        sendMessage({
          label: `actionDispatched (${ action.type })`,
          type: `actionDispatched(${ action.type })`,
          action: sanitize({ action })
        });
      }
    },
    setStore: s => (store = s)
  };
};

export default Emitter;
