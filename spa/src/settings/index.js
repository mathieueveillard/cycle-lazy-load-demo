import { div, h1, input } from '@cycle/dom';
import xs from 'xstream';
import debounce from 'xstream/extra/debounce';

const DEFAULT_SETTINGS = {
  contentHeight: 70,
  buffer: 4000,
  minQuantity: 20,
  maxQuantity: 100,
  debounce: 0,
  throttle: 0
};

const INPUT_STEPS = {
  contentHeight: 10,
  buffer: 100,
  minQuantity: 10,
  maxQuantity: 10,
  debounce: 5,
  throttle: 50
};

export function Settings({ dom }) {
  const settings$ = getModel(dom);
  const view$ = getView(settings$);
  const reducer$ = getReducer(settings$);
  return {
    dom: view$,
    onion: reducer$
  };
}

function getModel(dom) {
  const settingsInputs$ = getSettingsInputs(dom);
  return settingsInputs$.fold((acc, cur) => Object.assign(acc, cur), DEFAULT_SETTINGS);
}

function getSettingsInputs(dom) {
  const getInput = getSettingInput(dom);
  const contentHeight$ = getInput('contentHeight');
  const buffer$ = getInput('buffer');
  const minQuantity$ = getInput('minQuantity');
  const maxQuantity$ = getInput('maxQuantity');
  const debounce$ = getInput('debounce');
  const throttle$ = getInput('throttle');
  return xs.merge(contentHeight$, buffer$, debounce$, throttle$, minQuantity$, maxQuantity$);
}

function getSettingInput(dom) {
  return function(settingName) {
    return dom
      .select(`.settings--${settingName}`)
      .events('input')
      .map(extractValue)
      .filter(isValidValue)
      .compose(debounce(1000))
      .map(makePartialSettingsObject(settingName));
  };
}

function extractValue(event) {
  return parseInt(event.target.value);
}

function isValidValue(value) {
  return !isNaN(value);
}

function makePartialSettingsObject(settingName) {
  return function(value) {
    const settings = {};
    settings[settingName] = value;
    return settings;
  };
}

function getView(settings$) {
  return settings$.map(makeSettingsView);
}

function makeSettingsView(settings) {
  return div('.settings', [
    h1('Settings'),
    div('.setting-container', [
      input('.settings--contentHeight', {
        attrs: { type: 'number', min: 0, step: INPUT_STEPS.contentHeight, value: settings.contentHeight }
      }),
      div('Minimum content height (px)')
    ]),
    div('.setting-container', [
      input('.settings--buffer', {
        attrs: { type: 'number', min: 0, step: INPUT_STEPS.buffer, value: settings.buffer }
      }),
      div('Buffer (px)')
    ]),
    div('.setting-container', [
      input('.settings--minQuantity', {
        attrs: { type: 'number', min: 0, step: INPUT_STEPS.minQuantity, value: settings.minQuantity }
      }),
      div('Minimum quantity per request')
    ]),
    div('.setting-container', [
      input('.settings--maxQuantity', {
        attrs: { type: 'number', min: 0, step: INPUT_STEPS.maxQuantity, value: settings.maxQuantity }
      }),
      div('Maximum quantity per request')
    ]),
    div('.setting-container', [
      input('.settings--debounce', {
        attrs: { type: 'number', min: 0, step: INPUT_STEPS.debounce, value: settings.debounce }
      }),
      div('Debounce period (ms)')
    ]),
    div('.setting-container', [
      input('.settings--throttle', {
        attrs: { type: 'number', min: 0, step: INPUT_STEPS.throttle, value: settings.throttle }
      }),
      div('Throttle period (ms)')
    ])
  ]);
}

function getReducer(settings$) {
  return settings$.map(settings => () => ({ settings }));
}
