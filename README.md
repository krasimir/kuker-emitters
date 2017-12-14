# Emitters for Kuker

![kuker](./img/kuker_banner.jpg)

Pluggable modules that send events to [Kuker](https://github.com/krasimir/kuker). 

## Installation

`yarn add kuker-emitters -D` or `npm install kuker-emitters -D`. There're also standalone versions in [here](./standalone). You may grab the files, include them in your page and you'll have globals like `ReduxEmitter`, `ReduxSagaEmitter` or `StentEmitter`.

*These standalone files work via [rawgit](https://rawgit.com/krasimir/kuker-emitters/master/standalone/ReduxEmitter.js) too.*

## BaseEmitter

```js
import BaseEmitter from 'kuker-emitters/lib/BaseEmitter';

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
import ReduxEmitter from 'kuker-emitters/lib/ReduxEmitter';

const middleware = ReduxEmitter();

const store = createStore(<reducer>, applyMiddleware(middleware));
```

[Codepen example](https://codepen.io/krasimir/pen/vpYrqw)

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

[Codepen example](https://codepen.io/krasimir/pen/vpYrqw)

## Integration with [Stent](https://github.com/krasimir/stent)

```js
import { Machine } from 'stent';
import StentEmitter from 'kuker-emitters/lib/StentEmitter';

Machine.addMiddleware(StentEmitter);
```

[Codepen example](https://codepen.io/krasimir/pen/YEjYvR)

## Integration with [Machina.js](http://machina-js.org/)

```js
import machina from 'machina';
import MachinaEmitter from 'kuker-emitters/lib/MachinaEmitter';

const machine = new machina.Fsm({...});

MachinaEmitter(machine);
```

[Codepen example](https://codepen.io/krasimir/pen/aEOpvE)