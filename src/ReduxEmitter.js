import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

const NOOP = function () { return function (noop) { return noop; }; };

export default function ReduxEmitter() {
  const message = createMessenger();

  return function middleware({ getState, dispatch }) {
    return next => action => {
      const result = next(action);

      message({
        state: sanitize(getState()),
        type: '@redux_ACTION',
        action: sanitize(action)
      });
      return result;
    };
  };
};
