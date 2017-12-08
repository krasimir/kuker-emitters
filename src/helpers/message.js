export default function message(data, uid = 'emitter') {

  if (typeof window === 'undefined') return;

  window.top.postMessage({
    source: 'stent',
    time: (new Date()).getTime(),
    uid,
    ...data
  }, '*');
};
