# log-viewer
[![NPM](https://img.shields.io/npm/v/@svartalfheimr/log-viewer.svg)](https://www.npmjs.com/package/@svartalfheimr/log-viewer)

A simple Material UI log viewer.

## Usage

```javascript
import LogViewer from '@svartalfheimr/log-viewer';

const logs = [
  {timestamp: Date.parse('04 Dec 1995 00:12:00 GMT'), labels: {pod: 'pod-232-232323', server: 'Frank'}, log: 'This is a log entry'},
  ...
];

<LogViewer logs={logs} height="100%" />
```

## Installation

Yarn:
```shell
yarn add @svartalfheimr/log-viewer
```

NPM:
```shell
npm install @svartalfheimr/log-viewer
```
