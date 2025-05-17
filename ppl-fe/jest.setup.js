import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
// jest.setup.js
globalThis.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({});

