import sanitize from './helpers/sanitize';
import message from './helpers/message';

const icon = 'fa-gear';
const color = '#e7f7e3';
const uid = 'redux';

export default function ReduxEmitter() {
  return function middleware({ getState, dispatch }) {
    message({ pageRefresh: true, icon, color }, uid);

    return next => action => {
      const result = next(action);

      message({
        state: sanitize(getState()),
        type: '@redux_ACTION',
        action: sanitize(action),
        icon,
        color
      }, uid);
      return result;
    };
  };
};
