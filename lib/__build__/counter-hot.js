"use strict";

webpackJsonp([4], {

  /***/340:
  /***/function _(module, exports, __webpack_require__) {

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

    /***/
  },

  /***/341:
  /***/function _(module, exports, __webpack_require__) {

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

    /***/
  },

  /***/342:
  /***/function _(module, exports, __webpack_require__) {

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

    /***/
  },

  /***/355:
  /***/function _(module, exports, __webpack_require__) {

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

    /***/
  },

  /***/403:
  /***/function _(module, exports, __webpack_require__) {

    __webpack_require__(334);
    module.exports = __webpack_require__(404);

    /***/
  },

  /***/404:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";

    var _vue = __webpack_require__(50);

    var _vue2 = _interopRequireDefault(_vue);

    var _store = __webpack_require__(405);

    var _store2 = _interopRequireDefault(_store);

    var _Counter = __webpack_require__(406);

    var _Counter2 = _interopRequireDefault(_Counter);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

    new _vue2.default({
      el: '#app',
      store: _store2.default,
      render: function render(h) {
        return h(_Counter2.default);
      }
    });

    /***/
  },

  /***/405:
  /***/function _(module, exports, __webpack_require__) {

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

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
          }
        }newObj.default = obj;return newObj;
      }
    }

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }

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

    /***/
  },

  /***/406:
  /***/function _(module, __webpack_exports__, __webpack_require__) {

    "use strict";

    Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__ = __webpack_require__(355);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__);
    /* harmony namespace reexport (unknown) */for (var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__) {
      if (__WEBPACK_IMPORT_KEY__ !== 'default') (function (key) {
        __webpack_require__.d(__webpack_exports__, key, function () {
          return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue__[key];
        });
      })(__WEBPACK_IMPORT_KEY__);
    } /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d62752b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Counter_vue__ = __webpack_require__(407);
    var disposed = false;
    var normalizeComponent = __webpack_require__(93);
    /* script */

    /* template */

    /* template functional */
    var __vue_template_functional__ = false;
    /* styles */
    var __vue_styles__ = null;
    /* scopeId */
    var __vue_scopeId__ = null;
    /* moduleIdentifier (server only) */
    var __vue_module_identifier__ = null;
    var Component = normalizeComponent(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Counter_vue___default.a, __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d62752b_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Counter_vue__["a" /* default */], __vue_template_functional__, __vue_styles__, __vue_scopeId__, __vue_module_identifier__);
    Component.options.__file = "counter-hot/Counter.vue";

    /* hot reload */
    if (true) {
      (function () {
        var hotAPI = __webpack_require__(46);
        hotAPI.install(__webpack_require__(50), false);
        if (!hotAPI.compatible) return;
        module.hot.accept();
        if (!module.hot.data) {
          hotAPI.createRecord("data-v-0d62752b", Component.options);
        } else {
          hotAPI.reload("data-v-0d62752b", Component.options);
        }
        module.hot.dispose(function (data) {
          disposed = true;
        });
      })();
    }

    /* harmony default export */__webpack_exports__["default"] = Component.exports;

    /***/
  },

  /***/407:
  /***/function _(module, __webpack_exports__, __webpack_require__) {

    "use strict";

    var render = function render() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", [_vm._v("\n  Value: " + _vm._s(_vm.count) + "\n  "), _c("button", { on: { click: _vm.increment } }, [_vm._v("+")]), _vm._v(" "), _c("button", { on: { click: _vm.decrement } }, [_vm._v("-")]), _vm._v(" "), _c("button", { on: { click: _vm.incrementIfOdd } }, [_vm._v("Increment if odd")]), _vm._v(" "), _c("button", { on: { click: _vm.incrementAsync } }, [_vm._v("Increment async")]), _vm._v(" "), _c("div", [_c("div", [_vm._v("Recent History (last 5 entries): " + _vm._s(_vm.recentHistory))])])]);
    };
    var staticRenderFns = [];
    render._withStripped = true;
    var esExports = { render: render, staticRenderFns: staticRenderFns
      /* harmony default export */ };__webpack_exports__["a"] = esExports;
    if (true) {
      module.hot.accept();
      if (module.hot.data) {
        __webpack_require__(46).rerender("data-v-0d62752b", esExports);
      }
    }

    /***/
  }

}, [403]);