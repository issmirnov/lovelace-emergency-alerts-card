// Mock Home Assistant environment for testing

// Mock customElements
(globalThis as any).customElements = {
  define: () => {},
  get: () => {},
  whenDefined: () => Promise.resolve(),
};

// Mock window object
(globalThis as any).window = (globalThis as any).window || {};
(globalThis as any).window.customCards = [];

// Mock Home Assistant object
const mockHass = {
  states: {},
  services: {
    async_call: () => Promise.resolve(),
  },
  callService: () => Promise.resolve(),
  config: {
    language: 'en',
  },
};

// Make mockHass available globally for tests
(globalThis as any).mockHass = mockHass; 