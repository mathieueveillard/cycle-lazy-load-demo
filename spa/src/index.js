import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { makeResizeDriver } from 'cycle-resize';
import { timeDriver } from '@cycle/time';
import { App } from './app';
import onionify from 'cycle-onionify';

const main = onionify(App);

const drivers = {
  dom: makeDOMDriver('#app'),
  resize: makeResizeDriver(),
  http: makeHTTPDriver(),
  time: timeDriver
};

run(main, drivers);
