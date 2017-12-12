# Emitters for Stent's Chrome extension

Small JavaScript files that emit events to the StentDevTools Chrome Extension.

## Installation

`yarn add kuker-emitters -D` or `npm install kuker-emitters -D`.

## Stent integration

```js
import { Machine } from 'stent';
import StentEmitter from 'kuker-emitters/lib/StentEmitter';

Machine.addMiddleware(StentEmitter);
```

## Redux integration

```js
import { createStore, applyMiddleware } from 'redux';
import ReduxEmitter from 'kuker-emitters/lib/ReduxEmitter';

const middleware = ReduxEmitter();

const store = createStore(<reducer>, applyMiddleware(middleware));
```

## Redux-saga integration

```js
import { createStore, applyMiddleware } from 'redux';
import ReduxSagaEmitter from 'kuker-emitters/lib/ReduxSagaEmitter';
import createSagaMiddleware from 'redux-saga';

const emitter = ReduxSagaEmitter();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor: emitter.sagaMonitor });

const store = createStore(<reducer>, applyMiddleware(sagaMiddleware));

// This bit is really important.
// Without it you won't get the current state of the app with every event.
emitter.setStore(store);

sagaMiddleware.run(rootSaga)
```