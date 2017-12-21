import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

export default function BaseEmitter() {
  const message = createMessenger();

  return data => message(sanitize(data));
};
