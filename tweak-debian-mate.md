# Tweak Debian Mate

Some useful tips for making the user experience better in a default install of Debian Mate. Please note: these tips are based on how I prefer to have my desktop environment. Your millage may vary.

## Remove desktop icons

Install `mate-tweak` package. Run it, and un-check the desktop icons.

## Enable touchpad tap-to-click

Add `Option "Tapping" "on"` to file `/usr/share/X11/xorg.conf.d/40-libinput.conf`, for the `touchpad` section.

## Add `ru`, and `ua` keyboard layouts

Install `keyboard-configuration`, and add to the file `/etc/default/keyboard` the following:

```
XKBMODEL="pc105"
XKBLAYOUT="us,ru,ua"
XKBVARIANT=""
XKBOPTIONS="terminate:ctrl_alt_bksp,grp:lwin_switch"
BACKSPACE="guess"
```

# Disable default Gnome master passwords/PGP passwords

```
1.) Go to: `System` -> `Preferences` -> `Personal` -> `Startup Applications`.
2.) Disable: `Secret Storage Service` and `SSH Key Agent`
```

Add the following lines to the file `~/.gnupg/gpg-agent.conf`:

```
default-cache-ttl 34560000
max-cache-ttl 34560000

default-cache-ttl-ssh 34560000
max-cache-ttl-ssh 34560000
```

Install CLI tool for GNUpg passphrase, and make it the default:

```
sudo apt install pinentry-tty
sudo update-alternatives --config pinentry
```

