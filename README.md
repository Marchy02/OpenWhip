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
> (`ydotoold`) must be running and your user must be able to access `/dev/uinput`. If
> whipping does nothing, that's the first thing to check — see the ydotool section below.

#### Making ydotool actually work (the socket gotcha)

The `sudo systemctl enable --now ydotool` system service runs `ydotoold` as **root**, and
its control socket ends up root-only — so your normal user's `ydotool` can't reach it and
the whip does nothing. On a single-user desktop, run it as a **user service** instead:

```bash
# stop the root service if you enabled it
sudo systemctl disable --now ydotool

# grant your user access to /dev/uinput (once)
echo 'KERNEL=="uinput", GROUP="input", MODE="0660", OPTIONS+="static_node=uinput"' \
  | sudo tee /etc/udev/rules.d/60-uinput.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
sudo usermod -aG input "$USER"   # log out/in afterwards

# run ydotoold as your user, persistently
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/ydotool.service <<'EOF'
[Unit]
Description=ydotool user daemon
After=graphical-session.target
[Service]
ExecStart=/usr/bin/ydotoold
Restart=on-failure
[Install]
WantedBy=default.target
EOF
systemctl --user enable --now ydotool.service

# verify: this should print nothing and exit 0
ydotool mousemove -x 0 -y 0
```

> Some distros (incl. recent Fedora) already grant the seat user `/dev/uinput` via a udev
> ACL, so the udev-rule + `usermod` step may be unnecessary — try the user service first.

### Tray-less window managers (Hyprland, Sway, …)

OpenWhip normally lives in the system tray, but tiling WMs like **Hyprland** and **Sway**
have no tray unless a bar (e.g. Waybar with the `tray` module) provides one. Instead, drive
it from a keybind — a second `openwhip` invocation cracks the whip on the already-running one:

```bash
openwhip        # start once (keeps running; put this in your autostart)
openwhip whip   # crack the whip — bind this to a key
```

Hyprland (`~/.config/hypr/hyprland.conf`):

```ini
exec-once = openwhip
bind = SUPER, X, exec, openwhip whip
```

Sway (`~/.config/sway/config`):

```
exec openwhip
bindsym $mod+x exec openwhip whip
```

> **Wayland feedback:** the swingable whip overlay is an X11/Windows/macOS thing — a
> transparent, mouse-driven, non-focus-stealing fullscreen window can't map under Wayland
> compositors. On Wayland the whip still fires the interrupt + phrase; you get a desktop
> **notification** (`notify-send`) as visible feedback instead of the animation.

## Controls

- **Keybind / CLI:** `openwhip whip` cracks the whip (best on Hyprland/Sway/Wayland).
- **Tray icon:** click to spawn the whip overlay, click again to drop it. Right-click → *Whip!*.
  (Tray needs a tray host — e.g. Waybar's `tray` module; absent on bare Hyprland/Sway.)
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