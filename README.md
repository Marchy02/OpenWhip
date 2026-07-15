# OpenWhip

![Whip divider](assets/divider.png)

Sometimes claude code is going too shlow, and you must whip him into shape..

## Install + run

You need **Node.js ≥ 18** on every platform. This Wayland-ready fork is not on the npm
registry, so install it straight from GitHub:

```bash
npm install -g github:Marchy02/OpenWhip
openwhip
```

That gives you the app on Windows, macOS and Linux. On **Linux you also need one system
tool** for keyboard automation (npm can't install it — it's an OS package). Pick the
section for your setup below.

### Windows

Works out of the box — nothing else to install.

```powershell
npm install -g github:Marchy02/OpenWhip
openwhip
```

### macOS

Works out of the box. The first time you whip, macOS asks for **Accessibility**
permission — grant it to your terminal/app under
*System Settings → Privacy & Security → Accessibility*, otherwise the keystrokes are blocked.

### Linux

OpenWhip auto-detects your session and uses the right tool:

- **X11** → `xdotool`
- **Wayland** (Fedora / Arch / modern Debian default) → `ydotool`, or `wtype` on wlroots
  compositors (Sway, Hyprland)

Not sure which you're on? Run `echo $XDG_SESSION_TYPE`, or after cloning run
`node linux-input.js` — it prints your session and the backend it will use.

Install the tool for your distro and session:

| Distro | X11 | Wayland |
|--------|-----|---------|
| **Debian / Ubuntu** | `sudo apt install xdotool` | `sudo apt install ydotool` |
| **Fedora** | `sudo dnf install xdotool` | `sudo dnf install ydotool` |
| **Arch** | `sudo pacman -S xdotool` | `sudo pacman -S ydotool` |

#### Debian / Ubuntu

```bash
# X11:
sudo apt install xdotool
# Wayland (GNOME/KDE default on Debian 12+ and recent Ubuntu):
sudo apt install ydotool
sudo systemctl enable --now ydotool
```

#### Fedora

Fedora is **Wayland by default**, so you almost certainly want `ydotool`:

```bash
sudo dnf install ydotool
sudo systemctl enable --now ydotool
# only if you run an X11 session instead:
sudo dnf install xdotool
```

#### Arch

```bash
# Wayland (Sway, Hyprland, GNOME/KDE Wayland):
sudo pacman -S ydotool
sudo systemctl enable --now ydotool
# X11:
sudo pacman -S xdotool
```

> **Wayland note:** `ydotool` talks to the kernel through `/dev/uinput`, so its daemon
> (`ydotoold`) must be running (`sudo systemctl enable --now ydotool`) and your user must
> be able to access `/dev/uinput`. If whipping does nothing, that's the first thing to check.

## Controls

- Click tray icon: spawn whip.
- Click: drop whip.
- Whip him 😩💢
- It sends an interrupt (Ctrl-C) and one of 5 encouraging messages!

## Roadmap

- [x] Initial release! 🥳
- [x] Cease and desist letter from Anthropic
- [ ] Crypto miner
- [ ] Logs of how many times you whipped claude so when the robots come we can order people nicely for them
- [ ] Updated whip physics

## Ecosystem

The OFFICAL openwhip ecosystem token. 

Contract address: BRyUZbJkm9Pty4FUmTrBGno7U4Ga8TWzcKJJRLCBpump

Stay tuned for updates on X! 👀
https://x.com/blended_jpeg