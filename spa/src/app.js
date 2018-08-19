import { div, a } from '@cycle/dom';
import xs from 'xstream';
import { Settings } from './settings';
import { List } from './list';

export function App(sources) {
  const settingsSinks = Settings(sources);
  const listSinks = List(sources);
  const view$ = getView(settingsSinks.dom, listSinks.dom);
  return {
    dom: view$,
    http: listSinks.http,
    onion: settingsSinks.onion
  };
}

function getView(settingsView$, listView$) {
  return xs.combine(settingsView$, listView$).map(makePageView);
}

function makePageView([settingsView, listView]) {
  const separator = div('.separator');
  const footer = a(
    '.footer',
    { attrs: { href: 'https://github.com/mathieueveillard/cycle-lazy-load-demo' } },
    'Built by @meveillard with Cycle.js and cycle-lazy-load'
  );
  return div('.page-container', div('.page', [div('.grid', [settingsView, separator, listView]), footer]));
}
