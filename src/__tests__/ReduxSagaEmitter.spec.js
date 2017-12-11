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
            desc: 'should send effectTriggered(root) event',
            finder: (m, i) => i === 1,
            expected: {
              type: '@saga_effectTriggered'
            },
            saga: myRootSaga,
            only: false
          },
          {
            desc: 'should send effectResolved event',
            finder: (m, i) => i === 2,
            expected: {
              type: '@saga_effectResolved'
            },
            saga: myRootSaga,
            only: false
          },
          {
            desc: 'should send actionDispatched event',
            finder: (m, i) => i === 3,
            expected: {
              type: '@saga_actionDispatched'
            },
            saga: myRootSaga,
            only: false
          },
          {
            desc: 'should send effectRejected event',
            finder: (m, i) => i === 4,
            expected: {
              type: '@saga_effectRejected'
            },
            saga: myRootSaga2,
            only: false
          },
          {
            desc: 'should send effectCancelled event',
            finder: (m, i) => i === 4,
            expected: {
              type: '@saga_effectCancelled'
            },
            saga: myRootSaga3,
            only: false
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
