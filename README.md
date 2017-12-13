# Emitters for Kuker

![kuker](./img/kuker_banner.jpg)

Pluggable modules that send events to [Kuker](https://github.com/krasimir/kuker). 

## Installation

`yarn add kuker-emitters -D` or `npm install kuker-emitters -D`. There're also standalone versions in [here](./standalone). You may grab the files, include them in your page and you'll have globals like `ReduxEmitter`, `ReduxSagaEmitter` or `StentEmitter`.

*These standalone files work via [rawgit](https://rawgit.com/krasimir/kuker-emitters/master/standalone/ReduxEmitter.js) too.*

## BaseEmitter

![base emitter](./img/screenshot_custom_event.jpg)

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

## Integration with [Redux](https://redux.js.org/)

![base emitter](./img/redux_screenshot_2.jpg)

```js
import { createStore, applyMiddleware } from 'redux';
import ReduxEmitter from 'kuker-emitters/lib/ReduxEmitter';

const middleware = ReduxEmitter();

const store = createStore(<reducer>, applyMiddleware(middleware));
```

[Codepen](https://codepen.io/krasimir/pen/vpYrqw) to play with.

## Integration with [redux-saga](https://redux-saga.js.org/)

![base emitter](./img/redux_screenshot_1280x800.jpg)

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

[Codepen](https://codepen.io/krasimir/pen/vpYrqw) to play with.

## Integration with [Stent](https://github.com/krasimir/stent)

![base emitter](./img/stent_screenshot_1280x800.jpg)

```js
import { Machine } from 'stent';
import StentEmitter from 'kuker-emitters/lib/StentEmitter';

Machine.addMiddleware(StentEmitter);
```

[Codepen](https://codepen.io/krasimir/pen/YEjYvR) to play with.