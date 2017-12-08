import sanitize from './helpers/sanitize';
import message from './helpers/message';

const icon = 'fa-gear';

export default function ReduxEmitter() {
  return function middleware({ getState, dispatch }) {
    const uid = 'redux' + (new Date()).getTime();

    message({ pageRefresh: true, icon }, uid);

    return next => action => {
      const result = next(action);

      message({
        state: sanitize(getState()),
        label: action.type,
        action: sanitize(action),
        icon
      }, uid);
      return result;
    };
  };
};
