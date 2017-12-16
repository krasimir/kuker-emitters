export const ID = '__kuker__is_here__';

export default function guard() {
  return true;
  // return typeof window !== 'undefined' && window[ID] === true;
};
