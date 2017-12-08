# Emitters for Stent's Chrome extension

Small JavaScript files that emit actions to the StentDevTools Chrome Extension.

## Installation

`yarn add stent-dev-tools-emitters -D` or `npm install stent-dev-tools-emitters -D`.

## Stent integration

```js
import { Machine } from 'stent';
import StentEmitter from 'stent-dev-tools-emitters/lib/StentEmitter';

Machine.addMiddleware(StentEmitter);
```
