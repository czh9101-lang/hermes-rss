const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const { randomUUID } = require('node:crypto');

module.exports = function loadPlugin(file = 'plugin.js', globals = {}) {
  const source = readFileSync(resolve(__dirname, '..', file), 'utf8')
    .replace(/^import\s[\s\S]*?from\s+"[^"]+";\s*/gm, '')
    .replace(/^export\s*\{[\s\S]*?\};?\s*$/m, '');
  const context = vm.createContext({ URL, crypto: { randomUUID }, TextEncoder, TextDecoder,
    Blob, Response, DecompressionStream, atob, btoa, setTimeout, clearTimeout, setInterval, clearInterval,
    console, ...globals });
  vm.runInContext(source, context, { filename: file });
  return context;
};
