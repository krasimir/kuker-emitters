import postMessageViaSocket from './socket';

function getOrigin() {
  if (typeof location !== 'undefined' && location.protocol && location.host) {
    return location.protocol + '//' + location.host;
  }
  return '';
}

export default function message(data) {
  if (typeof window === 'undefined') {
    postMessageViaSocket({
      kuker: true,
      time: (new Date()).getTime(),
      origin: postMessageViaSocket.origin,
      ...data
    });
    return;
  }

  window.postMessage({
    kuker: true,
    time: (new Date()).getTime(),
    origin: getOrigin(),
    ...data
  }, '*');
};
