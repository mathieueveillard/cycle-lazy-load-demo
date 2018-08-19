import { div, h1 } from '@cycle/dom';
import build from 'cycle-lazy-load';
import { Stream } from 'xstream';

export function List({ dom, resize, http, time, onion }) {
  const scroll$ = getScroll(dom);
  const resize$ = getResize(resize);
  const list$ = getModel(http);
  const settings$ = getSettings(onion);
  const { loadInstruction$, error$ } = getInstruction(time)({ scroll$, resize$ }, list$, settings$);
  const request$ = getRequest(loadInstruction$);
  const view$ = getView(list$, error$);
  return {
    dom: view$,
    http: request$
  };
}

function getScroll(dom) {
  return dom.select('.list').events('wheel');
}

function getResize({ resize$ }) {
  return resize$;
}

function getModel(http) {
  return http
    .select('search')
    .flatten()
    .map(response => response.body)
    .fold(appendResult, []);
}

function appendResult(acc, cur) {
  return [...acc, ...cur];
}

function getSettings(onion) {
  return onion.state$.map(({ settings }) => settings);
}

function getInstruction(time) {
  return function getInstructionsAndErrors({ scroll$, resize$ }, list$, settings$) {
    const { getChainedLoadInstruction } = build(time);

    const error$ = Stream.create();
    let buildCount = 0;
    function buildLoadInstructionWithErrorManagement(error) {
      const numberOfSettingsToDrop = buildCount === 0 ? 0 : 1;
      const newSettings$ = settings$.drop(numberOfSettingsToDrop);
      const loadInstruction$ = getChainedLoadInstruction({ scroll$, resize$ }, list$, newSettings$).replaceError(
        buildLoadInstructionWithErrorManagement
      );
      error$.shamefullySendNext(error);
      buildCount++;
      return loadInstruction$;
    }

    const loadInstruction$ = buildLoadInstructionWithErrorManagement();

    return {
      loadInstruction$,
      error$
    };
  };
}

function getRequest(loadInstruction$) {
  return loadInstruction$.replaceError(ignoreErrors).map(makeRequest);
}

function ignoreErrors() {
  return Stream.never();
}

function makeRequest({ quantity, after }) {
  return {
    category: 'search',
    url: 'http://localhost:3000/data/_search',
    method: 'POST',
    type: 'json',
    accept: 'json',
    send: {
      size: quantity,
      search_after: after
    }
  };
}

function getView(list$, error$) {
  const listView$ = getListView(list$);
  const errorView$ = getErrorView(error$);
  return Stream.merge(errorView$, listView$);
}

function getListView(list$) {
  return list$.map(makeDataListView);
}

function makeDataListView(list) {
  return div('.list', list.map(makeDataView));
}

function makeDataView({ sort, body }) {
  return div('.data--container', [div('.data--sort', `Sort: [${sort}]`), div('.data--body', body)]);
}

function getErrorView(error$) {
  return error$.map(makeErrorView);
}

function makeErrorView(error) {
  return div('.error', [h1('Error'), div(error)]);
}
