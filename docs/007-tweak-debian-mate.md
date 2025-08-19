# Tweak Debian Mate

Some useful tips for making the user experience better in a default install of Debian Mate. Please note: these tips are based on how I prefer to have my desktop environment. Your millage may vary.

## Remove desktop icons

Install `mate-tweak` package. Run it, and un-check the desktop icons.

## Enable touchpad tap-to-click

Add `Option "Tapping" "on"` to file `/usr/share/X11/xorg.conf.d/40-libinput.conf`, for the `touchpad` section.

## Add `ru`, and `ua` keyboard layouts

Install `keyboard-configuration`, and add to the file `/etc/default/keyboard` the following:

```text
XKBMODEL="pc105"
XKBLAYOUT="us,ru,ua"
XKBVARIANT=""
XKBOPTIONS="terminate:ctrl_alt_bksp,grp:lwin_switch"
BACKSPACE="guess"
```

If `lwin_switch` doesn't work for you, try `lwin_toggle` instead.

## Disable default Gnome master passwords/PGP passwords

```text
1.) Go to: `System` -> `Preferences` -> `Personal` -> `Startup Applications`.
2.) Disable: `Secret Storage Service` and `SSH Key Agent`
```

Add the following lines to the file `~/.gnupg/gpg-agent.conf`:

```text
default-cache-ttl 34560000
max-cache-ttl 34560000

default-cache-ttl-ssh 34560000
max-cache-ttl-ssh 34560000
```

Install CLI tool for GNUpg passphrase, and make it the default:

```shell
sudo apt install pinentry-tty
sudo update-alternatives --config pinentry
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/007-tweak-debian-mate.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)
