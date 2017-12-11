import sanitize from './helpers/sanitize';
import message from './helpers/message';

const uid = 'redux';

export default function ReduxEmitter() {
  return function middleware({ getState, dispatch }) {
    message({ pageRefresh: true }, uid);

    return next => action => {
      const result = next(action);

      message({
        state: sanitize(getState()),
        type: '@redux_ACTION',
        action: sanitize(action)
      }, uid);
      return result;
    };
  };
};
