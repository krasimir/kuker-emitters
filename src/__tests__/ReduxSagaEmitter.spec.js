/* eslint-disable no-unused-vars, no-undef */
import { createStore, applyMiddleware } from 'redux';
import ReduxSagaEmitter from '../ReduxSagaEmitter';
import createSagaMiddleware from 'redux-saga';
import { take, call, fork, put } from 'redux-saga/effects';

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

const api = () => Promise.resolve([1, 2, 3]);
const apiBroken = () => Promise.reject(new Error('Sorry!'));
const apiTimeout = function * () {
  yield take('UNKNOWN');
};

const rootSaga = function * () {
  const action = yield take('INCREMENT');
  const data = yield call(api, action.with);

  try {
    yield call(apiBroken);
  } catch (error) {}

  const task = yield fork(apiTimeout);

  task.cancel();
};

describe('Given the ReduxSagaEmitter', function () {
  beforeEach(() => {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(() => {
    window.top.postMessage.restore();
  });
  describe('when adding the emitter as a Redux middleware', function () {
    describe('and when we dispatch an action', function () {
      it('should dispatch an event to Stent extension', function (done) {
        const emitter = ReduxSagaEmitter();
        const sagaMiddleware = createSagaMiddleware({ sagaMonitor: emitter.sagaMonitor });
        const store = createStore(counter, applyMiddleware(sagaMiddleware));

        emitter.setStore(store);

        sagaMiddleware.run(rootSaga).done.then(() => {

          expect(window.top.postMessage).to.be.calledWith({
            pageRefresh: true,
            source: 'stent',
            icon: sinon.match.string,
            time: sinon.match.number,
            uid: sinon.match.string,
            color: sinon.match.string
          });

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effect: { args: [], root: true, saga: { __func: 'rootSaga' } },
              effectId: sinon.match.number,
              parentEffectId: sinon.match.number
            },
            effectName: 'root',
            label: 'effectTriggered(root)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effect: { '@@redux-saga/IO': true, TAKE: { pattern: 'INCREMENT' } },
              effectId: sinon.match.number,
              label: '',
              parentEffectId: sinon.match.number
            },
            effectName: 'TAKE',
            label: 'effectTriggered(TAKE)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effectId: sinon.match.number,
              result: {
                '@@redux-saga/TASK': true,
                cancel: { __func: 'cancel' },
                done: {},
                error: { __func: 'error' },
                id: sinon.match.number,
                isAborted: { __func: 'isAborted' },
                isCancelled: { __func: 'isCancelled' },
                isRunning: { __func: 'isRunning' },
                joiners: [],
                name: 'rootSaga',
                result: { __func: 'result' },
                setContext: { __func: 'setContext' }
              }
            },
            effectName: 'rootSaga',
            label: 'effectResolved(rootSaga)',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: { action: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 } },
            label: 'actionDispatched',
            state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: {
              effectId: sinon.match.number,
              error: {
                message: 'Sorry!',
                name: 'Error',
                stack: sinon.match.string
              }
            },
            label: 'effectRejected',
            state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          expect(window.top.postMessage).to.be.calledWith(sinon.match({
            action: { effectId: sinon.match.number },
            label: 'effectCancelled',
            state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
          }));

          done();
        });

        store.dispatch({ type: 'INCREMENT', with: 42, b: function () {} });
      });
    });
  });
});
