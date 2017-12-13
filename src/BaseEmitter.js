import sanitize from './helpers/sanitize';
import message from './helpers/message';
import guard from './helpers/guard';

const NOOP = function () {};

export default function BaseEmitter() {
  return guard() ? (data => message(sanitize(data))) : NOOP;
};
