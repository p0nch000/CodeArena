import '@testing-library/jest-dom';
import { fetch, Request, Response, Headers } from 'undici'

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
