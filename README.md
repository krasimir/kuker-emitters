# Emitters for Kuker

Integrate [Kuker](https://github.com/krasimir/kuker) with:

* [Redux](#integration-with-redux)
* [redux-saga](#integration-with-redux-saga)
* [Stent](#integration-with-stent)
* [Machina.js](#integration-with-machinajs)

![kuker](./img/kuker_banner.jpg) 

Pluggable modules that send events to [Kuker](https://github.com/krasimir/kuker). These emitters are framework specific and provide nicely formatted output. If you want to send a message manually you are free do it by calling:

```js
window.postMessage({
  kuker: true,
  type: 'adding money to my account',
  origin: 'something',
  label: 'hello',
  time: (new Date()).getTime(),
  state: { bank: { money: 100 } },
  icon: 'fa-money',
  color: '#bada55'
}, '*');
```

`kuker: true` and `type` are mandatory.

## Installation

`yarn add kuker-emitters -D` or `npm install kuker-emitters -D`. There're also standalone versions in [here](./standalone). You may grab the files, include them in your page and you'll have globals like `ReduxEmitter`, `ReduxSagaEmitter` or `StentEmitter`.

*These standalone files work via [rawgit](https://rawgit.com/krasimir/kuker-emitters/master/standalone/ReduxEmitter.js) too.*

## BaseEmitter

```js
import { BaseEmitter } from 'kuker-emitters';

const emit = BaseEmitter();

emit({
  type: 'adding money to my account',
  label: 'hello',
  state: { bank: { money: 100 } },
  icon: 'fa-money',
  color: '#bada55'
});
```

[Codepen example](https://codepen.io/krasimir/pen/ypNVVm)

## Integration with [Redux](https://redux.js.org/)

```js
import { createStore, applyMiddleware } from 'redux';
import { ReduxEmitter } from 'kuker-emitters';

const middleware = ReduxEmitter();

const store = createStore(<reducer>, applyMiddleware(middleware));
```

[Codepen example](https://codepen.io/krasimir/pen/vpYrqw)

## Integration with [redux-saga](https://redux-saga.js.org/)

```js
import { createStore, applyMiddleware } from 'redux';
import { ReduxSagaEmitter } from 'kuker-emitters';
import createSagaMiddleware from 'redux-saga';

const emitter = ReduxSagaEmitter();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor: emitter.sagaMonitor });

const store = createStore(<reducer>, applyMiddleware(sagaMiddleware));

// This bit is really important.
// Without it you won't get the current state of the app with every event.
emitter.setStore(store);

sagaMiddleware.run(rootSaga)
```

[Codepen example](https://codepen.io/krasimir/pen/vpYrqw)

## Integration with [Stent](https://github.com/krasimir/stent)

```js
import { Machine } from 'stent';
import { StentEmitter } from 'kuker-emitters';

Machine.addMiddleware(StentEmitter());
```

[Codepen example](https://codepen.io/krasimir/pen/YEjYvR)

## Integration with [Machina.js](http://machina-js.org/)

```js
import machina from 'machina';
import { MachinaEmitter } from 'kuker-emitters';

const machine = new machina.Fsm({...});

MachinaEmitter(machine);
```

[Codepen example](https://codepen.io/krasimir/pen/aEOpvE)