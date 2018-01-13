webpackJsonp([4],{

/***/ 340:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var count = exports.count = function count(state) {
  return state.count;
};

var limit = 5;

var recentHistory = exports.recentHistory = function recentHistory(state) {
  var end = state.history.length;
  var begin = end - limit < 0 ? 0 : end - limit;
  return state.history.slice(begin, end).toString().replace(/,/g, ', ');
};

/***/ }),

/***/ 341:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var increment = exports.increment = function increment(_ref) {
  var commit = _ref.commit;
  return commit('increment');
};
var decrement = exports.decrement = function decrement(_ref2) {
  var commit = _ref2.commit;
  return commit('decrement');
};

var incrementIfOdd = exports.incrementIfOdd = function incrementIfOdd(_ref3) {
  var commit = _ref3.commit,
      state = _ref3.state;

  if ((state.count + 1) % 2 === 0) {
    commit('increment');
  }
};

var incrementAsync = exports.incrementAsync = function incrementAsync(_ref4) {
  var commit = _ref4.commit;

  setTimeout(function () {
    commit('increment');
  }, 1000);
};

/***/ }),

/***/ 342:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var increment = exports.increment = function increment(state) {
  state.count++;
  state.history.push('increment');
};

var decrement = exports.decrement = function decrement(state) {
  state.count--;
  state.history.push('decrement');
};

/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vuex = __webpack_require__(92);

exports.default = {
  computed: (0, _vuex.mapGetters)(['count', 'recentHistory']),
  methods: (0, _vuex.mapActions)(['increment', 'decrement', 'incrementIfOdd', 'incrementAsync'])
}; //
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(334);
module.exports = __webpack_require__(404);


/***/ }),

/***/ 404:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(50);

var _vue2 = _interopRequireDefault(_vue);

var _store = __webpack_require__(405);

var _store2 = _interopRequireDefault(_store);

var _Counter = __webpack_require__(406);

var _Counter2 = _interopRequireDefault(_Counter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _vue2.default({
  el: '#app',
  store: _store2.default,
  render: function render(h) {
    return h(_Counter2.default);
  }
});

/***/ }),

/***/ 405:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__(50);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(92);

var _vuex2 = _interopRequireDefault(_vuex);

var _getters = __webpack_require__(340);

var getters = _interopRequireWildcard(_getters);

var _actions = __webpack_require__(341);

var actions = _interopRequireWildcard(_actions);

var _mutations = __webpack_require__(342);

var mutations = _interopRequireWildcard(_mutations);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

var state = {
  count: 0,
  history: []
};

var store = new _vuex2.default.Store({
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
});

if (true) {
  module.hot.accept([340, 341, 342], function () {
    store.hotUpdate({
      getters: __webpack_require__(340),
      actions: __webpack_require__(341),
      mutations: __webpack_require__(342)
    });
  });
}

exports.default = store;

/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d62752b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Counter_vue__ = __webpack_require__(407);
var disposed = false
var normalizeComponent = __webpack_require__(93)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d62752b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Counter_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "counter-hot/Counter.vue"

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(46)
  hotAPI.install(__webpack_require__(50), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0d62752b", Component.options)
  } else {
    hotAPI.reload("data-v-0d62752b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm._v("\n  Value: " + _vm._s(_vm.count) + "\n  "),
    _c("button", { on: { click: _vm.increment } }, [_vm._v("+")]),
    _vm._v(" "),
    _c("button", { on: { click: _vm.decrement } }, [_vm._v("-")]),
    _vm._v(" "),
    _c("button", { on: { click: _vm.incrementIfOdd } }, [
      _vm._v("Increment if odd")
    ]),
    _vm._v(" "),
    _c("button", { on: { click: _vm.incrementAsync } }, [
      _vm._v("Increment async")
    ]),
    _vm._v(" "),
    _c("div", [
      _c("div", [
        _vm._v("Recent History (last 5 entries): " + _vm._s(_vm.recentHistory))
      ])
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (true) {
  module.hot.accept()
  if (module.hot.data) {
    __webpack_require__(46)      .rerender("data-v-0d62752b", esExports)
  }
}

/***/ })

},[403]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vY291bnRlci1ob3Qvc3RvcmUvZ2V0dGVycy5qcyIsIndlYnBhY2s6Ly8vLi4vY291bnRlci1ob3Qvc3RvcmUvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi4vY291bnRlci1ob3Qvc3RvcmUvbXV0YXRpb25zLmpzIiwid2VicGFjazovLy8uLi9jb3VudGVyLWhvdC9Db3VudGVyLnZ1ZSIsIndlYnBhY2s6Ly8vLi4vY291bnRlci1ob3QvYXBwLmpzIiwid2VicGFjazovLy8uLi9jb3VudGVyLWhvdC9zdG9yZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vY291bnRlci1ob3QvQ291bnRlci52dWU/Y2YxNSIsIndlYnBhY2s6Ly8vLi4vY291bnRlci1ob3QvQ291bnRlci52dWU/ZmI4YiJdLCJuYW1lcyI6WyJjb3VudCIsInN0YXRlIiwibGltaXQiLCJyZWNlbnRIaXN0b3J5IiwiZW5kIiwiaGlzdG9yeSIsImxlbmd0aCIsImJlZ2luIiwic2xpY2UiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJpbmNyZW1lbnQiLCJjb21taXQiLCJkZWNyZW1lbnQiLCJpbmNyZW1lbnRJZk9kZCIsImluY3JlbWVudEFzeW5jIiwic2V0VGltZW91dCIsInB1c2giLCJlbCIsInN0b3JlIiwicmVuZGVyIiwiaCIsImdldHRlcnMiLCJhY3Rpb25zIiwibXV0YXRpb25zIiwidXNlIiwiU3RvcmUiLCJtb2R1bGUiLCJob3QiLCJhY2NlcHQiLCJob3RVcGRhdGUiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFPLElBQU1BLHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxTQUFTQyxNQUFNRCxLQUFmO0FBQUEsQ0FBZDs7QUFFUCxJQUFNRSxRQUFRLENBQWQ7O0FBRU8sSUFBTUMsd0NBQWdCLFNBQWhCQSxhQUFnQixRQUFTO0FBQ3BDLE1BQU1DLE1BQU1ILE1BQU1JLE9BQU4sQ0FBY0MsTUFBMUI7QUFDQSxNQUFNQyxRQUFRSCxNQUFNRixLQUFOLEdBQWMsQ0FBZCxHQUFrQixDQUFsQixHQUFzQkUsTUFBTUYsS0FBMUM7QUFDQSxTQUFPRCxNQUFNSSxPQUFOLENBQ0pHLEtBREksQ0FDRUQsS0FERixFQUNTSCxHQURULEVBRUpLLFFBRkksR0FHSkMsT0FISSxDQUdJLElBSEosRUFHVSxJQUhWLENBQVA7QUFJRCxDQVBNLEM7Ozs7Ozs7Ozs7Ozs7QUNKQSxJQUFNQyxnQ0FBWSxTQUFaQSxTQUFZO0FBQUEsTUFBR0MsTUFBSCxRQUFHQSxNQUFIO0FBQUEsU0FBZ0JBLE9BQU8sV0FBUCxDQUFoQjtBQUFBLENBQWxCO0FBQ0EsSUFBTUMsZ0NBQVksU0FBWkEsU0FBWTtBQUFBLE1BQUdELE1BQUgsU0FBR0EsTUFBSDtBQUFBLFNBQWdCQSxPQUFPLFdBQVAsQ0FBaEI7QUFBQSxDQUFsQjs7QUFFQSxJQUFNRSwwQ0FBaUIsU0FBakJBLGNBQWlCLFFBQXVCO0FBQUEsTUFBcEJGLE1BQW9CLFNBQXBCQSxNQUFvQjtBQUFBLE1BQVpYLEtBQVksU0FBWkEsS0FBWTs7QUFDbkQsTUFBSSxDQUFDQSxNQUFNRCxLQUFOLEdBQWMsQ0FBZixJQUFvQixDQUFwQixLQUEwQixDQUE5QixFQUFpQztBQUMvQlksV0FBTyxXQUFQO0FBQ0Q7QUFDRixDQUpNOztBQU1BLElBQU1HLDBDQUFpQixTQUFqQkEsY0FBaUIsUUFBZ0I7QUFBQSxNQUFiSCxNQUFhLFNBQWJBLE1BQWE7O0FBQzVDSSxhQUFXLFlBQU07QUFDZkosV0FBTyxXQUFQO0FBQ0QsR0FGRCxFQUVHLElBRkg7QUFHRCxDQUpNLEM7Ozs7Ozs7Ozs7Ozs7QUNUQSxJQUFNRCxnQ0FBWSxTQUFaQSxTQUFZLFFBQVM7QUFDaENWLFFBQU1ELEtBQU47QUFDQUMsUUFBTUksT0FBTixDQUFjWSxJQUFkLENBQW1CLFdBQW5CO0FBQ0QsQ0FITTs7QUFLQSxJQUFNSixnQ0FBWSxTQUFaQSxTQUFZLFFBQVM7QUFDaENaLFFBQU1ELEtBQU47QUFDQUMsUUFBTUksT0FBTixDQUFjWSxJQUFkLENBQW1CLFdBQW5CO0FBQ0QsQ0FITSxDOzs7Ozs7Ozs7Ozs7OztBQ1VQOzs7a0NBRUEsQ0FDQSxTQUVBO2lDQUNBLENBQ0EsYUFDQSxhQUNBLGtCQUVBO0FBVkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQkE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxrQkFBUTtBQUNOQyxNQUFJLE1BREU7QUFFTkMsd0JBRk07QUFHTkMsVUFBUTtBQUFBLFdBQUtDLG9CQUFMO0FBQUE7QUFIRixDQUFSLEU7Ozs7Ozs7Ozs7Ozs7O0FDSkE7Ozs7QUFDQTs7OztBQUNBOztJQUFZQyxPOztBQUNaOztJQUFZQyxPOztBQUNaOztJQUFZQyxTOzs7Ozs7QUFFWixjQUFJQyxHQUFKOztBQUVBLElBQU14QixRQUFRO0FBQ1pELFNBQU8sQ0FESztBQUVaSyxXQUFTO0FBRkcsQ0FBZDs7QUFLQSxJQUFNYyxRQUFRLElBQUksZUFBS08sS0FBVCxDQUFlO0FBQzNCekIsY0FEMkI7QUFFM0JxQixrQkFGMkI7QUFHM0JDLGtCQUgyQjtBQUkzQkM7QUFKMkIsQ0FBZixDQUFkOztBQU9BLElBQUksSUFBSixFQUFnQjtBQUNkRyxTQUFPQyxHQUFQLENBQVdDLE1BQVgsQ0FBa0IsQ0FDaEIsR0FEZ0IsRUFFaEIsR0FGZ0IsRUFHaEIsR0FIZ0IsQ0FBbEIsRUFJRyxZQUFNO0FBQ1BWLFVBQU1XLFNBQU4sQ0FBZ0I7QUFDZFIsZUFBUyxtQkFBQVMsQ0FBUSxHQUFSLENBREs7QUFFZFIsZUFBUyxtQkFBQVEsQ0FBUSxHQUFSLENBRks7QUFHZFAsaUJBQVcsbUJBQUFPLENBQVEsR0FBUjtBQUhHLEtBQWhCO0FBS0QsR0FWRDtBQVdEOztrQkFFY1osSzs7Ozs7Ozs7Ozs7O0FDbENmO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3dLO0FBQ3hLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7QUFFRDs7Ozs7Ozs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixNQUFNLHVCQUF1QixFQUFFO0FBQ2pEO0FBQ0Esa0JBQWtCLE1BQU0sdUJBQXVCLEVBQUU7QUFDakQ7QUFDQSxrQkFBa0IsTUFBTSw0QkFBNEIsRUFBRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTSw0QkFBNEIsRUFBRTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQyIsImZpbGUiOiJjb3VudGVyLWhvdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb3VudCA9IHN0YXRlID0+IHN0YXRlLmNvdW50XG5cbmNvbnN0IGxpbWl0ID0gNVxuXG5leHBvcnQgY29uc3QgcmVjZW50SGlzdG9yeSA9IHN0YXRlID0+IHtcbiAgY29uc3QgZW5kID0gc3RhdGUuaGlzdG9yeS5sZW5ndGhcbiAgY29uc3QgYmVnaW4gPSBlbmQgLSBsaW1pdCA8IDAgPyAwIDogZW5kIC0gbGltaXRcbiAgcmV0dXJuIHN0YXRlLmhpc3RvcnlcbiAgICAuc2xpY2UoYmVnaW4sIGVuZClcbiAgICAudG9TdHJpbmcoKVxuICAgIC5yZXBsYWNlKC8sL2csICcsICcpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vY291bnRlci1ob3Qvc3RvcmUvZ2V0dGVycy5qcyIsImV4cG9ydCBjb25zdCBpbmNyZW1lbnQgPSAoeyBjb21taXQgfSkgPT4gY29tbWl0KCdpbmNyZW1lbnQnKVxuZXhwb3J0IGNvbnN0IGRlY3JlbWVudCA9ICh7IGNvbW1pdCB9KSA9PiBjb21taXQoJ2RlY3JlbWVudCcpXG5cbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRJZk9kZCA9ICh7IGNvbW1pdCwgc3RhdGUgfSkgPT4ge1xuICBpZiAoKHN0YXRlLmNvdW50ICsgMSkgJSAyID09PSAwKSB7XG4gICAgY29tbWl0KCdpbmNyZW1lbnQnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBpbmNyZW1lbnRBc3luYyA9ICh7IGNvbW1pdCB9KSA9PiB7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNvbW1pdCgnaW5jcmVtZW50JylcbiAgfSwgMTAwMClcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9jb3VudGVyLWhvdC9zdG9yZS9hY3Rpb25zLmpzIiwiZXhwb3J0IGNvbnN0IGluY3JlbWVudCA9IHN0YXRlID0+IHtcbiAgc3RhdGUuY291bnQrK1xuICBzdGF0ZS5oaXN0b3J5LnB1c2goJ2luY3JlbWVudCcpXG59XG5cbmV4cG9ydCBjb25zdCBkZWNyZW1lbnQgPSBzdGF0ZSA9PiB7XG4gIHN0YXRlLmNvdW50LS1cbiAgc3RhdGUuaGlzdG9yeS5wdXNoKCdkZWNyZW1lbnQnKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2NvdW50ZXItaG90L3N0b3JlL211dGF0aW9ucy5qcyIsIjx0ZW1wbGF0ZT5cbiAgPGRpdj5cbiAgICBWYWx1ZToge3sgY291bnQgfX1cbiAgICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudFwiPis8L2J1dHRvbj5cbiAgICA8YnV0dG9uIEBjbGljaz1cImRlY3JlbWVudFwiPi08L2J1dHRvbj5cbiAgICA8YnV0dG9uIEBjbGljaz1cImluY3JlbWVudElmT2RkXCI+SW5jcmVtZW50IGlmIG9kZDwvYnV0dG9uPlxuICAgIDxidXR0b24gQGNsaWNrPVwiaW5jcmVtZW50QXN5bmNcIj5JbmNyZW1lbnQgYXN5bmM8L2J1dHRvbj5cbiAgICA8ZGl2PlxuICAgICAgPGRpdj5SZWNlbnQgSGlzdG9yeSAobGFzdCA1IGVudHJpZXMpOiB7eyByZWNlbnRIaXN0b3J5IH19PC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cbmltcG9ydCB7IG1hcEdldHRlcnMsIG1hcEFjdGlvbnMgfSBmcm9tICd2dWV4J1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbXB1dGVkOiBtYXBHZXR0ZXJzKFtcbiAgICAnY291bnQnLFxuICAgICdyZWNlbnRIaXN0b3J5J1xuICBdKSxcbiAgbWV0aG9kczogbWFwQWN0aW9ucyhbXG4gICAgJ2luY3JlbWVudCcsXG4gICAgJ2RlY3JlbWVudCcsXG4gICAgJ2luY3JlbWVudElmT2RkJyxcbiAgICAnaW5jcmVtZW50QXN5bmMnXG4gIF0pXG59XG48L3NjcmlwdD5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9jb3VudGVyLWhvdC9Db3VudGVyLnZ1ZSIsImltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUnXG5pbXBvcnQgQ291bnRlciBmcm9tICcuL0NvdW50ZXIudnVlJ1xuXG5uZXcgVnVlKHtcbiAgZWw6ICcjYXBwJyxcbiAgc3RvcmUsXG4gIHJlbmRlcjogaCA9PiBoKENvdW50ZXIpXG59KVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL2NvdW50ZXItaG90L2FwcC5qcyIsImltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IFZ1ZXggZnJvbSAndnVleCdcbmltcG9ydCAqIGFzIGdldHRlcnMgZnJvbSAnLi9nZXR0ZXJzJ1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXG5pbXBvcnQgKiBhcyBtdXRhdGlvbnMgZnJvbSAnLi9tdXRhdGlvbnMnXG5cblZ1ZS51c2UoVnVleClcblxuY29uc3Qgc3RhdGUgPSB7XG4gIGNvdW50OiAwLFxuICBoaXN0b3J5OiBbXVxufVxuXG5jb25zdCBzdG9yZSA9IG5ldyBWdWV4LlN0b3JlKHtcbiAgc3RhdGUsXG4gIGdldHRlcnMsXG4gIGFjdGlvbnMsXG4gIG11dGF0aW9uc1xufSlcblxuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoW1xuICAgICcuL2dldHRlcnMnLFxuICAgICcuL2FjdGlvbnMnLFxuICAgICcuL211dGF0aW9ucydcbiAgXSwgKCkgPT4ge1xuICAgIHN0b3JlLmhvdFVwZGF0ZSh7XG4gICAgICBnZXR0ZXJzOiByZXF1aXJlKCcuL2dldHRlcnMnKSxcbiAgICAgIGFjdGlvbnM6IHJlcXVpcmUoJy4vYWN0aW9ucycpLFxuICAgICAgbXV0YXRpb25zOiByZXF1aXJlKCcuL211dGF0aW9ucycpXG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3RvcmVcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9jb3VudGVyLWhvdC9zdG9yZS9pbmRleC5qcyIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vQ291bnRlci52dWVcIlxuaW1wb3J0IF9fdnVlX3NjcmlwdF9fIGZyb20gXCIhIWJhYmVsLWxvYWRlciEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL0NvdW50ZXIudnVlXCJcbi8qIHRlbXBsYXRlICovXG5pbXBvcnQgX192dWVfdGVtcGxhdGVfXyBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXIvaW5kZXg/e1xcXCJpZFxcXCI6XFxcImRhdGEtdi0wZDYyNzUyYlxcXCIsXFxcImhhc1Njb3BlZFxcXCI6ZmFsc2UsXFxcImJ1YmxlXFxcIjp7XFxcInRyYW5zZm9ybXNcXFwiOnt9fX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL0NvdW50ZXIudnVlXCJcbi8qIHRlbXBsYXRlIGZ1bmN0aW9uYWwgKi9cbnZhciBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18gPSBmYWxzZVxuLyogc3R5bGVzICovXG52YXIgX192dWVfc3R5bGVzX18gPSBudWxsXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gbnVsbFxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwiY291bnRlci1ob3QvQ291bnRlci52dWVcIlxuXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7XG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoXCJkYXRhLXYtMGQ2Mjc1MmJcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnJlbG9hZChcImRhdGEtdi0wZDYyNzUyYlwiLCBDb21wb25lbnQub3B0aW9ucylcbiAgfVxuICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBkaXNwb3NlZCA9IHRydWVcbiAgfSlcbn0pKCl9XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudC5leHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9jb3VudGVyLWhvdC9Db3VudGVyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gNDA2XG4vLyBtb2R1bGUgY2h1bmtzID0gNCIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXCJkaXZcIiwgW1xuICAgIF92bS5fdihcIlxcbiAgVmFsdWU6IFwiICsgX3ZtLl9zKF92bS5jb3VudCkgKyBcIlxcbiAgXCIpLFxuICAgIF9jKFwiYnV0dG9uXCIsIHsgb246IHsgY2xpY2s6IF92bS5pbmNyZW1lbnQgfSB9LCBbX3ZtLl92KFwiK1wiKV0pLFxuICAgIF92bS5fdihcIiBcIiksXG4gICAgX2MoXCJidXR0b25cIiwgeyBvbjogeyBjbGljazogX3ZtLmRlY3JlbWVudCB9IH0sIFtfdm0uX3YoXCItXCIpXSksXG4gICAgX3ZtLl92KFwiIFwiKSxcbiAgICBfYyhcImJ1dHRvblwiLCB7IG9uOiB7IGNsaWNrOiBfdm0uaW5jcmVtZW50SWZPZGQgfSB9LCBbXG4gICAgICBfdm0uX3YoXCJJbmNyZW1lbnQgaWYgb2RkXCIpXG4gICAgXSksXG4gICAgX3ZtLl92KFwiIFwiKSxcbiAgICBfYyhcImJ1dHRvblwiLCB7IG9uOiB7IGNsaWNrOiBfdm0uaW5jcmVtZW50QXN5bmMgfSB9LCBbXG4gICAgICBfdm0uX3YoXCJJbmNyZW1lbnQgYXN5bmNcIilcbiAgICBdKSxcbiAgICBfdm0uX3YoXCIgXCIpLFxuICAgIF9jKFwiZGl2XCIsIFtcbiAgICAgIF9jKFwiZGl2XCIsIFtcbiAgICAgICAgX3ZtLl92KFwiUmVjZW50IEhpc3RvcnkgKGxhc3QgNSBlbnRyaWVzKTogXCIgKyBfdm0uX3MoX3ZtLnJlY2VudEhpc3RvcnkpKVxuICAgICAgXSlcbiAgICBdKVxuICBdKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcbnZhciBlc0V4cG9ydHMgPSB7IHJlbmRlcjogcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZucyB9XG5leHBvcnQgZGVmYXVsdCBlc0V4cG9ydHNcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKG1vZHVsZS5ob3QuZGF0YSkge1xuICAgIHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIikgICAgICAucmVyZW5kZXIoXCJkYXRhLXYtMGQ2Mjc1MmJcIiwgZXNFeHBvcnRzKVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2tyYXNpbWlyL1dvcmsvS3Jhc2ltaXIvdnVleC9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXI/e1wiaWRcIjpcImRhdGEtdi0wZDYyNzUyYlwiLFwiaGFzU2NvcGVkXCI6ZmFsc2UsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS9Vc2Vycy9rcmFzaW1pci9Xb3JrL0tyYXNpbWlyL3Z1ZXgvbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuLi9jb3VudGVyLWhvdC9Db3VudGVyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gNDA3XG4vLyBtb2R1bGUgY2h1bmtzID0gNCJdLCJzb3VyY2VSb290IjoiIn0=