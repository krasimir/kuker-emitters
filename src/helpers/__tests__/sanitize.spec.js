import sanitize from '../sanitize';

const getCircular = function () {
  var object = {};

  object.arr = [
    object, object
  ];
  object.arr.push(object.arr);
  object.obj = object;
  return object;
};

describe('When using the `sanitize` helper', function () {
  describe('and we pass data to it', function () {
    [
      {
        data: null,
        expected: null
      },
      {
        data: 'a string',
        expected: 'a string'
      },
      {
        data: {
          foo: 'bar',
          bar: ['foo']
        },
        expected: {
          foo: 'bar',
          bar: ['foo']
        }
      },
      {
        data: {
          foo: {
            zoo: function () {}
          },
          bar: [
            function * () {},
            new Promise(() => {}),
            () => {},
            new Error('Ops')
          ]
        },
        expected: sinon.match({
          foo: { zoo: 'function zoo()' },
          bar: [
            'function _callee()',
            {},
            '<anonymous>',
            sinon.match({
              message: 'Ops',
              name: 'Error'
            })
          ]
        })
      },
      {
        data: { bar: 10, foo: getCircular() },
        expected: {
          bar: 10,
          foo: {
            arr: [ '<circular>', '<circular>', '<circular>' ],
            obj: '<circular>'
          }
        }
      }
    ].forEach((testCase, i) => {
      it(`should satisfy test case #${ i }`, function () {
        const spy = sinon.spy();

        // console.log(sanitize(testCase.data, true));
        spy(sanitize(testCase.data, true));
        expect(spy).to.be.calledWith(testCase.expected);
      });
    });
  });
});
