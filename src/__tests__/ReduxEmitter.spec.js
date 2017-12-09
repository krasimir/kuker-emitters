/* eslint-disable no-unused-vars, no-undef */
import { createStore, applyMiddleware } from 'redux';
import ReduxEmitter from '../ReduxEmitter';

const initialState = {
  a: {
    value: 0
  },
  b: [1, 2, 3, 4],
  c: function () {},
  d: function * () {}
};
const counter = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      state.a.value += action.with;
      return state;
    case 'DECREMENT':
      state.a.value -= action.with;
      return state;
    default:
      return state;
  }
};
const middleware = ReduxEmitter();

describe('Given the ReduxEmitter', function () {
  beforeEach(() => {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(() => {
    window.top.postMessage.restore();
  });
  describe('when adding the emitter as a Redux middleware', function () {
    describe('and when we dispatch an action', function () {
      it('should dispatch an event to Stent extension', function () {
        const store = createStore(counter, applyMiddleware(middleware));

        store.dispatch({ type: 'INCREMENT', with: 42, b: function () {} });

        expect(window.top.postMessage).to.be.calledWith({
          pageRefresh: true,
          icon: sinon.match.string,
          time: sinon.match.number,
          uid: sinon.match.string,
          color: sinon.match.string
        });
        expect(window.top.postMessage).to.be.calledWith({
          action: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 },
          type: '@redux_ACTION',
          state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } },
          icon: sinon.match.string,
          time: sinon.match.number,
          uid: sinon.match.string,
          color: sinon.match.string
        });
      });
    });
  });
});
