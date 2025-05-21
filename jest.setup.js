require('@testing-library/jest-dom');

// Solo definir TextEncoder/TextDecoder si no existen (jsdom los omite)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
const streams = require('web-streams-polyfill');
global.ReadableStream = streams.ReadableStream;
global.WritableStream = streams.WritableStream;
global.TransformStream = streams.TransformStream;

// Mock para MessagePort (necesario para undici)
class MessagePort {
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
  start() {}
  onmessage = null;
}
global.MessagePort = MessagePort;

const { fetch, Request, Response, Headers } = require('undici');


global.fetch = fetch
global.Request = Request
global.Response = Response
global.Headers = Headers

// jest.setup.js
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
