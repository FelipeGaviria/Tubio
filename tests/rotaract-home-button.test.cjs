const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup() {
  let now = 0, id = 0, edits = 0, navigations = 0;
  const timers = new Map(), cleanup = [];
  const react = {
    useRef: (current) => ({ current }),
    useState: (value) => [value, () => {}],
    useEffect: (effect) => { const dispose = effect(); if (dispose) cleanup.push(dispose); },
  };
  const context = {
    exports: {}, window: { location: { hash: '' } },
    require: (name) => name === 'react' ? react : name === 'react/jsx-runtime' ? require(name) : { RotaryWheel: () => null },
    setTimeout: (fn, delay) => { const token = ++id; timers.set(token, { fn, at: now + delay }); return token; },
    clearTimeout: (token) => timers.delete(token),
  };
  const source = fs.readFileSync('components/RotaractHomeButton.tsx', 'utf8');
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText, context);
  const props = context.exports.RotaractHomeButton({ active: false, unlocked: false, onNavigate: () => navigations++, onEdit: () => edits++ }).props;
  return { props, advance(ms) { now += ms; for (const [key, timer] of timers) if (timer.at <= now) { timers.delete(key); timer.fn(); } }, counts: () => ({ edits, navigations }), cleanup: () => cleanup.forEach((fn) => fn()) };
}
const down = { isPrimary: true, button: 0, clientX: 20, clientY: 20 };
test('a short tap navigates without requesting the code', () => {
  const s = setup(); s.props.onPointerDown(down); s.advance(500); s.props.onPointerUp(); s.props.onClick(); s.advance(4000);
  assert.deepEqual(s.counts(), { edits: 0, navigations: 1 });
});
test('holding requires 4000ms and suppresses the subsequent navigation click', () => {
  const s = setup(); s.props.onPointerDown(down); s.advance(3999); assert.equal(s.counts().edits, 0);
  s.advance(1); assert.equal(s.counts().edits, 1); s.props.onPointerUp(); s.props.onClick();
  assert.deepEqual(s.counts(), { edits: 1, navigations: 0 });
});
test('movement, cancellation, leaving, blur and unmount cancel the timer', () => {
  for (const cancel of ['onPointerCancel', 'onPointerLeave', 'onBlur', 'move', 'unmount']) {
    const s = setup(); s.props.onPointerDown(down); s.advance(2000);
    if (cancel === 'move') s.props.onPointerMove({ clientX: 60, clientY: 20 });
    else if (cancel === 'unmount') s.cleanup();
    else s.props[cancel]();
    s.advance(5000); assert.equal(s.counts().edits, 0, cancel);
  }
});
test('keyboard holds support the same duration without auto-repeat restarting it', () => {
  const s = setup(); const key = { key: ' ', repeat: false, preventDefault() {} };
  s.props.onKeyDown(key); s.advance(2000); s.props.onKeyDown({ ...key, repeat: true }); s.advance(2000); s.props.onKeyUp(key);
  assert.deepEqual(s.counts(), { edits: 1, navigations: 0 });
});
