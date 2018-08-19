import { run } from '@cycle/run';
import { makeDOMDriver, div } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { makeResizeDriver } from 'cycle-resize';
import { timeDriver } from '@cycle/time';
import xs from 'xstream';
import build from 'cycle-lazy-load';

const SETTINGS = {
  contentHeight: 70,
  buffer: 4000
};

const drivers = {
  dom: makeDOMDriver('#app'),
  resize: makeResizeDriver(),
  http: makeHTTPDriver(),
  time: timeDriver
};

function main({ dom, resize, http, time }) {
  const { getChainedLoadInstruction } = build(time);
  const scroll$ = dom.select('.list').events('wheel');
  const resize$ = resize.resize$;
  const list$ = getModel(http);
  const settings$ = xs.of(SETTINGS);
  const loadInstruction$ = getChainedLoadInstruction({ scroll$, resize$ }, list$, settings$);
  const request$ = getRequest(loadInstruction$);
  const view$ = getView(list$);
  return {
    dom: view$,
    http: request$
  };
}

run(main, drivers);

function getModel(http) {
  return http
    .select('search')
    .flatten()
    .map(response => response.body)
    .fold((acc, cur) => [...acc, ...cur], []);
}

function getView(list$) {
  return list$.map(list => div('.list', list.map(makeDataView)));
}

function makeDataView({ sort, body }) {
  // This is up to you
  return div('.data--container', [div('.data--sort', `Sort: [${sort}]`), div('.data--body', body)]);
}

function getRequest(loadInstruction$) {
  return loadInstruction$.map(({ quantity, after }) => ({
    category: 'search',
    url: 'http://localhost:3000/data/_search',
    method: 'POST',
    type: 'json',
    accept: 'json',
    send: {
      size: quantity,
      search_after: after
    }
  }));
}
