# Emitters for Stent's Chrome extension

Small JavaScript files that emit events to the StentDevTools Chrome Extension.

## Installation

`yarn add stent-dev-tools-emitters -D` or `npm install stent-dev-tools-emitters -D`.

## Stent integration

```js
import { Machine } from 'stent';
import StentEmitter from 'stent-dev-tools-emitters/lib/StentEmitter';

Machine.addMiddleware(StentEmitter);
```

## Redux integration

```js
import { createStore, applyMiddleware } from 'redux';
import StentEmitter from 'stent-dev-tools-emitters/lib/ReduxEmitter';

const middleware = ReduxEmitter();

const store = createStore(<reducer>, applyMiddleware(middleware));
```