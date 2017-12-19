// import postMessageViaSocket from './socket';

function getOrigin() {
  if (typeof location !== 'undefined' && location.protocol && location.host && location.pathname) {
    return location.protocol + '//' + location.host;
  }
  return '';
}

export default function message(data) {
  if (typeof window === 'undefined') {
    // postMessageViaSocket(data);
    return;
  }

  window.postMessage({
    kuker: true,
    time: (new Date()).getTime(),
    origin: getOrigin(),
    ...data
  }, '*');
};
