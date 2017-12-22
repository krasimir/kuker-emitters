import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

export default function BaseEmitter() {
  const message = createMessenger('BaseEmitter');

  return data => message(sanitize(data));
};
