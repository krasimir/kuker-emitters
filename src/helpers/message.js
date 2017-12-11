export default function message(data) {

  if (typeof window === 'undefined') return;

  window.top.postMessage({
    time: (new Date()).getTime(),
    ...data
  }, '*');
};
