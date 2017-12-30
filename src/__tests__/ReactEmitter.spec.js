import { Node, traverseReactTree, throttle } from '../ReactEmitter';

describe('Given the ReactEmitter', function () {
  describe('when we create a new Node', function () {
    it('should keep only the state, name and props', function () {
      const node = new Node({
        foo: 'bar',
        bar: 'foo',
        props: {
          answer: 42
        },
        state: {
          question: 'What is the answer?'
        },
        name: 'MyComponent',
        children: [ 1, 2, 3 ]
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
      const tree = {
        name: 'Top',
        props: { foo: 'bar' },
        state: {},
        children: [
          {
            name: 'section',
            props: {},
            state: {},
            children: [
              {
                name: 'p',
                props: { className: 'text' },
                state: {},
                children: []
              }
            ]
          },
          {
            name: 'footer',
            props: { className: 'footer' },
            state: {},
            children: []
          }
        ]
      };
      const result = traverseReactTree(
        tree,
        { Reconciler: true },
        {
          getData: sinon.stub().returnsArg(0),
          getDisplayName: sinon.stub()
        }
      );

      expect(result).to.deep.equal(tree);
    });
  });
  describe('when we use the throttle helper', function () {
    it('should throttle the calls', function (done) {
      const emit = sinon.spy();
      const throttled = throttle(emit, 100);

      for (let i = 0; i < 300; i++) {
        if (i > 200) {
          setTimeout(function () {
            throttled({ data: { name: 'c' + i } });
          }, i);
        } else {
          throttled({ data: { name: 'c' + i } });
        }
      }

      setTimeout(() => {
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
