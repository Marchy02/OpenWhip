// Linux keyboard automation across X11 and Wayland.
//
// The original OpenWhip only spoke xdotool, which is X11-only — so it did nothing
// on Fedora / Arch / modern Debian, which default to Wayland. This picks a backend
// that actually works for the current session:
//   - X11     → xdotool
//   - Wayland → ydotool (uinput, works on GNOME/KDE/wlroots) then wtype (wlroots)
//
// ponytail: three backends because the three target distros ship three input worlds;
// this is the actual requirement, not speculative abstraction.

const fs = require('fs');
const { execFile, execFileSync } = require('child_process');

// Linux input-event codes, for ydotool's `key CODE:STATE` syntax.
const KEY = { ctrl: 29, c: 46, enter: 28, alt: 56, tab: 15 };

const BACKENDS = {
  // Single xdotool call does interrupt + type + Enter, matching the original behaviour.
  xdotool: {
    macro: text => [['xdotool', [
      'key', '--clearmodifiers', 'ctrl+c',
      'type', '--delay', '1', '--clearmodifiers', '--', text,
      'key', 'Return',
    ]]],
    refocus: () => [['xdotool', ['key', '--clearmodifiers', 'alt+Tab']]],
  },
  ydotool: {
    macro: text => [
      ['ydotool', ['key', `${KEY.ctrl}:1`, `${KEY.c}:1`, `${KEY.c}:0`, `${KEY.ctrl}:0`]],
      ['ydotool', ['type', text]],
      ['ydotool', ['key', `${KEY.enter}:1`, `${KEY.enter}:0`]],
    ],
    refocus: () => [['ydotool', ['key', `${KEY.alt}:1`, `${KEY.tab}:1`, `${KEY.tab}:0`, `${KEY.alt}:0`]]],
  },
  wtype: {
    macro: text => [
      ['wtype', ['-M', 'ctrl', 'c', '-m', 'ctrl']],
      ['wtype', ['--', text]],
      ['wtype', ['-k', 'Return']],
    ],
    refocus: () => [['wtype', ['-M', 'alt', '-k', 'Tab', '-m', 'alt']]],
  },
};

function isWayland() {
  return process.env.XDG_SESSION_TYPE === 'wayland' || !!process.env.WAYLAND_DISPLAY;
}

function hasCmd(name) {
  try {
    execFileSync('sh', ['-c', `command -v ${name}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/** Ordered backend preference for this session; first installed one wins. */
function candidates() {
  return isWayland() ? ['ydotool', 'wtype', 'xdotool'] : ['xdotool', 'ydotool', 'wtype'];
}

let cached; // { name } | null; undefined = not yet resolved
function pickBackend() {
  if (cached !== undefined) return cached;
  const name = candidates().find(hasCmd);
  cached = name ? { name } : null;
  return cached;
}

/** apt/dnf/pacman line for the current distro, read from /etc/os-release. */
function installHint() {
  const tool = isWayland() ? 'ydotool' : 'xdotool';
  let id = '', like = '';
  try {
    const txt = fs.readFileSync('/etc/os-release', 'utf8');
    id = (txt.match(/^ID=(.*)$/m)?.[1] || '').replace(/"/g, '');
    like = (txt.match(/^ID_LIKE=(.*)$/m)?.[1] || '').replace(/"/g, '');
  } catch { /* fall through to generic hint */ }

  const family = `${id} ${like}`;
  let cmd;
  if (/\b(debian|ubuntu)\b/.test(family)) cmd = `sudo apt install ${tool}`;
  else if (/\b(fedora|rhel|centos)\b/.test(family)) cmd = `sudo dnf install ${tool}`;
  else if (/\barch\b/.test(family)) cmd = `sudo pacman -S ${tool}`;
  else cmd = `install ${tool} with your package manager`;

  let hint = `${tool} not found. Install it: ${cmd}`;
  if (tool === 'ydotool') hint += ' (then start the daemon: sudo systemctl enable --now ydotool, and ensure your user can access /dev/uinput)';
  return hint;
}

/** Run [cmd, args] steps in order with a small gap so the interrupt lands before typing. */
function runSteps(steps, onError) {
  const step = i => {
    if (i >= steps.length) return;
    const [cmd, args] = steps[i];
    execFile(cmd, args, err => {
      if (err) { onError(err); return; } // stop the chain on first failure
      setTimeout(() => step(i + 1), i === 0 ? 250 : 20);
    });
  };
  step(0);
}

function sendMacroLinux(text, onError = () => {}) {
  const backend = pickBackend();
  if (!backend) { onError(new Error(installHint())); return; }
  runSteps(BACKENDS[backend.name].macro(text), onError);
}

function refocusLinux(onError = () => {}) {
  const backend = pickBackend();
  if (!backend) { onError(new Error(installHint())); return; }
  runSteps(BACKENDS[backend.name].refocus(), onError);
}

module.exports = { sendMacroLinux, refocusLinux, installHint, isWayland, _pickBackend: pickBackend, _BACKENDS: BACKENDS };

// ponytail: minimal self-check — `node linux-input.js` asserts every backend emits
// well-formed steps and prints what would run on this machine.
if (require.main === module) {
  const assert = require('assert');
  for (const [name, b] of Object.entries(BACKENDS)) {
    const macro = b.macro('GO FASTER');
    const refocus = b.refocus();
    assert(macro.length >= 1 && macro.every(s => Array.isArray(s) && typeof s[0] === 'string' && Array.isArray(s[1])), `${name} macro malformed`);
    assert(refocus.length >= 1 && refocus.every(s => Array.isArray(s) && typeof s[0] === 'string'), `${name} refocus malformed`);
    assert(macro.some(s => JSON.stringify(s).includes('GO FASTER')), `${name} macro drops the text`);
  }
  assert(candidates()[0] === (isWayland() ? 'ydotool' : 'xdotool'), 'candidate order wrong for session');
  const picked = pickBackend();
  console.log('self-check OK');
  console.log('session:', isWayland() ? 'wayland' : 'x11');
  console.log('backend:', picked ? picked.name : `none — ${installHint()}`);
}
