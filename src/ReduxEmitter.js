import sanitize from './helpers/sanitize';
import message from './helpers/message';
import guard from './helpers/guard';

const NOOP = function () { return function (noop) { return noop; }; };

export default function ReduxEmitter() {
  if (!guard()) return NOOP;
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
