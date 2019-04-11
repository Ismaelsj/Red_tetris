import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
    beforeParse(window) {
        window.alert = window.console.log.bind(window.console);
    }
  });
const { window } = jsdom;

const copyProps = (src, target) => {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

copyProps(window, global);