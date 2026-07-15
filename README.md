# OpenWhip

![Whip divider](assets/divider.png)

Sometimes claude code is going too shlow, and you must whip him into shape..

## Install + run

```bash
npm install -g openwhip
openwhip
```

windows and mac supported out of the box. Linux is a special snowflake so you need a keyboard-automation tool. OpenWhip picks the right one for your session automatically:

- **X11** → `xdotool`
- **Wayland** (Fedora / Arch / modern Debian default) → `ydotool` (works on GNOME, KDE, wlroots), or `wtype` on wlroots compositors

Install the one for your setup:

| Distro | X11 | Wayland |
|--------|-----|---------|
| Debian / Ubuntu | `sudo apt install xdotool` | `sudo apt install ydotool` |
| Fedora | `sudo dnf install xdotool` | `sudo dnf install ydotool` |
| Arch | `sudo pacman -S xdotool` | `sudo pacman -S ydotool` |

On Wayland, `ydotool` needs its daemon running and access to `/dev/uinput`:

```bash
sudo systemctl enable --now ydotool
```

Not sure what you have? Run `node linux-input.js` in the repo — it prints your session type and which backend it will use.

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