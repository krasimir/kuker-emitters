'use strict';

var _ReactEmitter = require('../ReactEmitter');

var _ReactEmitter2 = _interopRequireDefault(_ReactEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Node = _ReactEmitter2.default.Node,
    traverseReactTree = _ReactEmitter2.default.traverseReactTree,
    throttle = _ReactEmitter2.default.throttle;


describe('Given the ReactEmitter', function () {
  describe('when we create a new Node', function () {
    it('should keep only the state, name and props', function () {
      var node = new Node({
        foo: 'bar',
        bar: 'foo',
        props: {
          answer: 42
        },
        state: {
          question: 'What is the answer?'
        },
        name: 'MyComponent',
        children: [1, 2, 3]
      });

      expect(node).to.deep.equal({
        children: [],
        name: 'MyComponent',
        props: {
          answer: 42
        },
        state: {
          question: 'What is the answer?'
        }
      });
    });
  });
  describe('when we traverse a React tree', function () {
    it('should return a proper json', function () {
      var tree = {
        name: 'Top',
        props: { foo: 'bar' },
        state: {},
        children: [{
          name: 'section',
          props: {},
          state: {},
          children: [{
            name: 'p',
            props: { className: 'text' },
            state: {},
            children: []
          }]
        }, {
          name: 'footer',
          props: { className: 'footer' },
          state: {},
          children: []
        }]
      };
      var result = traverseReactTree(tree, { Reconciler: true }, {
        getData: sinon.stub().returnsArg(0),
        getDisplayName: sinon.stub()
      });

      expect(result).to.deep.equal(tree);
    });
  });
  describe('when we use the throttle helper', function () {
    it('should throttle the calls', function (done) {
      var emit = sinon.spy();
      var throttled = throttle(emit, 100);

      var _loop = function _loop(i) {
        if (i > 200) {
          setTimeout(function () {
            throttled({ data: { name: 'c' + i } });
          }, i);
        } else {
          throttled({ data: { name: 'c' + i } });
        }
      };

      for (var i = 0; i < 300; i++) {
        _loop(i);
      }

      setTimeout(function () {
        expect(emit.callCount).to.be.equal(4);
        expect(emit).to.be.calledWith(sinon.match({
          calls: 200,
          components: sinon.match.array
        }));
        done();
      }, 500);
    });
  });
});