export default function message(data) {

  if (typeof window === 'undefined') return;

  window.postMessage({
    time: (new Date()).getTime(),
    ...data
  }, '*');
};
