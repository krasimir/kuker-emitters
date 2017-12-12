'use strict';

exports.__esModule = true;
exports.default = guard;
var ID = exports.ID = '__kuker__is_here__';

function guard() {
  return true;
  // return typeof window !== 'undefined' && window[ID] === true;
};