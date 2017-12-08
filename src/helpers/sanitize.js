import { stringify } from './vendors/CircularJSON';
import SerializeError from './vendors/SerializeError';

export default function sanitize(something, showErrorInConsole = false) {
  var result;

  try {
    result = JSON.parse(stringify(something, function (key, value) {
      if (typeof value === 'function') {
        return { __func: value.name === '' ? '<anonymous>' : value.name };
      }
      if (value instanceof Error) {
        return SerializeError(value);
      }
      return value;
    }));
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }
    result = null;
  }
  return result;
}
