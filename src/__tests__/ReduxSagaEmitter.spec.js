/* eslint-disable no-unused-vars */
import { createStore, applyMiddleware } from 'redux';
import ReduxSagaEmitter from '../ReduxSagaEmitter';
import createSagaMiddleware from 'redux-saga';
import { take, takeEvery, call, fork, put, select } from 'redux-saga/effects';

const initialState = () => ({
  a: {
    value: 0
  },
  b: [1, 2, 3, 4],
  c: function () {},
  d: function * () {}
});
const counter = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      state.a.value += action.with;
      return state;
    case 'DECREMENT':
      state.a.value -= action.with;
      return state;
    default:
      return initialState();
  }
};

const api = () => Promise.resolve([1, 2, 3]);
const apiBroken = () => Promise.reject(new Error('Sorry!'));
const apiTimeout = function * () {
  yield take('UNKNOWN');
};

const myRootSaga = function * () {
  const action = yield take('INCREMENT');
};
const myRootSaga2 = function * () {
  try {
    yield call(apiBroken);
  } catch (error) {}
};
const myRootSaga3 = function * () {
  const task = yield fork(apiTimeout);

  task.cancel();
};
var messages = [];

describe('Given the ReduxSagaEmitter', function () {
  beforeEach(() => {
    messages = [];
    sinon.stub(window.top, 'postMessage').callsFake(message => messages.push(message));
  });
  afterEach(() => {
    window.top.postMessage.restore();
  });
  describe('when adding the emitter as a Redux middleware', function () {
    describe('and when we dispatch an action', function () {
      describe('should dispatch an event to Stent extension', function () {
        [
          {
            desc: 'should send a pageRefresh event',
            finder: m => m.pageRefresh === true,
            expected: {
              pageRefresh: true
            },
            saga: myRootSaga
          },
          {
            desc: 'should send effectTriggered(root) event',
            finder: m => m.type === 'effectTriggered(root)',
            expected: {
              action: {
                effect: { args: [], root: true, saga: { __func: 'myRootSaga' } }
              },
              type: 'effectTriggered(root)',
              label: 'effectTriggered (myRootSaga)',
              state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga
          },
          {
            desc: 'should send effectTriggered(TAKE) event',
            finder: m => m.type === 'effectTriggered(TAKE)',
            expected: {
              action: {
                effect: { '@@redux-saga/IO': true, TAKE: { pattern: 'INCREMENT' } }
              },
              type: 'effectTriggered(TAKE)',
              label: 'effectTriggered (TAKE(INCREMENT))',
              state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga
          },
          {
            desc: 'should send effectResolved event',
            finder: m => m.type === 'effectResolved',
            expected: {
              action: {
                result: {
                  '@@redux-saga/TASK': true,
                  cancel: { __func: 'cancel' },
                  done: {},
                  error: { __func: 'error' },
                  isAborted: { __func: 'isAborted' },
                  isCancelled: { __func: 'isCancelled' },
                  isRunning: { __func: 'isRunning' },
                  joiners: [],
                  name: 'myRootSaga',
                  result: { __func: 'result' },
                  setContext: { __func: 'setContext' }
                }
              },
              label: 'effectResolved(myRootSaga)',
              type: 'effectResolved',
              state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga
          },
          {
            desc: 'should send effectResolved of a side effect',
            finder: (m, i) => i === 5,
            expected: {
              action: { result: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 } },
              label: 'effectResolved',
              type: 'effectResolved',
              state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga
          },
          {
            desc: 'should send actionDispatched event',
            finder: (m, i) => i === 4,
            expected: {
              action: { action: { b: { __func: 'b' }, type: 'INCREMENT', with: 42 } },
              label: 'actionDispatched (INCREMENT)',
              type: 'actionDispatched(INCREMENT)',
              state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga
          },
          {
            desc: 'should send effectRejected event',
            finder: m => m.type === 'effectRejected',
            expected: {
              label: 'effectRejected (Sorry!)',
              type: 'effectRejected',
              state: { a: { value: 42 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga2
          },
          {
            desc: 'should send effectCancelled event',
            finder: m => m.type === 'effectCancelled',
            expected: {
              label: 'effectCancelled',
              type: 'effectCancelled',
              state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga3
          },
          {
            desc: 'should send effectTriggered(apiTimeout) event',
            finder: (m, i) => i === 2,
            expected: {
              action: {
                effect: {
                  '@@redux-saga/IO': true,
                  FORK: { args: [], context: null, fn: { __func: 'apiTimeout' } }
                },
                label: ''
              },
              type: 'effectTriggered(apiTimeout)',
              label: 'effectTriggered (apiTimeout())',
              state: { a: { value: 0 }, b: [1, 2, 3, 4], c: { __func: 'c' }, d: { __func: 'd' } }
            },
            saga: myRootSaga3
          },
          {
            desc: 'should send effectTriggered when takeEvery is used',
            finder: (m, i) => i === 2,
            expected: {
              type: 'effectTriggered(takeEvery)',
              label: 'effectTriggered (takeEvery(INCREMENT,[object Object]))'
            },
            saga: function * () {
              const task = yield takeEvery('INCREMENT', function * () {
                task.cancel();
              });
            }
          },
          {
            desc: 'should send effectTriggered when put is used',
            finder: (m, i) => i === 3,
            expected: {
              type: 'actionDispatched(XXX)',
              label: 'actionDispatched (XXX)'
            },
            saga: function * () {
              yield put({ type: 'XXX' });
            },
            only: false
          },
          {
            desc: 'should send effectTriggered when call is used',
            finder: (m, i) => i === 2,
            expected: {
              type: 'effectTriggered(api)',
              label: 'effectTriggered (api(a,b,42))'
            },
            saga: function * () {
              yield call(api, 'a', 'b', 42);
            },
            only: false
          },
          {
            desc: 'should send effectTriggered when fork is used',
            finder: (m, i) => i === 2,
            expected: {
              type: 'effectTriggered(watcher)',
              label: 'effectTriggered (watcher())'
            },
            saga: function * () {
              yield fork(function * watcher() {});
            },
            only: false
          },
          {
            desc: 'should send effectTriggered when select is used',
            finder: (m, i) => i === 2,
            expected: {
              type: 'effectTriggered(getValue)',
              label: 'effectTriggered (getValue(42))'
            },
            saga: function * () {
              yield select(function getValue(state, param) {
                return state.a.value;
              }, 42);
            }
          }
        ].forEach(({ expected, desc, saga, only, finder }) => {
          (only ? it.only : it)(desc, function (done) {
            const emitter = ReduxSagaEmitter();
            const sagaMiddleware = createSagaMiddleware({ sagaMonitor: emitter.sagaMonitor });
            const store = createStore(counter, applyMiddleware(sagaMiddleware));

            emitter.setStore(store);

            sagaMiddleware.run(saga).done.then(() => {
              if (only) {
                console.dir(messages.map((m, i) => ({ [i]: m })), { depth: null });
              }
              expect(messages.find(finder)).to.containSubset(expected);
              done();
            }).catch(done);

            store.dispatch({ type: 'INCREMENT', with: 42, b: function () {} });
          });
        });
      });
    });
  });
});
