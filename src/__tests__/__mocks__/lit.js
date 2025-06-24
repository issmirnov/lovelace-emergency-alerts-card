// Mock for lit library
class LitElement {
  static get properties() {
    return {};
  }

  static styles = {};

  constructor() {
    this.shadowRoot = {
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(),
    };
    this.updateComplete = Promise.resolve();
  }

  updated() {}
  requestUpdate() {}
  render() {
    return '';
  }
}

const html = (strings, ...values) => {
  return strings.join('');
};

const css = (strings, ...values) => {
  return strings.join('');
};

const PropertyValues = Map;

module.exports = {
  LitElement,
  html,
  css,
  PropertyValues,
};
