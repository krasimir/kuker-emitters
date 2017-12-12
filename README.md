# Emitters for Kuker

![kuker](./img/kuker_banner.jpg)

Pluggable modules that send events to [Kuker](https://github.com/krasimir/kuker). 

## Installation

`yarn add kuker-emitters -D` or `npm install kuker-emitters -D`.

## Integration with [Redux](https://redux.js.org/)

```js
import { createStore, applyMiddleware } from 'redux';
import ReduxEmitter from 'kuker-emitters/lib/ReduxEmitter';

const middleware = ReduxEmitter();

const store = createStore(<reducer>, applyMiddleware(middleware));
```

## Integration with [redux-saga](https://redux-saga.js.org/)

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

## Integration with [Stent](https://github.com/krasimir/stent)

```js
import { Machine } from 'stent';
import StentEmitter from 'kuker-emitters/lib/StentEmitter';

Machine.addMiddleware(StentEmitter);
```